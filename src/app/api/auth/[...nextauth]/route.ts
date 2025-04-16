import NextAuth, { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth environment variables');
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      id: 'otp-credentials',
      name: 'OTP Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        verificationToken: { label: 'Verification Token', type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        console.log("Attempting authorization via 'otp-credentials' provider");
        if (!credentials?.email || !credentials?.verificationToken) {
          console.log("OTP Credentials authorize: Missing email or token");
          return null;
        }

        const lowerCaseEmail = credentials.email.toLowerCase();

        try {
          const { db } = await connectToDatabase();
          const verifiedLoginsCollection = db.collection('verified_logins');
          const usersCollection = db.collection('users');

          const verifiedLogin = await verifiedLoginsCollection.findOne({
            email: lowerCaseEmail,
            verificationToken: credentials.verificationToken,
            expiresAt: { $gt: new Date() },
          });

          if (!verifiedLogin) {
             console.log("OTP Credentials authorize: No valid verified login found for email:", lowerCaseEmail);
             const expiredCheck = await verifiedLoginsCollection.findOne({ email: lowerCaseEmail, verificationToken: credentials.verificationToken });
             if (expiredCheck) console.log("Reason: Verification token expired.");
             else console.log("Reason: Token mismatch or record not found.");
             return null;
          }

          await verifiedLoginsCollection.deleteOne({ _id: verifiedLogin._id });
          console.log("OTP Credentials authorize: Verification token validated and deleted for:", lowerCaseEmail);

          const user = await usersCollection.findOne({ email: lowerCaseEmail });

          if (!user) {
            console.error("OTP Credentials authorize: User not found in users collection despite valid token for email:", lowerCaseEmail);
            return null;
          }

          console.log("OTP Credentials authorize: Success, returning user object for:", lowerCaseEmail);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };

        } catch (error) {
          console.error('Error during OTP Credentials authorization:', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
        id: 'credentials',
        name: 'Standard Credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, req): Promise<User | null> {
            console.warn("Direct 'credentials' provider authorize called. In OTP flow, this should not grant login. Returning null.");
            return null;
        }
    }),
  ],
  pages: {
    signIn: '/session/new',
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };