import jsQR from 'jsqr';

export interface ScanCheckResult {
  canScan: boolean;
  decodedPayload?: string;
  contrastRatio: number;
  isContrastSufficient: boolean;
  isInverted: boolean;
  warnings: string[];
}

/**
 * Calculates relative luminance from hex color.
 */
function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates contrast ratio between two colors (1:1 to 21:1).
 */
export function calculateContrastRatio(color1Hex: string, color2Hex: string): number {
  try {
    const l1 = getRelativeLuminance(color1Hex);
    const l2 = getRelativeLuminance(color2Hex);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 7; // fallback safe
  }
}

/**
 * Tests whether a canvas rendering of a styled QR can be successfully decoded by jsQR,
 * checks optical contrast, and flags scan reliability risks.
 */
export function checkQRCanvasScan(
  canvas: HTMLCanvasElement,
  expectedPayload: string,
  moduleColor: string,
  plateColor: string
): ScanCheckResult {
  const warnings: string[] = [];
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      canScan: false,
      contrastRatio: 1,
      isContrastSufficient: false,
      isInverted: false,
      warnings: ['Unable to inspect canvas context for scan verification.'],
    };
  }

  // 1. Contrast & Inversion Check
  const contrastRatio = calculateContrastRatio(moduleColor, plateColor);
  const isContrastSufficient = contrastRatio >= 3.5;
  if (!isContrastSufficient) {
    warnings.push('Low contrast between QR dots and plate. Stock cameras may struggle.');
  }

  const moduleLum = getRelativeLuminance(moduleColor);
  const plateLum = getRelativeLuminance(plateColor);
  const isInverted = moduleLum > plateLum;
  if (isInverted) {
    warnings.push('Inverted QR code (light dots on dark plate). Most native camera apps will fail to scan this.');
  }

  // 2. Optical Scan Test via jsQR
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  const canScan = !!code && code.data === expectedPayload;

  if (!canScan) {
    if (code && code.data !== expectedPayload) {
      warnings.push('Decoded payload mismatch: center element or style obscured finder modules.');
    } else {
      warnings.push('Barcode scanner could not detect code: reduce center size or increase contrast.');
    }
  }

  return {
    canScan,
    decodedPayload: code ? code.data : undefined,
    contrastRatio,
    isContrastSufficient,
    isInverted,
    warnings,
  };
}
