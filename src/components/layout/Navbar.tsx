"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, LogOut } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const navLinks = [
  { href: '/shots/popular', label: 'Explore', hasDropdown: true },
  { href: '/designers', label: 'Hire a Designer', hasDropdown: true },
  { href: '/jobs', label: 'Find Jobs' },
  { href: '/stories', label: 'Blog' },
];

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return '??';
}

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-dribbble-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-dribbble-text relative">
                <svg width="76" height="30" fill="currentColor" viewBox="0 0 76 30" className="text-dribbble-text">
                  <path fillRule="evenodd" clipRule="evenodd" d="M75.8822 14.6381C75.8822 16.2566 75.5071 17.8752 74.7565 19.3687C74.0062 20.8623 72.9566 22.1307 71.6823 23.1746C70.4077 24.2184 68.9086 25.0368 67.2841 25.5561C65.6599 26.0753 63.9107 26.3348 62.1617 26.3348C60.4128 26.3348 58.7391 26.0753 57.0393 25.5561C55.3397 25.0368 53.8157 24.2184 52.5411 23.1746C51.2665 22.1307 50.2173 20.8623 49.4667 19.3687C48.7165 17.8752 48.3413 16.2566 48.3413 14.6381C48.3413 13.0199 48.7165 11.4763 49.4667 9.9078C50.2173 8.33926 51.2665 7.09585 52.5411 6.02703C53.8157 4.95821 55.3397 4.16479 57.0393 3.6205C58.7391 3.07622 60.4128 2.79166 62.1617 2.79166C63.9107 2.79166 65.6599 3.07622 67.2841 3.6205C68.9086 4.16479 70.4077 4.95821 71.6823 6.02703C72.9566 7.09585 74.0062 8.33926 74.7565 9.9078C75.5071 11.4763 75.8822 13.0199 75.8822 14.6381ZM71.1316 14.6381C71.1316 13.4956 70.8814 12.3531 70.4077 11.2855C69.9337 10.2179 69.2339 9.30074 68.3841 8.48228C67.5343 7.66382 66.5355 7.02259 65.3862 6.5784C64.2369 6.13422 63.0124 5.89453 61.7378 5.89453C60.4631 5.89453 59.2635 6.13422 58.0892 6.5784C56.915 7.02259 55.8908 7.66382 54.991 8.48228C54.0915 9.30074 53.3917 10.2179 52.9177 11.2855C52.4436 12.3531 52.1936 13.4956 52.1936 14.6381C52.1936 15.7806 52.4436 16.9232 52.9177 17.9908C53.3917 19.0584 54.0915 19.9504 54.991 20.7689C55.8908 21.5873 56.915 22.2285 58.0892 22.6978C59.2635 23.167 60.4631 23.4067 61.7378 23.4067C63.0124 23.4067 64.2369 23.167 65.3862 22.6978C66.5355 22.2285 67.5343 21.5873 68.3841 20.7689C69.2339 19.9504 69.9337 19.0584 70.4077 17.9908C70.8814 16.9232 71.1316 15.7806 71.1316 14.6381ZM41.3299 25.9405V13.2204C41.3299 13.2204 41.08 9.15805 37.478 9.15805C33.8761 9.15805 33.201 10.9013 33.201 10.9013V25.9405H28.4505V3.18555H33.201V5.54979C33.201 5.54979 34.8008 2.79166 39.1768 2.79166C43.553 2.79166 46.0803 5.89453 46.0803 11.0213V25.9405H41.3299ZM24.1686 25.9405V3.18555H19.418V25.9405H24.1686ZM21.7933 0.00032227C23.3927 0.00032227 24.6673 1.17779 24.6673 2.64151C24.6673 4.10523 23.3927 5.28271 21.7933 5.28271C20.1937 5.28271 18.9192 4.10523 18.9192 2.64151C18.9192 1.17779 20.1937 0.00032227 21.7933 0.00032227ZM8.92299 3.18555L14.6728 20.5298L14.7726 20.5549H16.5671L16.6669 20.5298L22.5162 3.18555H17.4162L14.6728 12.3531L11.9789 3.18555H8.92299ZM6.89754 5.89453V3.18555H2.14709V25.9405H6.89754V14.6381C6.89754 14.6381 6.89754 10.9513 9.22096 10.9513C11.5446 10.9513 11.5446 12.6951 11.5446 12.6951V14.6381H16.2948C16.2948 14.6381 16.2948 12.6951 16.2948 9.30074C16.2948 5.90649 13.0182 5.89453 13.0182 5.89453C13.0182 5.89453 10.8201 5.89453 8.89754 8.48228V5.89453H6.89754ZM2.17181 0.00047065C3.77128 0.00047065 5.0458 1.17794 5.0458 2.64166C5.0458 4.10538 3.77128 5.28285 2.17181 5.28285C0.562265 5.28285 -0.712784 4.10538 -0.712784 2.64166C-0.712784 1.17794 0.562265 0.00047065 2.17181 0.00047065Z" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-dribbble-menu hover:text-dribbble-text text-sm font-medium flex items-center"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="ml-1">
                      <path d="M4 6L7 3H1L4 6Z" fill="currentColor" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:flex items-center">
              <Input
                type="text"
                placeholder="Search..."
                className="search-bar w-48 lg:w-64 h-10 pl-10 pr-4"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dribbble-gray h-4 w-4" />
            </div>

            <div className="flex items-center space-x-2">
              {status === 'loading' && (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              )}

              {status === 'unauthenticated' && (
                <>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-dribbble-menu hidden sm:inline-flex"
                    onClick={() => signIn()}
                  >
                    Log in
                  </Button>
                  <Link href="/signup/new">
                    <Button className="dribbble-btn text-sm font-medium">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}

              {status === 'authenticated' && session.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={session.user.image ?? undefined}
                          alt={session.user.name ?? session.user.email ?? 'User Avatar'}
                        />
                        <AvatarFallback>
                          {getInitials(session.user.name, session.user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name ?? 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
