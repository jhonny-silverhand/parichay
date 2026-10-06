import type { Card } from '@/shared/card';
import { buildCompactVCard } from '@/shared/vcard';
import { renderQRToCanvas } from './qr-renderer';
import { PLAIN_DEFAULT_STYLE } from './qr-style-types';
import { ensureFontLoaded } from './fonts';

export interface WalletImageResult {
  pngDataUrl: string;
  svgString: string;
  width: number;
  height: number;
}

/**
 * Generates an on-device Wallet pass image (1080 x 1350)
 * Designed specifically for Google Wallet "Add from photo" and Apple Photos pass detection.
 * Pure light plate, large QR (>= 70% width), clean typography, zero gradients near QR.
 */
export async function generateWalletPassImage(card: Card): Promise<WalletImageResult> {
  const width = 1080;
  const height = 1350;

  await ensureFontLoaded('Instrument Sans', '700', card.firstName);
  await ensureFontLoaded('Instrument Sans', '400', card.jobTitle || 'Business Card');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Pure Crisp Light Surface
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Subtle Header Bar
  ctx.fillStyle = '#111317';
  ctx.fillRect(0, 0, width, 12);

  // 2. Render High-Contrast Clean QR (760 x 760, >= 70% of width)
  const qrCanvas = document.createElement('canvas');
  const qrSize = 760;
  const payload = buildCompactVCard(card);

  renderQRToCanvas({
    canvas: qrCanvas,
    payload,
    style: {
      ...PLAIN_DEFAULT_STYLE,
      plateRadius: 0,
      quietZone: 5,
    },
    size: qrSize,
    forceEccH: false, // ECC M standard
  });

  const qrX = (width - qrSize) / 2;
  const qrY = 160;
  ctx.drawImage(qrCanvas, qrX, qrY);

  // 3. Typographic Identity Below (Never overlapping QR)
  const textY = qrY + qrSize + 80;

  ctx.fillStyle = '#111317';
  ctx.font = "bold 52px 'Instrument Sans', -apple-system, sans-serif";
  ctx.textAlign = 'center';
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');
  ctx.fillText(fullName, width / 2, textY);

  // Subtitle (Title & Company)
  const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
  if (subtitle) {
    ctx.fillStyle = '#505663';
    ctx.font = "500 32px 'Instrument Sans', -apple-system, sans-serif";
    ctx.fillText(subtitle, width / 2, textY + 54);
  }

  // Quiet Prompt
  ctx.fillStyle = '#7E8594';
  ctx.font = "600 24px 'Instrument Sans', -apple-system, sans-serif";
  ctx.letterSpacing = '0.08em';
  ctx.fillText('SCAN TO SAVE CONTACT', width / 2, height - 120);

  const pngDataUrl = canvas.toDataURL('image/png');

  // Also build clean SVG export
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#FFFFFF"/>
    <rect width="${width}" height="12" fill="#111317"/>
    <image href="${pngDataUrl}" width="${width}" height="${height}"/>
  </svg>`;

  return { pngDataUrl, svgString, width, height };
}
