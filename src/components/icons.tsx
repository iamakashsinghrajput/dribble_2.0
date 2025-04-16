// src/components/icons.tsx
import {
    LucideProps,
    Moon,
    SunMedium,
    type Icon as LucideIcon,
  } from "lucide-react"
  
  // You can find SVG code for many logos online or use libraries
  // This is a basic SVG structure for the Google logo
  const GoogleIcon = (props: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.48 1.64-4.54 1.64-5.48 0-9.91-4.43-9.91-9.91s4.43-9.91 9.91-9.91c3.1 0 5.04 1.24 6.22 2.35l-2.66 2.59c-.96-.9-2.21-1.48-3.56-1.48-4.23 0-7.66 3.43-7.66 7.66s3.43 7.66 7.66 7.66c2.76 0 4.11-1.11 4.54-2.48h-4.43v-3.28h7.84c.12-.6.18-1.22.18-1.88 0-2.24-.64-4.1-1.98-5.58C16.82 4.37 14.98 3.5 12.48 3.5c-5.74 0-10.44 4.7-10.44 10.44s4.7 10.44 10.44 10.44c2.76 0 4.98-.95 6.67-2.61 1.77-1.75 2.65-4.1 2.65-7.08 0-.8-.07-1.56-.18-2.3z"/>
    </svg>
  );
  
  export const Icons = {
    sun: SunMedium,
    moon: Moon,
    google: GoogleIcon, // Export the Google icon
    // Add other icons you might need here
  };