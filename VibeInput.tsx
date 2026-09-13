import React, { useState } from 'react';
import { Sparkles, Dices, RefreshCw, X, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { VIBE_PRESETS } from '../data/presets';
import { WallpaperItem } from '../types';

interface VibeInputProps {
  prompt: string;
  onChangePrompt: (newPrompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  referenceWallpaper: WallpaperItem | null;
  onClearReference: () => void;
}

export const VibeInput: React.FC<VibeInputProps> = ({
  prompt,
  onChangePrompt,
  onGenerate,
  isGenerating,
  referenceWallpaper,
  onClearReference,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * VIBE_PRESETS.length);
    const chosen = VIBE_PRESETS[randomIndex];
    onChangePrompt(chosen.prompt);
    setSelectedTag(chosen.id);
  };

  const handleSelectPreset = (preset: typeof VIBE_PRESETS[0]) => {
    onChangePrompt(preset.prompt);
    setSelectedTag(preset.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate();
  };

  return (
    <div className="space-y-3">
      {/* Active Remix Reference Banner */}
      {referenceWallpaper && (
        <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-purple-950/40 border border-blue-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg shadow-blue-500/5 animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-14 rounded-lg overflow-hidden border border-blue-400/40 shrink-0 bg-neutral-900 shadow-md">
              <img
                src={referenceWallpaper.url}
                alt="Reference wallpaper"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
                <span>Active Remix Reference</span>
              </div>
              <p className="text-xs text-neutral-300 truncate max-w-md mt-0.5">
                Next 4 variations will riff on this wallpaper's color harmony and composition.
              </p>
            </div>
          </div>

          <button
            id="clear-reference-btn"
            type="button"
            onClick={onClearReference}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700/60 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Reference</span>
          </button>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-neutral-900/90 border border-neutral-800 focus-within:border-blue-500/70 focus-within:ring-1 focus-within:ring-blue-500/50 rounded-2xl p-2 shadow-xl backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2.5 px-3 py-1 flex-1">
            {referenceWallpaper ? (
              <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-neutral-400 shrink-0" />
            )}
            <input
              id="vibe-prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => onChangePrompt(e.target.value)}
              placeholder={
                referenceWallpaper
                  ? 'Describe how to remix (e.g. "more violet neon lighting and falling rain")...'
                  : 'Describe your vibe (e.g., "rainy cyberpunk lo-fi", "minimalist deep space")...'
              }
              className="w-full bg-transparent text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none font-medium py-1.5"
            />
            {prompt && (
              <button
                type="button"
                onClick={() => onChangePrompt('')}
                className="text-neutral-500 hover:text-neutral-300 p-1"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 px-1 pb-1 sm:pb-0 justify-between sm:justify-end">
            <button
              id="random-vibe-btn"
              type="button"
              onClick={handleRandomize}
              title="Roll random vibe"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-950/60 hover:bg-neutral-800 rounded-xl border border-neutral-800/80 transition-all shrink-0"
            >
              <Dices className="w-3.5 h-3.5 text-blue-400" />
              <span>Surprise Me</span>
            </button>

            <button
              id="generate-wallpapers-btn"
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-all ${
                !prompt.trim() || isGenerating
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
                  : referenceWallpaper
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 shadow-blue-500/25 active:scale-[0.98]'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 shadow-blue-500/25 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating 4 Variations...</span>
                </>
              ) : referenceWallpaper ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Remix 4 Variations</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 4 Variations</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Vibe Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-neutral-500 shrink-0 font-medium px-1 text-[11px] uppercase tracking-wider">
          Vibe Ideas:
        </span>
        {VIBE_PRESETS.map((preset) => {
          const isSelected = selectedTag === preset.id || prompt.toLowerCase().includes(preset.title.toLowerCase());
          return (
            <button
              key={preset.id}
              id={`preset-${preset.id}`}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-blue-600/25 text-blue-200 border-blue-500/50 shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-800/80 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {preset.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
