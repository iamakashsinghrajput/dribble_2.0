import React, { Suspense } from 'react';
import LoginForm from "@/app/api/auth/LoginForm";

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <p>Loading Login Form...</p>
        </div>
    );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}