import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Flashlight,
  Camera,
  Share2,
  Check,
  Info,
} from 'lucide-react';
import { WallpaperItem } from './types';

interface FullscreenModalProps {
  wallpaper: WallpaperItem | null;
  allWallpapers: WallpaperItem[];
  onClose: () => void;
  onRemix: (wallpaper: WallpaperItem) => void;
  onSelectWallpaper: (wallpaper: WallpaperItem) => void;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  wallpaper,
  allWallpapers,
  onClose,
  onRemix,
  onSelectWallpaper,
}) => {
  const [showLockscreenUI, setShowLockscreenUI] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Close on Escape key and navigate with arrow keys
  useEffect(() => {
    if (!wallpaper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wallpaper, allWallpapers]);

  if (!wallpaper) return null;

  const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper.id);

  const handleNext = () => {
    if (allWallpapers.length === 0) return;
    const nextIdx = (currentIndex + 1) % allWallpapers.length;
    onSelectWallpaper(allWallpapers[nextIdx]);
  };

  const handlePrev = () => {
    if (allWallpapers.length === 0) return;
    const prevIdx = (currentIndex - 1 + allWallpapers.length) % allWallpapers.length;
    onSelectWallpaper(allWallpapers[prevIdx]);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const safeTitle = (wallpaper.title || wallpaper.prompt)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30);
      const filename = `pixelora-${safeTitle}.png`;

      // If data URL, download directly via anchor
      if (wallpaper.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = wallpaper.url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Remote image: fetch as blob to avoid CORS download issues
        const res = await fetch(wallpaper.url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback
      window.open(wallpaper.url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(wallpaper.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Live time for realistic lockscreen overlay
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-4 animate-fadeIn select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 px-2 py-2 z-20">
        <div className="flex items-center gap-2">
          <button
            id="close-fullscreen-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-700/60 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-100">
                {wallpaper.title || `Wallpaper #${wallpaper.variationIndex + 1}`}
              </span>
              {wallpaper.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {wallpaper.category}
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              {wallpaper.aspectRatio} | {wallpaper.imageSize} • PIXELORA
            </span>
          </div>
        </div>

        {/* Action Controls in Top Bar */}
        <div className="flex items-center gap-2">
          {/* Lockscreen Preview Toggle */}
          <button
            id="toggle-lockscreen-preview-btn"
            type="button"
            onClick={() => setShowLockscreenUI((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              showLockscreenUI
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-sm'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
            title="Toggle simulated phone lockscreen clock and widgets"
          >
            {showLockscreenUI ? <EyeOff className="w-3.5 h-3.5 text-blue-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Lockscreen View</span>
          </button>

          {/* Details toggle */}
          <button
            id="toggle-details-btn"
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
            title="Image Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Share/Copy link */}
          <button
            id="share-wallpaper-btn"
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
            title="Copy image link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Wallpaper Preview Stage */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-1">
        {/* Previous Button */}
        {allWallpapers.length > 1 && (
          <button
            id="prev-wallpaper-btn"
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all active:scale-95 shadow-xl"
            title="Previous variation"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Wallpaper Container (Simulating 9:16 phone ratio) */}
        <div
          className="relative max-h-[82vh] h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-neutral-800/90 bg-neutral-950 flex items-center justify-center transition-all"
          style={{
            aspectRatio: wallpaper.aspectRatio === '9:16' ? '9/16' : undefined,
            width: wallpaper.aspectRatio === '9:16' ? 'auto' : 'auto',
          }}
        >
          {/* Wallpaper Image */}
          <img
            src={wallpaper.url}
            alt={wallpaper.prompt}
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Realistic Lockscreen Simulation Overlay */}
          {showLockscreenUI && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 text-white font-sans">
              {/* Top Dynamic Island / Notch + Lock Icon + Time */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-20 h-4 bg-black/60 rounded-full mb-3 backdrop-blur-md" />
                <span className="text-xs font-medium tracking-wide uppercase text-white/90 drop-shadow-md">
                  {dateString}
                </span>
                <span className="text-6xl sm:text-7xl font-light tracking-tight text-white drop-shadow-xl my-1">
                  {timeString}
                </span>
              </div>

              {/* Sample Notification Widget */}
              <div className="w-full max-w-[260px] mx-auto bg-black/40 backdrop-blur-xl border border-white/15 rounded-2xl p-3 text-left shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
                  <span className="font-semibold text-blue-300">PIXELORA</span>
                  <span>now</span>
                </div>
                <p className="text-xs font-medium text-white/95 leading-snug">
                  Wallpaper ready in {wallpaper.imageSize} {wallpaper.aspectRatio}
                </p>
              </div>

              {/* Bottom Quick Actions (Flashlight & Camera + Home Bar) */}
              <div className="flex flex-col items-center pb-2">
                <div className="w-full flex items-center justify-between px-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/90 shadow-lg">
                    <Flashlight className="w-5 h-5" />
                  </div>
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/90 shadow-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                {/* Home indicator bar */}
                <div className="w-32 h-1 bg-white/80 rounded-full shadow-md" />
              </div>
            </div>
          )}

          {/* Info Details Dropdown if active */}
          {showDetails && (
            <div className="absolute inset-x-4 bottom-4 bg-black/85 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-4 text-left shadow-2xl z-30 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Metadata</span>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-neutral-200 mb-2 font-medium">"{wallpaper.prompt}"</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
                <div>Model: <span className="text-neutral-200">{wallpaper.modelUsed}</span></div>
                <div>Size: <span className="text-neutral-200">{wallpaper.imageSize}</span></div>
                <div>Aspect Ratio: <span className="text-neutral-200">{wallpaper.aspectRatio}</span></div>
                <div>Type: <span className="text-neutral-200">{wallpaper.isRemix ? 'Remix' : 'Fresh Generation'}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        {allWallpapers.length > 1 && (
          <button
            id="next-wallpaper-btn"
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all active:scale-95 shadow-xl"
            title="Next variation"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Action Dock: Download & Remix Buttons */}
      <div className="w-full max-w-md mx-auto px-3 py-3 z-20">
        <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-2 flex items-center justify-between gap-3 shadow-2xl">
          {/* Remix Button */}
          <button
            id="fullscreen-remix-btn"
            type="button"
            onClick={() => {
              onRemix(wallpaper);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-800 hover:bg-neutral-750 text-neutral-100 hover:text-white border border-neutral-700/80 active:scale-[0.98] transition-all shadow-md group"
          >
            <RefreshCw className="w-4 h-4 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
            <span>Remix This Wallpaper</span>
          </button>

          {/* Download Button */}
          <button
            id="fullscreen-download-btn"
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Wallpaper</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
