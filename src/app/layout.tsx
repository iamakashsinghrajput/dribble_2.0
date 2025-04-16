// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global styles
import AuthProvider from "@/components/providers/session-provider"; // Adjust path if needed
import Navbar from "@/components/layout/Navbar"; // Your Navbar component
import Footer from "@/components/layout/Footer"; // Your Footer component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dribbble Clone",
  description: "A clone of Dribbble built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything inside AuthProvider */}
        <AuthProvider>
           {/* You might want Navbar and Footer outside the main content area */}
           {/* but still within the AuthProvider to access session */}
           <Navbar />
           <main className="flex-grow"> {/* Add appropriate layout styling */}
             {children}
           </main>
           <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}