export type AspectRatioOption = '9:16' | '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '16:9' | '21:9';
export type ImageSizeOption = '1K' | '2K' | '4K';
export type ModelOption = 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview';

export type WallpaperCategory =
  | 'All'
  | 'Nature'
  | 'Cars'
  | 'Anime'
  | 'Space'
  | 'Minimal'
  | 'Abstract'
  | 'Mountains'
  | 'Gaming';

export interface WallpaperItem {
  id: string;
  title: string;
  category: Exclude<WallpaperCategory, 'All'>;
  url: string;
  aspectRatio: string;
  imageSize: string;
  modelUsed: string;
  prompt: string;
  flavor?: string;
  isRemix?: boolean;
  timestamp: number;
  notes?: string;
  variationIndex: number;
  downloads?: number;
  tags?: string[];
}

export interface GenerationSettings {
  model: ModelOption;
  imageSize: ImageSizeOption;
  aspectRatio: AspectRatioOption;
  vibeModifiers: string;
}

export interface VibePreset {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
}

export interface WallpaperBatch {
  id: string;
  prompt: string;
  timestamp: number;
  wallpapers: WallpaperItem[];
  isRemix: boolean;
  referenceImage?: string;
}
