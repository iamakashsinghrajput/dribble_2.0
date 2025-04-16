import crypto from 'crypto';

export function generateOtp(length: number = 6): string {
  if (length < 4 || length > 10) {
    throw new Error('OTP length must be between 4 and 10 digits.');
  }
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  if (crypto.randomInt) {
     return crypto.randomInt(min, max + 1).toString().padStart(length, '0');
  }
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString().padStart(length, '0');
}