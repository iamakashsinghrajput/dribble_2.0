import type React from 'react';
import Link from 'next/link';
import { trendingSearches } from '@/lib/mockData';

interface TrendingSearchesProps {
  searches?: string[];
}

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  searches = trendingSearches,
}) => {
  return (
    <div className="flex items-center py-3 overflow-x-auto hide-scrollbar">
      <span className="text-xs text-dribbble-menu font-medium mr-3 whitespace-nowrap">
        Trending searches:
      </span>
      <div className="flex space-x-4">
        {searches.map((search) => (
          <Link
            key={search}
            href={`/search/${encodeURIComponent(search)}`}
            className="text-xs text-dribbble-menu hover:text-dribbble-text whitespace-nowrap"
          >
            {search}
          </Link>
        ))}
      </div>
    </div>
  );
};
