import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required.' }, { status: 400 });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
        return NextResponse.json({ message: 'Invalid token format.' }, { status: 400 });
    }


    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const tokensCollection = db.collection('password_reset_tokens');

    const tokenRecord = await tokensCollection.findOne({
      token: token,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return NextResponse.json({ message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateResult = await usersCollection.updateOne(
      { email: tokenRecord.email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      console.error(`Password reset failed: User not found for email ${tokenRecord.email} associated with a valid token.`);
      await tokensCollection.deleteOne({ _id: tokenRecord._id });
      return NextResponse.json({ message: 'Failed to update password. User not found.' }, { status: 404 });
    }
     if (updateResult.modifiedCount === 0) {
         console.log(`Password for ${tokenRecord.email} was not modified (might be the same as old).`);
     }


    await tokensCollection.deleteOne({ _id: tokenRecord._id });

    console.log(`Password successfully reset for email: ${tokenRecord.email}`);
    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Password Reset Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}