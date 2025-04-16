import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';
import { generateOtp } from '@/lib/otp';

const OTP_EXPIRY_MINUTES = 5;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const lowerCaseEmail = email?.toLowerCase();

    if (!lowerCaseEmail || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const pendingLoginsCollection = db.collection('pending_logins');

    // 1. Find User
    const user = await usersCollection.findOne({ email: lowerCaseEmail });
    if (!user) {
      console.log('Login attempt failed: User not found for email:', lowerCaseEmail);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login attempt failed: Password mismatch for email:', lowerCaseEmail);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await pendingLoginsCollection.updateOne(
      { email: lowerCaseEmail },
      {
        $set: {
          otp: otp,
          expiresAt: expiresAt,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const emailSubject = `Your Dribbble Clone Login Code: ${otp}`;
    const emailText = `Your login verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`;
    const emailHtml = `<p>Your login verification code is <strong>${otp}</strong>.</p><p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`;

    const emailResult = await sendEmail({
      to: lowerCaseEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error("Failed to send Login OTP email:", emailResult.error);
      return NextResponse.json({ message: 'Failed to send verification code. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json(
      { message: `Verification code sent to your email.` },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login Request OTP Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}