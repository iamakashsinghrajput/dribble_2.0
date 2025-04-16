// src/components/auth/LoginForm.tsx (or choose a suitable path)
"use client"; // Keep this here!

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams is used here
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Icons } from '@/components/icons';

// --- Paste ALL the logic from your original page.tsx here ---
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook is used here
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const initialError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  useEffect(() => {
     if (initialError === 'CredentialsSignin') {
       // Customize message for failed OTP/Token signin attempt
       setError('Invalid credentials or login verification failed.');
     } else if (initialError) {
       setError(`Login error: ${initialError}`);
     }
   }, [initialError]);

  // handleCredentialsSubmit function (as before)
   const handleCredentialsSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
          const response = await fetch('/api/auth/login-request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (!response.ok) {
            setError(data.message || 'Login failed. Please check your credentials.');
          } else {
            setSuccess(data.message);
            setError(null);
            setStep('otp');
          }
        } catch (err) {
          console.error('Login request OTP client error:', err);
          setError('An unexpected network error occurred.');
        } finally {
          setIsLoading(false);
        }
      };


  // handleOtpSubmit function (as corrected before)
  const handleOtpSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
         setIsLoading(true);
         setError(null);
         setSuccess(null);
         let signInResult: Awaited<ReturnType<typeof signIn>> | null | undefined = null;

         if (!otp || otp.length !== 6) {
             setError('Please enter a valid 6-digit OTP.');
             setIsLoading(false);
             return;
         }

         try {
             const verifyResponse = await fetch('/api/auth/login-verify-otp', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ email, otp }),
             });
             const verifyData = await verifyResponse.json();
             if (!verifyResponse.ok) {
                 setError(verifyData.message || 'OTP verification failed.');
                 setOtp('');
                 throw new Error("OTP verification failed");
             }
             const { verificationToken } = verifyData;
             if (!verificationToken) {
                 setError('Verification process failed. Please try again.');
                 throw new Error("Missing verification token");
             }
             setSuccess('OTP verified. Logging in...');
             signInResult = await signIn('otp-credentials', {
                 redirect: false,
                 email: email,
                 verificationToken: verificationToken,
             });
             if (signInResult?.error) {
                 console.error("Final Sign In Error:", signInResult.error);
                 setError(signInResult.error === 'CredentialsSignin'
                     ? 'Final login step failed. Please try again.'
                     : `Login error: ${signInResult.error}`
                 );
                 setSuccess(null);
             } else if (signInResult?.ok) {
                 setError(null);
                 setSuccess('Login successful! Redirecting...');
             } else {
                 setError('An unknown error occurred during the final login step.');
                 setSuccess(null);
             }
         } catch (err: any) {
             if (!error) {
                 setError(err.message || 'An unexpected error occurred during verification.');
             }
             console.error('Client-side OTP verification/sign-in error:', err);
             setSuccess(null);
         } finally {
              if (!signInResult?.ok || error) {
                setIsLoading(false);
              }
         }

         if (signInResult?.ok && !error) {
              router.push(callbackUrl);
              router.refresh();
          }
     };


  // handleGoogleLogin function (as before)
  const handleGoogleLogin = () => {
        setIsLoading(true);
        signIn('google', { callbackUrl: callbackUrl });
      };


  // Return the actual JSX for the login form Card
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            {step === 'credentials' ? 'Log in to Dribbble' : 'Enter Verification Code'}
          </CardTitle>
           <CardDescription>
             {step === 'credentials' ? (
                 <> Access your account or{' '}
                     <Link href="/signup/new" className="font-medium text-pink-600 hover:text-pink-500">
                     Sign up
                     </Link>
                 </>
             ) : `A code was sent to ${email}` }

           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error/Success Messages */}
           {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                 <strong className="font-bold">Error: </strong>
                 <span className="block sm:inline">{error}</span>
             </div>
           )}
           {success && (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                 <strong className="font-bold">Success: </strong>
                 <span className="block sm:inline">{success}</span>
             </div>
           )}

          {/* Google Login Button */}
          {step === 'credentials' && (
             <>
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                  {/* <Icons.google className="mr-2 h-4 w-4" /> */} Log in with Google
              </Button>
               <div className="relative my-4">
                 <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                 <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
               </div>
             </>
          )}

          {/* Step 1: Credentials Form */}
          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {/* Email Input */}
               <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={isLoading} />
              </div>
              {/* Password Input */}
               <div>
                 <div className="flex items-center justify-between">
                     <Label htmlFor="password">Password</Label>
                     <div className="text-sm">
                        <Link href="/forgot-password" className="font-medium text-pink-600 hover:text-pink-500">
                            Forgot password?
                        </Link>
                     </div>
                 </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full dribbble-btn" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Log in'}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === 'otp' && (
             <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {/* OTP Input */}
                  <div>
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                        id="otp" type="text" inputMode='numeric' maxLength={6} required
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter 6-digit OTP" disabled={isLoading} autoFocus
                    />
                </div>
                 <Button type="submit" className="w-full dribbble-btn" disabled={isLoading}>
                     {isLoading ? 'Logging in...' : 'Verify Code & Log in'}
                 </Button>
                  <Button type="button" variant="link" className="w-full text-sm" onClick={() => setStep('credentials')} disabled={isLoading}>
                    Back to password
                  </Button>
             </form>
          )}

        </CardContent>
         <CardFooter className="text-center text-sm text-gray-600">
          {step === 'credentials' && <p> Don't have an account?{' '} <Link href="/signup/new" className="font-medium text-pink-600 hover:text-pink-500"> Sign up now </Link> </p>}
          {step === 'otp' && <p> Didn't receive the code? Check spam or go back. </p>}
        </CardFooter>
    </Card>
  );
}