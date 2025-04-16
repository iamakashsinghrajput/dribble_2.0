import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';
import { mockShots } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ShotCard } from '@/components/shot/ShotCard';

function getShot(id: string) {
  return mockShots.find(shot => shot.id === id);
}

function getRelatedShots(id: string, count = 4) {
  return mockShots
    .filter(shot => shot.id !== id)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function generateStaticParams() {
  return mockShots.map((shot) => ({
    id: shot.id,
  }));
}

export default function ShotDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const shot = getShot(params.id);

  if (!shot) {
    notFound();
  }

  const relatedShots = getRelatedShots(params.id);

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dribbble-text mb-2">{shot.title}</h1>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={shot.user.avatarUrl} alt={shot.user.name} />
                <AvatarFallback>{shot.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/${shot.user.username}`}
                  className="text-sm font-medium text-dribbble-text hover:text-dribbble-pink"
                >
                  {shot.user.name}
                </Link>
                {(shot.user.isPro || shot.user.isTeam) && (
                  <span className="ml-2 text-xs font-medium bg-gray-100 text-dribbble-menu px-1 rounded">
                    {shot.user.isPro ? 'PRO' : 'TEAM'}
                  </span>
                )}
              </div>
              <Button className="dribbble-btn text-xs py-1 px-3 h-auto">Follow</Button>
              <Button className="bg-gray-100 hover:bg-gray-200 text-dribbble-text text-xs font-medium py-1 px-3 h-auto">
                Hire Me
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <Button className="bg-gray-100 hover:bg-gray-200 text-dribbble-text px-3 py-2 h-9">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">{shot.likes}</span>
            </Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-dribbble-text px-3 py-2 h-9">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">{shot.views}</span>
            </Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-dribbble-text px-3 py-2 h-9">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-dribbble-text px-3 py-2 h-9">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-dribbble-border mb-8">
          <div className="relative aspect-video">
            <Image
              src={shot.imageUrl}
              alt={shot.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <p className="text-dribbble-text mb-6">
              This shot showcases {shot.title}. The designer has created a remarkable piece that demonstrates skill and creativity in the field of design.
            </p>

            {shot.tags && shot.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-dribbble-text mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {shot.tags.map((tag) => (
                    <Link href={`/tags/${tag}`} key={tag}>
                      <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 text-dribbble-menu border-dribbble-border rounded-md px-3 py-1">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-dribbble-text mb-2">More by {shot.user.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedShots.slice(0, 4).map((relShot) => (
                <Link href={`/shots/${relShot.id}`} key={relShot.id} className="relative aspect-square rounded-md overflow-hidden">
                  <Image src={relShot.imageUrl} alt={relShot.title} fill className="object-cover" />
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/${shot.user.username}`}>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="mb-12" />

        <div className="mb-12">
          <h2 className="text-xl font-bold text-dribbble-text mb-6">More Shots Like This</h2>
          <div className="masonry-grid">
            {relatedShots.map((relatedShot) => (
              <ShotCard key={relatedShot.id} shot={relatedShot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
