import type React from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

const categories = [
  { id: 'discover', label: 'Discover', href: '/shots/popular' },
  { id: 'animation', label: 'Animation', href: '/shots/popular/animation' },
  { id: 'branding', label: 'Branding', href: '/shots/popular/branding' },
  { id: 'illustration', label: 'Illustration', href: '/shots/popular/illustration' },
  { id: 'mobile', label: 'Mobile', href: '/shots/popular/mobile' },
  { id: 'print', label: 'Print', href: '/shots/popular/print' },
  { id: 'product-design', label: 'Product Design', href: '/shots/popular/product-design' },
  { id: 'typography', label: 'Typography', href: '/shots/popular/typography' },
  { id: 'web-design', label: 'Web Design', href: '/shots/popular/web-design' },
];

interface CategoryFiltersProps {
  activeCategory?: string;
  totalFilters?: number;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  activeCategory = 'discover',
  totalFilters = 0,
}) => {
  return (
    <div className="w-full flex items-center justify-between border-b border-dribbble-border py-3">
      <Tabs defaultValue={activeCategory} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 flex space-x-6 overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <Link href={category.href} key={category.id} passHref>
              <TabsTrigger
                value={category.id}
                className="relative h-auto rounded-none border-0 px-0 py-2 text-sm text-dribbble-menu data-[state=active]:bg-transparent data-[state=active]:text-dribbble-text data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-dribbble-text"
              >
                {category.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex-shrink-0 flex items-center">
        <button className="flex items-center space-x-1 px-4 py-1 text-sm text-dribbble-menu hover:text-dribbble-text border rounded-md border-dribbble-border">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {totalFilters > 0 && (
            <Badge className="ml-1 bg-dribbble-pink h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
              {totalFilters}
            </Badge>
          )}
        </button>
      </div>
    </div>
  );
};
