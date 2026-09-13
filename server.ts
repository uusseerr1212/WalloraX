import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Shared helper to get Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

// Clean up and extract base64 data & mime type from data URL or raw string
function parseImageData(imageData: string): { mimeType: string; data: string } {
  const match = imageData.match(/^data:([a-zA-Z0-9\/\+\-\.]+);base64,(.+)$/s);
  if (match) {
    return {
      mimeType: match[1] || 'image/png',
      data: match[2].trim(),
    };
  }
  return {
    mimeType: 'image/png',
    data: imageData.trim(),
  };
}

// Map aspect ratio safely to model supported ratios if needed
function normalizeAspectRatio(ratio: string): string {
  const supported = ['1:1', '3:4', '4:3', '9:16', '16:9', '1:4', '1:8', '4:1', '8:1'];
  if (supported.includes(ratio)) {
    return ratio;
  }
  if (ratio === '2:3') return '3:4';
  if (ratio === '3:2') return '4:3';
  if (ratio === '21:9') return '16:9';
  return '9:16';
}

// Generate single wallpaper variation
interface GenerateWallpaperParams {
  prompt: string;
  variationIndex?: number;
  aspectRatio?: string;
  imageSize?: string;
  model?: string;
  referenceImage?: string;
  vibeModifiers?: string;
}

async function generateSingleWallpaper({
  prompt,
  variationIndex = 0,
  aspectRatio = '9:16',
  imageSize = '1K',
  model = 'gemini-3-pro-image-preview',
  referenceImage,
  vibeModifiers = '',
}: GenerateWallpaperParams) {
  const ai = getGenAI();

  // Variation stylistic cues to give 4 distinctive takes on the user's vibe
  const variationFlavors = [
    'Cinematic wide perspective, dramatic atmospheric lighting, immersive phone wallpaper framing with clear central depth.',
    'Detailed artistic composition, rich textural subtleties, high contrast palette, aesthetic mobile wallpaper.',
    'Minimalist and clean layout with elegant negative space at top for phone lockscreen clock and widgets.',
    'Intense ambient mood, dynamic volumetric highlights, layered background atmosphere, photorealistic finish.',
  ];

  const flavor = variationFlavors[variationIndex % variationFlavors.length];
  const normalizedRatio = normalizeAspectRatio(aspectRatio);
  const normalizedSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';

  // Build model candidate list for resilient fallback
  const modelsToTry = [
    model,
    model.includes('preview') ? model.replace('-preview', '') : `${model}-preview`,
    'gemini-3-pro-image-preview',
    'gemini-3-pro-image',
    'gemini-3.1-flash-image-preview',
    'gemini-3.1-flash-image',
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Build prompt parts
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  if (referenceImage) {
    const { mimeType, data } = parseImageData(referenceImage);
    parts.push({
      inlineData: {
        mimeType,
        data,
      },
    });

    const remixPrompt = `You are an elite mobile wallpaper designer. Use the provided reference image as the structural, color, and thematic foundation to generate a fresh new phone wallpaper variation.\n` +
      `User's desired vibe / evolution: "${prompt}". ${vibeModifiers ? `Additional aesthetic notes: ${vibeModifiers}.` : ''}\n` +
      `Stylistic interpretation for this variation: ${flavor}\n` +
      `Ensure full edge-to-edge vertical wallpaper composition, crisp contrast, no watermarks, no phone UI elements, completely standalone artwork.`;

    parts.push({ text: remixPrompt });
  } else {
    const basePrompt = `Create an ultra-high quality, breathtaking mobile phone wallpaper in 9:16 vertical orientation.\n` +
      `Vibe / Theme: "${prompt}". ${vibeModifiers ? `Style notes: ${vibeModifiers}.` : ''}\n` +
      `Variation aesthetic direction: ${flavor}\n` +
      `Artwork guidelines: Edge-to-edge wallpaper composition, intentional aesthetic negative space suited for lockscreen clock and notifications, vibrant yet harmonious lighting, crisp definition, no text, no watermarks, no phone status bar mockups.`;

    parts.push({ text: basePrompt });
  }

  let lastError: any = null;

  for (const candidateModel of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: candidateModel,
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio: normalizedRatio,
            imageSize: normalizedSize,
          },
        },
      });

      // Extract image
      let imageUrl = '';
      let notes = '';

      for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
          if (part.text) {
            notes += part.text;
          }
        }
        if (imageUrl) break;
      }

      if (imageUrl) {
        return {
          id: `wp_${Date.now()}_${variationIndex}_${Math.random().toString(36).substring(2, 7)}`,
          url: imageUrl,
          aspectRatio: normalizedRatio,
          imageSize: normalizedSize,
          modelUsed: candidateModel,
          prompt,
          flavor,
          isRemix: !!referenceImage,
          timestamp: Date.now(),
          notes: notes.trim(),
        };
      }
    } catch (err: any) {
      console.warn(`Attempt with model "${candidateModel}" failed:`, err?.message || err);
      lastError = err;
      // Continue to next fallback model
    }
  }

  throw new Error(lastError?.message || 'Failed to generate wallpaper image with available models.');
}

// Endpoint: Generate a single variation (useful for progressive loading or re-rolling 1 slot)
app.post('/api/generate-wallpaper', async (req, res) => {
  try {
    const {
      prompt,
      variationIndex = 0,
      aspectRatio = '9:16',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      referenceImage,
      vibeModifiers,
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const wallpaper = await generateSingleWallpaper({
      prompt: prompt.trim(),
      variationIndex: Number(variationIndex) || 0,
      aspectRatio: String(aspectRatio || '9:16'),
      imageSize: String(imageSize || '1K'),
      model: String(model || 'gemini-3-pro-image-preview'),
      referenceImage: referenceImage ? String(referenceImage) : undefined,
      vibeModifiers: vibeModifiers ? String(vibeModifiers) : undefined,
    });

    res.json({ success: true, wallpaper });
  } catch (err: any) {
    console.error('Error generating single wallpaper:', err);
    res.status(500).json({
      error: err?.message || 'Error occurred while generating wallpaper.',
    });
  }
});

// Endpoint: Generate full batch of 4 variations
app.post('/api/generate-batch', async (req, res) => {
  try {
    const {
      prompt,
      count = 4,
      aspectRatio = '9:16',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      referenceImage,
      vibeModifiers,
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const total = Math.min(Math.max(Number(count) || 4, 1), 4);
    const tasks = Array.from({ length: total }, (_, i) =>
      generateSingleWallpaper({
        prompt: prompt.trim(),
        variationIndex: i,
        aspectRatio: String(aspectRatio || '9:16'),
        imageSize: String(imageSize || '1K'),
        model: String(model || 'gemini-3-pro-image-preview'),
        referenceImage: referenceImage ? String(referenceImage) : undefined,
        vibeModifiers: vibeModifiers ? String(vibeModifiers) : undefined,
      })
    );

    const results = await Promise.allSettled(tasks);
    const wallpapers: any[] = [];
    const errors: string[] = [];

    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        wallpapers.push(r.value);
      } else {
        errors.push(`Variation ${idx + 1}: ${r.reason?.message || 'Failed'}`);
      }
    });

    if (wallpapers.length === 0 && errors.length > 0) {
      res.status(500).json({
        error: errors.join('; '),
      });
      return;
    }

    res.json({
      success: true,
      wallpapers,
      errors: errors.length > 0 ? errors : undefined,
      batchId: `batch_${Date.now()}`,
      prompt,
      isRemix: !!referenceImage,
    });
  } catch (err: any) {
    console.error('Error generating wallpaper batch:', err);
    res.status(500).json({
      error: err?.message || 'Failed to generate wallpaper batch.',
    });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wallpaper generator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
