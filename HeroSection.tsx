import React from 'react';
import { Sparkles, Layers, ShieldCheck, Download, Smartphone } from 'lucide-react';

interface HeroSectionProps {
  totalCount: number;
  activeCategory: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ totalCount }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/50 to-neutral-950/80 border border-neutral-800/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-72 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-60 h-36 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-3">
        {/* Brand Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>PIXELORA</span>
          <span className="w-1 h-1 rounded-full bg-blue-400" />
          <span>{totalCount} Curated Wallpapers</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Stunning 9:16 Phone Wallpapers & AI Vibe Remixing
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
          Explore exactly {totalCount} high-resolution mobile wallpapers across <span className="text-blue-300 font-medium">Nature</span>, <span className="text-blue-300 font-medium">Cars</span>, <span className="text-blue-300 font-medium">Anime</span>, <span className="text-blue-300 font-medium">Space</span>, <span className="text-blue-300 font-medium">Minimal</span>, <span className="text-blue-300 font-medium">Abstract</span>, <span className="text-blue-300 font-medium">Mountains</span>, and <span className="text-blue-300 font-medium">Gaming</span>. Preview them behind a simulated lockscreen, download instantly, or remix any vibe with AI.
        </p>

        {/* Feature Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>9:16 Phone Standard</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>8 Distinct Categories</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Free 2K/4K Resolution</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OLED True Black Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
