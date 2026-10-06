import type { Card } from '@/shared/card';
import type { QRStyle } from './qr-style-types';
import { buildCompactVCard } from '@/shared/vcard';
import { renderQRToCanvas } from './qr-renderer';
import { ensureFontLoaded } from './fonts';

export interface WallpaperPreset {
  id: string;
  name: string;
  tagline: string;
  gradientStops: [string, string, ...string[]];
  gradientAngle: number;
  textColor: string;
  subtextColor: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'minimal-charcoal',
    name: 'Minimal Charcoal',
    tagline: 'Deep slate basalt with subtle ambient gradient',
    gradientStops: ['#121316', '#1a1c22', '#101114'],
    gradientAngle: 180,
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    id: 'pure-oled',
    name: 'Pure OLED Black',
    tagline: 'True black background for zero OLED battery consumption',
    gradientStops: ['#000000', '#020204', '#000000'],
    gradientAngle: 180,
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    id: 'nordic-navy',
    name: 'Nordic Navy',
    tagline: 'Calm deep oceanic navy with soft depth',
    gradientStops: ['#0a1120', '#121d33', '#080d19'],
    gradientAngle: 160,
    textColor: '#FFFFFF',
    subtextColor: 'rgba(224, 231, 255, 0.75)',
  },
  {
    id: 'warm-espresso',
    name: 'Warm Espresso',
    tagline: 'Warm organic linen and rich coffee undertones',
    gradientStops: ['#1e1814', '#2b231d', '#181310'],
    gradientAngle: 150,
    textColor: '#FFFBF7',
    subtextColor: 'rgba(255, 243, 235, 0.75)',
  },
  {
    id: 'custom-card-style',
    name: 'Card Style Mirror',
    tagline: 'Directly mirrors your custom card background and palette',
    gradientStops: ['#111317', '#1a1d24', '#111317'],
    gradientAngle: 145,
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
  },
];

export interface WallpaperOptions {
  width?: number;
  height?: number;
  backdropChoice?: 'style' | 'charcoal' | 'navy' | 'warm';
  presetId?: string;
  frameStyle?: 'glass' | 'minimal';
}

export interface WallpaperResult {
  dataUrl: string;
  width: number;
  height: number;
  safeZone: {
    topPercent: number; // ~32%
    bottomPercent: number; // ~14%
    qrYPercent: number;
  };
}

export const WALLPAPER_BACKDROPS = {
  charcoal: '#111317',
  navy: '#0E1B33',
  warm: '#3A332B',
};

export async function generateLockScreenWallpaper(
  card: Card,
  style: QRStyle,
  photoImage: HTMLImageElement | ImageBitmap | null,
  options: WallpaperOptions = {}
): Promise<WallpaperResult> {
  let width = options.width || (typeof window !== 'undefined' ? Math.round(window.screen.width * (window.devicePixelRatio || 2)) : 1080);
  let height = options.height || (typeof window !== 'undefined' ? Math.round(window.screen.height * (window.devicePixelRatio || 2)) : 2400);

  // Fallback defaults for desktop browsers or unusual metrics
  if (width < 600 || height < 1000) {
    width = 1080;
    height = 2400;
  }

  // Clamp longest side to 4096px
  if (height > 4096) {
    width = Math.round((width * 4096) / height);
    height = 4096;
  }
  if (width > 4096) {
    height = Math.round((height * 4096) / width);
    width = 4096;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Resolve Preset Configuration
  const selectedPreset = WALLPAPER_PRESETS.find((p) => p.id === options.presetId) || WALLPAPER_PRESETS[0];

  // Background Gradient Resolution
  let gradientStops = [...selectedPreset.gradientStops];
  let gradientAngle = selectedPreset.gradientAngle;

  if (options.presetId === 'custom-card-style' || options.backdropChoice === 'style') {
    if (style.backdropGradient && style.backdropGradient.stops.length >= 2) {
      gradientStops = [style.backdropGradient.stops[0], style.backdropGradient.stops[1]];
      gradientAngle = style.backdropGradient.angle;
    } else if (style.backdropColor) {
      gradientStops = [style.backdropColor, '#0a0a0d'];
    }
  } else if (options.backdropChoice === 'charcoal') {
    gradientStops = ['#111317', '#1a1d24', '#0d0f12'];
  } else if (options.backdropChoice === 'navy') {
    gradientStops = ['#081224', '#0E1B33', '#060d1a'];
  } else if (options.backdropChoice === 'warm') {
    gradientStops = ['#2b221a', '#3A332B', '#1c1611'];
  }

  // Draw Background Gradient
  const angleRad = (gradientAngle * Math.PI) / 180;
  const x1 = width / 2 - Math.cos(angleRad) * (width / 2);
  const y1 = height / 2 - Math.sin(angleRad) * (height / 2);
  const x2 = width / 2 + Math.cos(angleRad) * (width / 2);
  const y2 = height / 2 + Math.sin(angleRad) * (height / 2);

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  gradientStops.forEach((stop, index) => {
    grad.addColorStop(index / Math.max(1, gradientStops.length - 1), stop);
  });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Ambient Vignette
  const vignette = ctx.createLinearGradient(0, 0, 0, height);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  vignette.addColorStop(0.35, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // 2. Safe-Zone Math:
  // Top 32% clear (Clock & Notifications)
  // Bottom 14% clear (Shortcuts & Gesture Bar)
  const qrWidth = Math.min(Math.round(width * 0.58), 900);
  const qrCanvas = document.createElement('canvas');
  const payload = buildCompactVCard(card);

  renderQRToCanvas({
    canvas: qrCanvas,
    payload,
    style,
    size: qrWidth,
    photoImage,
    forceEccH: true,
  });

  const qrX = Math.round((width - qrWidth) / 2);
  const qrY = Math.round(height * 0.38);

  // 3. Render Minimalist QR Plate
  const pad = Math.round(width * 0.035);
  const plateX = qrX - pad;
  const plateY = qrY - pad;
  const plateW = qrWidth + pad * 2;
  const plateH = qrWidth + pad * 2;
  const radius = Math.round(width * 0.05);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(plateX, plateY, plateW, plateH, radius);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = Math.round(width * 0.04);
  ctx.shadowOffsetY = Math.round(width * 0.015);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = Math.max(1.5, Math.round(width * 0.002));
  ctx.shadowColor = 'transparent';
  ctx.stroke();

  // Draw QR Image
  ctx.drawImage(qrCanvas, qrX, qrY);
  ctx.restore();

  // 4. Typographic Identity Beneath QR Plate
  const textY = qrY + qrWidth + Math.round(height * 0.04);
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');

  await ensureFontLoaded(style.captionFont || 'Fraunces', '700', fullName);

  ctx.fillStyle = selectedPreset.textColor;
  ctx.textAlign = 'center';
  const nameSize = Math.round(width * 0.055);
  ctx.font = `bold ${nameSize}px '${style.captionFont || 'Fraunces'}', Georgia, serif`;
  ctx.fillText(fullName, width / 2, textY);

  const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
  if (subtitle) {
    ctx.fillStyle = selectedPreset.subtextColor;
    const subSize = Math.round(width * 0.032);
    ctx.font = `500 ${subSize}px 'Instrument Sans', -apple-system, sans-serif`;
    ctx.fillText(subtitle, width / 2, textY + Math.round(nameSize * 1.15));
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
    safeZone: {
      topPercent: 32,
      bottomPercent: 14,
      qrYPercent: Math.round((qrY / height) * 100),
    },
  };
}
