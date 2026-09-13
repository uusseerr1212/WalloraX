import { useState, useEffect, useMemo } from 'react';
import { GenerationSettings, WallpaperBatch, WallpaperItem, WallpaperCategory } from './types';
import { PIXELORA_WALLPAPERS } from './wallpapers';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { CategoryFilter } from './CategoryFilter';
import { GenerationSettingsPanel } from './GenerationSettings';
import { VibeInput } from './VibeInput';
import { WallpaperGrid } from './WallpaperGrid';
import { FullscreenModal } from './FullscreenModal';
import { HistoryDrawer } from './HistoryDrawer';
import { Footer } from './Footer';

export default function App() {
  // Exactly 30 wallpapers collection
  const [collection, setCollection] = useState<WallpaperItem[]>(PIXELORA_WALLPAPERS);
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory>('All');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // AI Generation & Remix states
  const [prompt, setPrompt] = useState('rainy cyberpunk lo-fi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSlots, setGeneratingSlots] = useState<boolean[]>([false, false, false, false]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem | null>(null);
  const [referenceWallpaper, setReferenceWallpaper] = useState<WallpaperItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<GenerationSettings>({
    model: 'gemini-3-pro-image-preview',
    imageSize: '2K',
    aspectRatio: '9:16',
    vibeModifiers: '',
  });

  // Generation history
  const [historyBatches, setHistoryBatches] = useState<WallpaperBatch[]>(() => {
    try {
      const saved = localStorage.getItem('pixelora_history_batches');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'pixelora_featured_batch',
        prompt: 'rainy cyberpunk lo-fi street with glowing neon lights and puddles',
        timestamp: Date.now() - 1000 * 60 * 30,
        wallpapers: PIXELORA_WALLPAPERS.slice(0, 4),
        isRemix: false,
      },
    ];
  });

  // Save history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('pixelora_history_batches', JSON.stringify(historyBatches.slice(0, 20)));
    } catch {
      // storage quota
    }
  }, [historyBatches]);

  // Compute category counts from the 30 wallpapers
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const wp of collection) {
      if (wp.category) {
        counts[wp.category] = (counts[wp.category] || 0) + 1;
      }
    }
    return counts;
  }, [collection]);

  // Filter wallpapers by selected category
  const filteredWallpapers = useMemo(() => {
    if (selectedCategory === 'All') {
      return collection;
    }
    return collection.filter((wp) => wp.category === selectedCategory);
  }, [collection, selectedCategory]);

  // Reset pagination when category changes
  const handleCategoryChange = (category: WallpaperCategory) => {
    setSelectedCategory(category);
    // If selecting a category with <= 12 items, show all of them; for All show 12 initially
    setVisibleCount(12);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredWallpapers.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredWallpapers.length);
  };

  const handleSettingsChange = (updated: Partial<GenerationSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  // Generate 4 AI variations with prompt/remix
  const handleGenerateBatch = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setGeneratingSlots([true, true, true, true]);

    try {
      const res = await fetch('/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          count: 4,
          aspectRatio: settings.aspectRatio,
          imageSize: settings.imageSize,
          model: settings.model,
          referenceImage: referenceWallpaper ? referenceWallpaper.url : undefined,
          vibeModifiers: settings.vibeModifiers,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate wallpapers.');
      }

      if (data.wallpapers && data.wallpapers.length > 0) {
        const formattedWallpapers: WallpaperItem[] = data.wallpapers.map(
          (wp: any, idx: number) => ({
            ...wp,
            title: `AI Synthesis: ${prompt.slice(0, 20)}...`,
            category: referenceWallpaper?.category || 'Abstract',
            variationIndex: idx,
            timestamp: Date.now(),
          })
        );

        // Add to history
        const newBatch: WallpaperBatch = {
          id: data.batchId || `batch_${Date.now()}`,
          prompt: prompt.trim(),
          timestamp: Date.now(),
          wallpapers: formattedWallpapers,
          isRemix: !!referenceWallpaper,
          referenceImage: referenceWallpaper ? referenceWallpaper.url : undefined,
        };

        setHistoryBatches((prev) => [newBatch, ...prev]);

        // Prepend new variations to current view and focus
        setSelectedWallpaper(formattedWallpapers[0]);

        if (data.errors && data.errors.length > 0) {
          setError(`Note: ${data.errors.join('. ')}`);
        }
      } else {
        throw new Error('No wallpaper variations were returned.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err?.message || 'An error occurred while generating wallpapers. Please verify prompt or try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingSlots([false, false, false, false]);
    }
  };

  // Direct download helper with proper filename
  const handleDownloadWallpaper = async (wallpaper: WallpaperItem) => {
    try {
      const cleanTitle = (wallpaper.title || wallpaper.prompt)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
      const filename = `pixelora-${cleanTitle || 'wallpaper'}.png`;

      if (wallpaper.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = wallpaper.url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
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
      console.error('Download error:', err);
      window.open(wallpaper.url, '_blank');
    }
  };

  // Remix trigger: sets reference image and focus
  const handleRemix = (wallpaper: WallpaperItem) => {
    setReferenceWallpaper(wallpaper);
    if (wallpaper.prompt) {
      setPrompt(wallpaper.prompt);
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleClearReference = () => {
    setReferenceWallpaper(null);
  };

  const handleRestoreBatch = (batch: WallpaperBatch) => {
    setSelectedWallpaper(batch.wallpapers[0] || null);
    setPrompt(batch.prompt);
  };

  const handleClearHistory = () => {
    setHistoryBatches([]);
    localStorage.removeItem('pixelora_history_batches');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        settings={settings}
        onToggleSettings={() => setShowSettings((prev) => !prev)}
        showSettings={showSettings}
        onToggleHistory={() => setShowHistory(true)}
        historyCount={historyBatches.length}
        phoneFrameMode={phoneFrameMode}
        onTogglePhoneFrame={() => setPhoneFrameMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-5 w-full">
        {/* Conditional Phone Frame Mockup Container */}
        <div
          className={`w-full transition-all duration-300 ${
            phoneFrameMode
              ? 'max-w-[430px] my-2 bg-neutral-900/90 border-[10px] border-neutral-800 rounded-[3rem] p-4 shadow-2xl shadow-black/80 ring-1 ring-neutral-700/50 relative overflow-hidden'
              : 'max-w-5xl'
          }`}
        >
          {phoneFrameMode && (
            <div className="flex justify-center mb-3">
              <div className="w-24 h-4 bg-neutral-950 rounded-full border border-neutral-800" />
            </div>
          )}

          <div className="space-y-6">
            {/* Settings Drawer/Panel */}
            {showSettings && (
              <GenerationSettingsPanel
                settings={settings}
                onChange={handleSettingsChange}
                onClose={() => setShowSettings(false)}
              />
            )}

            {/* Hero Section */}
            <HeroSection
              totalCount={collection.length}
              activeCategory={selectedCategory}
            />

            {/* Vibe Prompt Input & Remix Mode Banner */}
            <VibeInput
              prompt={prompt}
              onChangePrompt={setPrompt}
              onGenerate={handleGenerateBatch}
              isGenerating={isGenerating}
              referenceWallpaper={referenceWallpaper}
              onClearReference={handleClearReference}
            />

            {/* Category Filter Navigation */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              categoryCounts={categoryCounts}
              totalCount={collection.length}
            />

            {/* 30 Wallpapers Collection Grid with Load More */}
            <WallpaperGrid
              wallpapers={filteredWallpapers}
              allWallpapersCount={collection.length}
              isGenerating={isGenerating}
              generatingSlots={generatingSlots}
              onSelect={setSelectedWallpaper}
              onRemix={handleRemix}
              onDownload={handleDownloadWallpaper}
              visibleCount={visibleCount}
              onLoadMore={handleLoadMore}
              onShowAll={handleShowAll}
              categoryName={selectedCategory}
              error={error}
            />
          </div>
        </div>
      </main>

      {/* Fullscreen Wallpaper Modal with Lockscreen Simulation */}
      <FullscreenModal
        wallpaper={selectedWallpaper}
        allWallpapers={filteredWallpapers}
        onClose={() => setSelectedWallpaper(null)}
        onRemix={handleRemix}
        onSelectWallpaper={setSelectedWallpaper}
      />

      {/* Generation History Drawer */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        batches={historyBatches}
        onSelectWallpaper={(wp) => {
          setSelectedWallpaper(wp);
        }}
        onRestoreBatch={handleRestoreBatch}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategoryChange}
        totalCount={collection.length}
      />
    </div>
  );
}
