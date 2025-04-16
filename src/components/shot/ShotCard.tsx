import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Eye } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isPro?: boolean;
  isTeam?: boolean;
}

export interface Shot {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  views: number;
  user: User;
  tags?: string[];
  isAnimated?: boolean;
  isVideo?: boolean;
  isMultiple?: boolean;
}

interface ShotCardProps {
  shot: Shot;
}

export const ShotCard: React.FC<ShotCardProps> = ({ shot }) => {
  return (
    <div className="shot-card group">
      <Link href={`/shots/${shot.id}`} className="block relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
          <Image
            src={shot.imageUrl}
            alt={shot.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="shot-card-image object-cover"
          />
          {(shot.isAnimated || shot.isVideo || shot.isMultiple) && (
            <div className="absolute top-3 right-3 flex space-x-1">
              {shot.isAnimated && (
                <div className="bg-white p-1 rounded-full shadow-sm" title="Animated Shot">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 2.5V13.5L13 8L3 2.5Z" fill="currentColor" />
                  </svg>
                </div>
              )}
              {shot.isVideo && (
                <div className="bg-white p-1 rounded-full shadow-sm" title="Video Shot">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z" fill="currentColor" />
                  </svg>
                </div>
              )}
              {shot.isMultiple && (
                <div className="bg-white p-1 rounded-full shadow-sm" title="Multiple Shots">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor"/>
                    <rect x="1.5" y="8.5" width="6" height="6" rx="1" stroke="currentColor"/>
                    <rect x="8.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor"/>
                    <rect x="8.5" y="8.5" width="6" height="6" rx="1" stroke="currentColor"/>
                  </svg>
                </div>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>
      </Link>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Link href={`/${shot.user.username}`}>
            <Avatar className="h-7 w-7">
              <AvatarImage src={shot.user.avatarUrl} alt={shot.user.name} />
              <AvatarFallback>{shot.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center">
            <Link
              href={`/${shot.user.username}`}
              className="text-xs font-medium text-dribbble-text hover:text-dribbble-pink"
            >
              {shot.user.name}
            </Link>
            {shot.user.isPro && (
              <span className="ml-1 text-[10px] font-medium bg-gray-100 text-dribbble-menu px-1 rounded">
                PRO
              </span>
            )}
            {shot.user.isTeam && (
              <span className="ml-1 text-[10px] font-medium bg-gray-100 text-dribbble-menu px-1 rounded">
                TEAM
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-dribbble-menu">
          <button className="flex items-center text-xs group" aria-label="Like">
            <Heart className="w-3.5 h-3.5 mr-1 group-hover:text-dribbble-pink" />
            <span>{shot.likes}</span>
          </button>
          <div className="flex items-center text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" />
            <span>{shot.views >= 1000 ? `${(shot.views / 1000).toFixed(1)}k` : shot.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
