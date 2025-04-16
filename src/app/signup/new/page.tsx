// src/app/signup/new/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step

  // Handles initial registration request (sends OTP)
  const handleRegisterRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success message

    if (!email || !password) {
        setError('Email and password are required.');
        setIsLoading(false);
        return;
    }
     if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
    }

    try {
      // Call the new endpoint
      const response = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send OTP. Please try again.');
      } else {
        setSuccess(data.message); // e.g., "OTP sent to your email."
        setIsOtpSent(true); // Move to OTP verification step
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      console.error('Client-side register request error:', err);
      setError('An unexpected error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handles OTP verification
  const handleOtpVerification = async (event: React.FormEvent) => {
    event.preventDefault();
     setIsLoading(true);
     setError(null); // Clear previous errors
     setSuccess(null); // Clear previous success message

     if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP.');
        setIsLoading(false);
        return;
     }

      try {
        const response = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }), // Send email and OTP
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'OTP verification failed.');
        } else {
            setSuccess(data.message || 'Account created successfully! Redirecting...');
            setError(null);
            // Redirect to login after success
            setTimeout(() => {
            router.push('/session/new');
            }, 2000);
        }
    } catch (err) {
         console.error('Client-side OTP verification error:', err);
         setError('An unexpected error occurred during verification.');
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            {isOtpSent ? 'Verify Your Email' : 'Create your Dribbble Account'}
          </CardTitle>
          <CardDescription>
            {isOtpSent
              ? `Enter the 6-digit code sent to ${email}`
              : (
                  <>
                    Or{' '}
                    <Link href="/session/new" className="font-medium text-pink-600 hover:text-pink-500">
                      Log in to your account
                    </Link>
                  </>
                )
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error and Success Messages */}
          {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && !error && ( // Only show success if no error
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Success: </strong>
                <span className="block sm:inline">{success}</span>
            </div>
          )}

          {/* --- Step 1: Registration Form --- */}
          {!isOtpSent && (
            <form onSubmit={handleRegisterRequest} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (min. 6 characters)" disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full dribbble-btn" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Create Account & Send OTP'}
                </Button>
            </form>
          )}

           {/* --- Step 2: OTP Verification Form --- */}
          {isOtpSent && (
            <form onSubmit={handleOtpVerification} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text" // Use text to allow leading zeros easily
                    inputMode='numeric' // Hint for numeric keyboard on mobile
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Allow only digits
                    placeholder="Enter 6-digit OTP"
                    disabled={isLoading}
                    className="mt-1"
                    />
                </div>
                <Button type="submit" className="w-full dribbble-btn" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify OTP & Create Account'}
                </Button>
                {/* Optional: Add a "Resend OTP" button here later */}
                 <Button type="button" variant="link" className="w-full text-sm" onClick={() => handleRegisterRequest(new Event('submit'))} disabled={isLoading}>
                    Resend OTP
                 </Button>
            </form>
          )}

        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
            <p>
            {isOtpSent
              ? 'Didn\'t receive the code? Check your spam folder or resend.'
              : (
                <>
                    Already have an account?{' '}
                    <Link href="/session/new" className="font-medium text-pink-600 hover:text-pink-500">
                        Log in
                    </Link>
                </>
                )
            }
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}