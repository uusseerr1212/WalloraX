import React from 'react';
import { X, Trash2, Clock, ExternalLink } from 'lucide-react';
import { WallpaperBatch, WallpaperItem } from './types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  batches: WallpaperBatch[];
  onSelectWallpaper: (wp: WallpaperItem) => void;
  onRestoreBatch: (batch: WallpaperBatch) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  batches,
  onSelectWallpaper,
  onRestoreBatch,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col p-4 sm:p-5 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-neutral-100">Generation History</h2>
            <span className="text-xs text-neutral-400 font-mono">({batches.length} batches)</span>
          </div>
          <div className="flex items-center gap-1.5">
            {batches.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {batches.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-neutral-500 text-center px-4">
              <Clock className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No wallpaper batches generated yet.</p>
              <p className="text-[11px] text-neutral-600 mt-1">
                Your generated 9:16 wallpapers will appear here for easy retrieval.
              </p>
            </div>
          ) : (
            batches.map((batch) => (
              <div
                key={batch.id}
                className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-neutral-200 line-clamp-1">
                      {batch.prompt}
                    </p>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(batch.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {batch.isRemix ? ' • Remix Batch' : ' • Fresh Batch'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRestoreBatch(batch);
                      onClose();
                    }}
                    className="text-[10px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
                  >
                    <span>Load 4</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* 4 thumbnails */}
                <div className="grid grid-cols-4 gap-1.5">
                  {batch.wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        onSelectWallpaper(wp);
                        onClose();
                      }}
                      className="aspect-[9/16] rounded-lg overflow-hidden border border-neutral-800 hover:border-blue-500 transition-all group relative"
                    >
                      <img
                        src={wp.url}
                        alt={wp.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
