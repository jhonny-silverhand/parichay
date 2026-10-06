export interface FontMetadata {
  family: string;
  category: 'serif' | 'sans' | 'display' | 'mono' | 'script' | 'devanagari';
  scripts: ('latin' | 'devanagari')[];
  license: string;
  author: string;
  weights: number[];
  variable?: boolean;
}

export const FONT_CATALOG: FontMetadata[] = [
  // Editorial Serif
  {
    family: 'Fraunces',
    category: 'serif',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Phaedra Charles, Flavia Zimbardi',
    weights: [400, 600, 700],
    variable: true,
  },
  {
    family: 'Playfair Display',
    category: 'serif',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Claus Eggers Sørensen',
    weights: [400, 600, 700],
  },
  {
    family: 'DM Serif Display',
    category: 'serif',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Colophon Foundry',
    weights: [400],
  },
  {
    family: 'Cormorant Garamond',
    category: 'serif',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Christian Thalmann',
    weights: [400, 600, 700],
  },
  {
    family: 'Bodoni Moda',
    category: 'serif',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Owen Earl',
    weights: [400, 700],
    variable: true,
  },
  {
    family: 'Newsreader',
    category: 'serif',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Production Type',
    weights: [400, 500, 600],
    variable: true,
  },

  // Clean Sans
  {
    family: 'Instrument Sans',
    category: 'sans',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Instrument, Rodrigo Fuenzalida',
    weights: [400, 500, 600, 700],
    variable: true,
  },
  {
    family: 'DM Sans',
    category: 'sans',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Colophon Foundry',
    weights: [400, 500, 700],
  },
  {
    family: 'Manrope',
    category: 'sans',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Mikhail Sharanda',
    weights: [400, 500, 600, 700],
    variable: true,
  },
  {
    family: 'Space Grotesk',
    category: 'sans',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Florian Karsten',
    weights: [400, 500, 700],
  },

  // Character & Display
  {
    family: 'Syne',
    category: 'display',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Lucas Le Bihan',
    weights: [400, 700, 800],
    variable: true,
  },

  // Mono
  {
    family: 'JetBrains Mono',
    category: 'mono',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'JetBrains',
    weights: [400, 500, 700],
    variable: true,
  },
  {
    family: 'Space Mono',
    category: 'mono',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Colophon Foundry',
    weights: [400, 700],
  },

  // Script & Handwritten
  {
    family: 'Caveat',
    category: 'script',
    scripts: ['latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Impallari Type',
    weights: [400, 600, 700],
  },
  {
    family: 'Kalam',
    category: 'script',
    scripts: ['latin', 'devanagari'],
    license: 'SIL Open Font License 1.1',
    author: 'Indian Type Foundry',
    weights: [400, 700],
  },

  // Devanagari (Hindi, Marathi)
  {
    family: 'Noto Sans Devanagari',
    category: 'devanagari',
    scripts: ['devanagari', 'latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Google Fonts Team',
    weights: [400, 500, 600, 700],
  },
  {
    family: 'Noto Serif Devanagari',
    category: 'devanagari',
    scripts: ['devanagari', 'latin'],
    license: 'SIL Open Font License 1.1',
    author: 'Google Fonts Team',
    weights: [400, 600, 700],
  },
];

/**
 * Checks if a string contains Devanagari characters (Unicode range U+0900 to U+097F).
 */
export function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Detects whether the chosen font covers the characters in the text.
 * If text contains Devanagari and the chosen font does not support it,
 * returns the best matching Noto font.
 */
export function resolveFontFamilyWithFallback(chosenFamily: string, sampleText: string): {
  family: string;
  hasFallback: boolean;
  fallbackReason?: string;
} {
  const meta = FONT_CATALOG.find((f) => f.family.toLowerCase() === chosenFamily.toLowerCase());
  const needsDevanagari = hasDevanagari(sampleText);

  if (needsDevanagari) {
    if (!meta || !meta.scripts.includes('devanagari')) {
      const isSerif = meta?.category === 'serif';
      const fallback = isSerif ? 'Noto Serif Devanagari' : 'Noto Sans Devanagari';
      return {
        family: `${fallback}, ${chosenFamily}`,
        hasFallback: true,
        fallbackReason: `Text contains Devanagari script; paired with ${fallback} for correct rendering.`,
      };
    }
  }

  return {
    family: chosenFamily,
    hasFallback: false,
  };
}

/**
 * Ensures a font is loaded before canvas drawing or export.
 */
export async function ensureFontLoaded(family: string, weight = '400', sample = 'Parichay'): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await document.fonts.load(`${weight} 16px "${family}"`, sample);
    await document.fonts.ready;
  } catch (e) {
    console.warn(`Font load timed out or failed for ${family}:`, e);
  }
}
