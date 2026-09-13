import React from 'react';
import {
  Layers,
  Leaf,
  Car,
  Tv,
  Rocket,
  CircleDot,
  Palette,
  Mountain,
  Gamepad2,
} from 'lucide-react';
import { WallpaperCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: WallpaperCategory;
  onSelectCategory: (category: WallpaperCategory) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

const CATEGORY_ITEMS: { id: WallpaperCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'All', label: 'All Wallpapers', icon: Layers },
  { id: 'Nature', label: 'Nature', icon: Leaf },
  { id: 'Cars', label: 'Cars', icon: Car },
  { id: 'Anime', label: 'Anime', icon: Tv },
  { id: 'Space', label: 'Space', icon: Rocket },
  { id: 'Minimal', label: 'Minimal', icon: CircleDot },
  { id: 'Abstract', label: 'Abstract', icon: Palette },
  { id: 'Mountains', label: 'Mountains', icon: Mountain },
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2 },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  return (
    <div className="w-full">
      {/* Scrollable pill container */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
        {CATEGORY_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.id;
          const count = item.id === 'All' ? totalCount : categoryCounts[item.id] || 0;

          return (
            <button
              key={item.id}
              id={`filter-cat-${item.id.toLowerCase()}`}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/25 ring-2 ring-blue-500/20 scale-[1.02]'
                  : 'bg-neutral-900/90 hover:bg-neutral-850 text-neutral-400 hover:text-neutral-200 border-neutral-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
