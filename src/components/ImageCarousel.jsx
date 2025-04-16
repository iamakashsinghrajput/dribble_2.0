import React from 'react';

const carouselItems = [
  { id: 1, label: 'Print', imageUrl: 'https://placehold.co/300x240/E2E8F0/4A5568?text=Print', altText: 'Geometric print design examples' },
  { id: 2, label: 'Animation', imageUrl: 'https://placehold.co/300x240/1A202C/E2E8F0?text=Animation', altText: 'Crypto trading animation example' },
  { id: 3, label: 'Product Design', imageUrl: 'https://placehold.co/300x240/F7FAFC/4A5568?text=Product+Design', altText: 'Web application interface for 3D model editing' },
  { id: 4, label: 'Mobile', imageUrl: 'https://placehold.co/300x240/FBBF24/1A202C?text=Mobile', altText: 'Airport map mobile application interface' },
  { id: 5, label: 'Illustration', imageUrl: 'https://placehold.co/300x240/A8D8B8/333333?text=Illustration', altText: 'Illustration of a VW bus with hops on top' },
  { id: 6, label: 'Typography', imageUrl: 'https://placehold.co/300x240/F3EAD8/4A3F30?text=Typography', altText: 'Collection of typographic logos and brand elements' },
  { id: 7, label: 'Branding', imageUrl: 'https://placehold.co/300x240/3A535A/FFFFFF?text=Branding', altText: 'Example of branding design' },
];

export default function ImageCarousel() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {carouselItems.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-60 md:w-72 lg:w-80 group cursor-pointer"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105">
              <img
                src={item.imageUrl}
                alt={item.altText}
                className="w-full h-48 md:h-56 object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm md:text-base font-medium text-gray-700 group-hover:text-gray-900">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}