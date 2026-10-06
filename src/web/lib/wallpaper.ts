import type { Card } from '@/shared/card';
import type { QRStyle } from './qr-style-types';
import { buildCompactVCard } from '@/shared/vcard';
import { renderQRToCanvas } from './qr-renderer';
import { ensureFontLoaded } from './fonts';

export interface WallpaperOptions {
  width?: number;
  height?: number;
  backdropChoice?: 'style' | 'charcoal' | 'navy' | 'warm';
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

  // 1. Draw Backdrop
  let bg = style.backdropColor || '#111317';
  if (options.backdropChoice === 'charcoal') bg = WALLPAPER_BACKDROPS.charcoal;
  if (options.backdropChoice === 'navy') bg = WALLPAPER_BACKDROPS.navy;
  if (options.backdropChoice === 'warm') bg = WALLPAPER_BACKDROPS.warm;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle gradient depth
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Safe-Zone Math:
  // Top 32% clear (Clock & Notifications)
  // Bottom 14% clear (Shortcuts & Gesture Bar)
  // Center of active band sits at (32% + (100% - 32% - 14%) / 2) = 32% + 27% = 59%
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
  // Position QR slightly above center of active band to leave room for name
  const qrY = Math.round(height * 0.38);

  ctx.save();
  // Elevation shadow behind QR plate on wallpaper
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = Math.round(width * 0.04);
  ctx.shadowOffsetY = Math.round(width * 0.015);
  ctx.drawImage(qrCanvas, qrX, qrY);
  ctx.restore();

  // 3. Typographic Identity Beneath QR Plate
  const textY = qrY + qrWidth + Math.round(height * 0.035);
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');

  await ensureFontLoaded(style.captionFont || 'Fraunces', '700', fullName);

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  const nameSize = Math.round(width * 0.055);
  ctx.font = `bold ${nameSize}px '${style.captionFont || 'Fraunces'}', Georgia, sans-serif`;
  ctx.fillText(fullName, width / 2, textY);

  const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
  if (subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const subSize = Math.round(width * 0.032);
    ctx.font = `500 ${subSize}px 'Instrument Sans', -apple-system, sans-serif`;
    ctx.fillText(subtitle, width / 2, textY + Math.round(nameSize * 1.1));
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
