import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

const VERIFICATION_TOKEN_EXPIRY_MINUTES = 2;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const lowerCaseEmail = email?.toLowerCase();

    if (!lowerCaseEmail || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }
     if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
         return NextResponse.json({ message: 'Invalid OTP format.' }, { status: 400 });
     }

    const { db } = await connectToDatabase();
    const pendingLoginsCollection = db.collection('pending_logins');
    const verifiedLoginsCollection = db.collection('verified_logins');

    const pendingLogin = await pendingLoginsCollection.findOne({
      email: lowerCaseEmail,
      otp: otp,
      expiresAt: { $gt: new Date() },
    });

    if (!pendingLogin) {
      const expiredCheck = await pendingLoginsCollection.findOne({ email: lowerCaseEmail, otp: otp });
      if (expiredCheck) {
         return NextResponse.json({ message: 'Login OTP has expired. Please try logging in again.' }, { status: 410 });
      }
      return NextResponse.json({ message: 'Invalid OTP provided.' }, { status: 400 });
    }

    await pendingLoginsCollection.deleteOne({ _id: pendingLogin._id });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await verifiedLoginsCollection.updateOne(
        { email: lowerCaseEmail },
        {
            $set: {
                verificationToken: verificationToken,
                expiresAt: tokenExpiresAt,
                createdAt: new Date()
            }
        },
        { upsert: true }
    );

    return NextResponse.json(
      { verificationToken: verificationToken },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login Verify OTP Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during verification.' }, { status: 500 });
  }
}