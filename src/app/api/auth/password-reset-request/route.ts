// src/app/api/auth/password-reset-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const lowerCaseEmail = email?.toLowerCase();

    if (!lowerCaseEmail) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(lowerCaseEmail)) {
       return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const tokensCollection = db.collection('password_reset_tokens');

    const user = await usersCollection.findOne({ email: lowerCaseEmail });

    const genericSuccessMessage = 'If an account with that email exists, a password reset link has been sent.';

    if (!user) {
      console.log(`Password reset request for non-existent email: ${lowerCaseEmail}`);
      return NextResponse.json({ message: genericSuccessMessage }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await tokensCollection.updateOne(
      { email: lowerCaseEmail },
      {
        $set: {
          token: resetToken,
          expiresAt: expiresAt,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const emailSubject = 'Reset Your Dribbble Clone Password';
    const emailText = `You requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in ${RESET_TOKEN_EXPIRY_HOURS} hour(s). If you didn't request this, please ignore this email.`;
    const emailHtml = `<p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link will expire in ${RESET_TOKEN_EXPIRY_HOURS} hour(s).</p><p>If you didn't request this, please ignore this email.</p>`;

    const emailResult = await sendEmail({
      to: lowerCaseEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json({ message: genericSuccessMessage }, { status: 200 });
    }

    console.log(`Password reset email successfully requested for: ${lowerCaseEmail}`);
    return NextResponse.json({ message: genericSuccessMessage }, { status: 200 });

  } catch (error) {
    console.error('Password Reset Request Error:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}