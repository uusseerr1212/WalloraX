import React from 'react';
import { AspectRatioOption, ImageSizeOption, ModelOption, GenerationSettings as SettingsType } from './types';
import { Sparkles, Zap, Layers, Check } from 'lucide-react';

interface GenerationSettingsProps {
  settings: SettingsType;
  onChange: (updated: Partial<SettingsType>) => void;
  onClose?: () => void;
}

const ASPECT_RATIOS: { value: AspectRatioOption; label: string; desc: string; iconSize: string }[] = [
  { value: '9:16', label: '9:16', desc: 'Phone Wallpaper (Default)', iconSize: 'w-3 h-5' },
  { value: '1:1', label: '1:1', desc: 'Square / Avatar', iconSize: 'w-4 h-4' },
  { value: '2:3', label: '2:3', desc: 'Classic Portrait', iconSize: 'w-3.5 h-5' },
  { value: '3:2', label: '3:2', desc: 'Classic Landscape', iconSize: 'w-5 h-3.5' },
  { value: '3:4', label: '3:4', desc: 'Tall Portrait', iconSize: 'w-3.5 h-4.5' },
  { value: '4:3', label: '4:3', desc: 'Standard Screen', iconSize: 'w-4.5 h-3.5' },
  { value: '16:9', label: '16:9', desc: 'Desktop / Video', iconSize: 'w-5 h-3' },
  { value: '21:9', label: '21:9', desc: 'Ultrawide Cinematic', iconSize: 'w-6 h-2.5' },
];

const SIZES: { value: ImageSizeOption; label: string; tag: string; desc: string }[] = [
  { value: '1K', label: '1K Standard', tag: 'Fast', desc: 'Crisp phone resolution (approx 1024px width)' },
  { value: '2K', label: '2K Retina', tag: 'Recommended', desc: 'Super sharp HD for high-DPI displays' },
  { value: '4K', label: '4K Ultra OLED', tag: 'Maximum Detail', desc: 'Extreme fidelity for OLED screens' },
];

export const GenerationSettingsPanel: React.FC<GenerationSettingsProps> = ({
  settings,
  onChange,
}) => {
  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl mb-4 transition-all">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-neutral-100">Generation Parameters & Affordances</h2>
        </div>
        <span className="text-[11px] text-neutral-400">Customized for 9:16 mobile wallpapers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Model Selection */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            AI Image Model
          </label>
          <div className="space-y-2">
            <button
              id="model-gemini-3-pro"
              type="button"
              onClick={() => onChange({ model: 'gemini-3-pro-image-preview' })}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between ${
                settings.model === 'gemini-3-pro-image-preview'
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-md shadow-amber-500/5'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <Sparkles className={`w-4 h-4 mt-0.5 ${settings.model === 'gemini-3-pro-image-preview' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                    gemini-3-pro-image-preview
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">PRO</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Studio quality aesthetic, exquisite wallpaper textures & lighting.
                  </p>
                </div>
              </div>
              {settings.model === 'gemini-3-pro-image-preview' && (
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
            </button>

            <button
              id="model-gemini-3-1-flash"
              type="button"
              onClick={() => onChange({ model: 'gemini-3.1-flash-image-preview' })}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between ${
                settings.model === 'gemini-3.1-flash-image-preview'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-500/5'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <Zap className={`w-4 h-4 mt-0.5 ${settings.model === 'gemini-3.1-flash-image-preview' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                    gemini-3.1-flash-image-preview
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">FLASH</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Fast generation for quick iterations and broad concepts.
                  </p>
                </div>
              </div>
              {settings.model === 'gemini-3.1-flash-image-preview' && (
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Image Size Selection (1K, 2K, 4K) */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Resolution (Image Size)
          </label>
          <div className="space-y-1.5">
            {SIZES.map((size) => (
              <button
                key={size.value}
                id={`size-${size.value}`}
                type="button"
                onClick={() => onChange({ imageSize: size.value })}
                className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between ${
                  settings.imageSize === size.value
                    ? 'bg-blue-600/15 border-blue-500 text-blue-200'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                    {size.label}
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      size.value === '2K'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : size.value === '4K'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {size.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{size.desc}</p>
                </div>
                {settings.imageSize === size.value && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Aspect Ratio (Phone Default: 9:16)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = settings.aspectRatio === ratio.value;
              const isPhoneDefault = ratio.value === '9:16';
              return (
                <button
                  key={ratio.value}
                  id={`ratio-${ratio.value.replace(':', '-')}`}
                  type="button"
                  onClick={() => onChange({ aspectRatio: ratio.value })}
                  className={`px-2.5 py-2 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                      : isPhoneDefault
                      ? 'bg-neutral-950/80 border-blue-900/60 text-neutral-300 hover:border-blue-700'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-neutral-100">
                      {ratio.label}
                    </span>
                    {isPhoneDefault && (
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-medium">
                        Phone
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                    {ratio.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
