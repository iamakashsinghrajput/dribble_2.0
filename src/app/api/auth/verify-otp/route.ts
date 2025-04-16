import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const lowerCaseEmail = email.toLowerCase();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }
    if (typeof otp !== 'string' || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
         return NextResponse.json({ message: 'Invalid OTP format.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const pendingCollection = db.collection('pending_verifications');

    const pendingVerification = await pendingCollection.findOne({
      email: lowerCaseEmail,
      otp: otp,
      expiresAt: { $gt: new Date() },
    });

    if (!pendingVerification) {
      const expiredCheck = await pendingCollection.findOne({ email: lowerCaseEmail, otp: otp });
      if (expiredCheck) {
         return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 410 }); // 410 Gone
      }
      return NextResponse.json({ message: 'Invalid OTP provided.' }, { status: 400 });
    }

    const { name, hashedPassword } = pendingVerification;
     const existingUser = await usersCollection.findOne({ email: lowerCaseEmail });
     if (existingUser) {
        await pendingCollection.deleteOne({ _id: pendingVerification._id });
        return NextResponse.json({ message: 'Account already verified and created.' }, { status: 200 });
     }

    const newUser = {
      email: lowerCaseEmail,
      password: hashedPassword,
      name: name,
      emailVerified: new Date(),
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await usersCollection.insertOne(newUser);

    if (!insertResult.acknowledged) {
        throw new Error('Failed to insert verified user into database.');
    }

    await pendingCollection.deleteOne({ _id: pendingVerification._id });

    return NextResponse.json(
      { message: 'Email verified successfully. Account created.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during OTP verification.' }, { status: 500 });
  }
}