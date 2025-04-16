import React from 'react';
import { CategoryFilters } from '@/components/shot/CategoryFilters';
import { TrendingSearches } from '@/components/search/TrendingSearches';
import { ShotCard } from '@/components/shot/ShotCard';
import { mockShots } from '@/lib/mockData';
import ImageCarousel from '@/components/ImageCarousel';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-16 text-center px-4 bg-white">
        <h1 className='text-7xl font-serif text-dribbble-text mb-8'>Discover the world's <br/> 
          <span>top designers</span>
        </h1>
        <p className="text-dribbble-menu text-md max-w-2xl mx-auto mb-8">
          Explore work from the most talented and accomplished designers<br/>
          <span>ready to take on your next project</span>
        </p>
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="search-bar w-full h-[46px] py-3 px-5 border border-gray-300 rounded-full focus:ring-pink-500 focus:border-pink-500" // Added basic input styling
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-dribbble-pink text-white p-2 hover:bg-pink-700"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div className="max-w-xl mx-auto mt-4">
          <TrendingSearches />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 bg-white rounded-lg shadow-sm pt-8">
        <CategoryFilters activeCategory="discover" />

        <div className="masonry-grid py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {mockShots.map((shot) => (
            <ShotCard key={shot.id} shot={shot} />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-dribbble-pink hover:bg-pink-700 text-white font-medium rounded-lg px-6 py-3 transition duration-150 ease-in-out">
            Load more shots
          </button>
        </div>
      </section>
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
         <ImageCarousel />
      </section>
    </div>
  );
}