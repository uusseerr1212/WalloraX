import React from 'react';
import { Sparkles, Download, Smartphone, Heart } from 'lucide-react';
import { WallpaperCategory } from './types';

interface FooterProps {
  onSelectCategory: (cat: WallpaperCategory) => void;
  totalCount: number;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, totalCount }) => {
  const categories: WallpaperCategory[] = [
    'Nature',
    'Cars',
    'Anime',
    'Space',
    'Minimal',
    'Abstract',
    'Mountains',
    'Gaming',
  ];

  return (
    <footer className="mt-12 border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand & Mission */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-neutral-100 tracking-wider">PIXELORA</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {totalCount} Wallpapers
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Curated collection of 30 high-resolution 9:16 phone wallpapers and AI vibe generator. Handcrafted for OLED clarity, deep contrasts, and smartphone lockscreens.
            </p>
          </div>

          {/* Quick Category Navigation */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-200 tracking-wider uppercase">
              Explore Categories
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-900 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
            <span>9:16 Vertical Smartphone Ratio</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Download className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Instant Free 2K & 4K Downloads</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>AI Vibe Remixing Engine</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} PIXELORA. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for phone wallpaper lovers</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
