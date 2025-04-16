import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';
import { generateOtp } from '@/lib/otp';

const OTP_EXPIRY_MINUTES = 10;

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const lowerCaseEmail = email.toLowerCase();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const pendingCollection = db.collection('pending_verifications');

    const existingVerifiedUser = await usersCollection.findOne({ email: lowerCaseEmail });
    if (existingVerifiedUser) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await pendingCollection.updateOne(
      { email: lowerCaseEmail },
      {
        $set: {
          name: name || null,
          hashedPassword: hashedPassword,
          otp: otp,
          expiresAt: expiresAt,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const emailSubject = `Your Dribbble Clone Verification Code: ${otp}`;
    const emailText = `Your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`;
    const emailHtml = `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`;

    const emailResult = await sendEmail({
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return NextResponse.json({ message: 'Failed to send verification email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json(
      { message: `Verification OTP sent to ${email}. Check your inbox.` },
      { status: 200 }
    );

  } catch (error) {
    console.error('Register Request Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during registration request.' }, { status: 500 });
  }
}