import React from 'react';
import { Sparkles, Smartphone, History, SlidersHorizontal } from 'lucide-react';
import { GenerationSettings } from '../types';

interface HeaderProps {
  settings: GenerationSettings;
  onToggleSettings: () => void;
  showSettings: boolean;
  onToggleHistory: () => void;
  historyCount: number;
  phoneFrameMode: boolean;
  onTogglePhoneFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onToggleSettings,
  showSettings,
  onToggleHistory,
  historyCount,
  phoneFrameMode,
  onTogglePhoneFrame,
}) => {
  const isPro = settings.model === 'gemini-3-pro-image-preview';

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Title & App Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-neutral-100 tracking-wider leading-none">
                PIXELORA
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-300 border-blue-500/30">
                30 Curated
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border hidden md:inline-flex ${
                  isPro
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                }`}
              >
                {isPro ? 'Studio 3 Pro' : 'Flash 3.1'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-tight mt-0.5">
              Premium 9:16 Phone Wallpapers & AI Vibe Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Phone Frame Toggle */}
          <button
            id="toggle-phone-frame-btn"
            type="button"
            onClick={onTogglePhoneFrame}
            title={phoneFrameMode ? 'Switch to fluid responsive layout' : 'Switch to mobile phone frame mockup'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              phoneFrameMode
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{phoneFrameMode ? 'Phone Frame' : 'Fluid View'}</span>
          </button>

          {/* Settings Toggle */}
          <button
            id="toggle-settings-btn"
            type="button"
            onClick={onToggleSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showSettings
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* History Drawer Toggle */}
          <button
            id="toggle-history-btn"
            type="button"
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800/60 transition-all"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
