import React from 'react';
import { WallpaperItem } from './types';
import { Download, RefreshCw, Maximize2, Sparkles, AlertCircle, ChevronDown, Check } from 'lucide-react';

interface WallpaperGridProps {
  wallpapers: WallpaperItem[];
  allWallpapersCount: number;
  isGenerating: boolean;
  generatingSlots: boolean[];
  onSelect: (wallpaper: WallpaperItem) => void;
  onRemix: (wallpaper: WallpaperItem) => void;
  onDownload: (wallpaper: WallpaperItem) => void;
  visibleCount: number;
  onLoadMore: () => void;
  onShowAll: () => void;
  categoryName: string;
  error?: string | null;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  allWallpapersCount,
  isGenerating,
  generatingSlots,
  onSelect,
  onRemix,
  onDownload,
  visibleCount,
  onLoadMore,
  onShowAll,
  categoryName,
  error,
}) => {
  const displayedWallpapers = wallpapers.slice(0, visibleCount);
  const hasMore = visibleCount < wallpapers.length;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-neutral-100 tracking-tight">
            {categoryName === 'All' ? 'Curated Collection' : `${categoryName} Wallpapers`}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono font-medium">
            {displayedWallpapers.length} of {wallpapers.length}
          </span>
        </div>
        <span className="text-xs text-neutral-400">
          Tap any card to view full screen with lockscreen overlay
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Notice:</span> {error}
          </div>
        </div>
      )}

      {/* Generating Indicator Slots (When user generates new AI batch) */}
      {isGenerating && (
        <div className="p-3 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-center gap-2.5 text-blue-300 text-xs font-semibold animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
          <span>PIXELORA AI is synthesizing 4 custom 9:16 variations...</span>
        </div>
      )}

      {/* Responsive Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {displayedWallpapers.map((wallpaper, idx) => {
          return (
            <div
              key={wallpaper.id || `wp-${idx}`}
              id={`wallpaper-card-${wallpaper.id}`}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/90 hover:border-blue-500/60 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 cursor-pointer select-none flex flex-col justify-between"
              onClick={() => onSelect(wallpaper)}
            >
              {/* Wallpaper Image */}
              <img
                src={wallpaper.url}
                alt={wallpaper.title || wallpaper.prompt}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Meta Bar */}
              <div className="relative z-10 p-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-blue-300 border border-white/10 shadow-sm">
                  {wallpaper.category}
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                    {wallpaper.imageSize}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Bottom Info & Quick Actions */}
              <div className="relative z-10 p-2.5 pt-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-auto">
                <div className="mb-2">
                  <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {wallpaper.title || `Wallpaper #${idx + 1}`}
                  </h3>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                    {wallpaper.flavor || wallpaper.prompt}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                  {/* Full Screen Preview */}
                  <button
                    id={`view-btn-${wallpaper.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(wallpaper);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-[11px] font-semibold text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Preview</span>
                  </button>

                  {/* Remix */}
                  <button
                    id={`remix-btn-${wallpaper.id}`}
                    type="button"
                    title="Remix this vibe"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemix(wallpaper);
                    }}
                    className="p-1.5 rounded-lg bg-black/50 hover:bg-blue-600 backdrop-blur-md text-white/80 hover:text-white transition-colors border border-white/10 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Direct Download */}
                  <button
                    id={`download-btn-${wallpaper.id}`}
                    type="button"
                    title="Download wallpaper"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(wallpaper);
                    }}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 backdrop-blur-md text-white transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {wallpapers.length === 0 && (
        <div className="py-16 text-center text-neutral-500 bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-800">
          <p className="text-sm font-semibold text-neutral-300">No wallpapers found in this category.</p>
          <p className="text-xs text-neutral-500 mt-1">Try selecting "All Wallpapers" to explore the full collection.</p>
        </div>
      )}

      {/* Load More Interaction */}
      {hasMore ? (
        <div className="pt-3 pb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="load-more-wallpapers-btn"
            type="button"
            onClick={onLoadMore}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-100 font-semibold text-xs sm:text-sm border border-neutral-700/80 hover:border-neutral-600 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 group"
          >
            <span>Load More Wallpapers</span>
            <ChevronDown className="w-4 h-4 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[11px] text-neutral-400 font-mono ml-1">
              ({displayedWallpapers.length}/{wallpapers.length})
            </span>
          </button>

          <button
            id="show-all-wallpapers-btn"
            type="button"
            onClick={onShowAll}
            className="text-xs text-neutral-400 hover:text-blue-400 font-medium py-1 px-3 transition-colors"
          >
            Show All ({wallpapers.length})
          </button>
        </div>
      ) : (
        wallpapers.length > 0 && (
          <div className="py-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 text-xs font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                You've explored all {wallpapers.length} wallpapers in {categoryName === 'All' ? 'PIXELORA' : categoryName}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};
