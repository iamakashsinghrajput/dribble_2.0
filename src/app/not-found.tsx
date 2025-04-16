import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-5xl font-bold text-dribbble-text mb-4">404</h1>
      <p className="text-2xl font-semibold text-dribbble-text mb-6">Page not found</p>
      <p className="text-dribbble-menu max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="dribbble-btn px-6 py-2">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
