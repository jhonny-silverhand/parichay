import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import type { Card, CardBackup } from '@/shared/card';
import type { QRStyle } from './qr-style-types';
import { buildCompactVCard, buildFullVCard, getVCFExportFilename } from '@/shared/vcard';
import { renderQRToCanvas } from './qr-renderer';
import { ensureFontLoaded } from './fonts';
import { BRAND } from '@/shared/brand';

/**
 * High-Resolution Styled QR PNG (1200 x 1200)
 */
export async function generateHighResPNG(
  card: Card,
  style: QRStyle,
  photoImage: HTMLImageElement | ImageBitmap | null
): Promise<string> {
  const canvas = document.createElement('canvas');
  const size = 1200;
  const payload = buildCompactVCard(card);

  renderQRToCanvas({
    canvas,
    payload,
    style,
    size,
    photoImage,
    forceEccH: true,
  });

  return canvas.toDataURL('image/png');
}

/**
 * Print-Ready Standard Business Card PNG (1050 x 600)
 * 3.5" x 2" at 300 DPI.
 * Left: Typographic Identity & Contact Details.
 * Right: Crisp High-Contrast QR Code (ECC H, >= 30% card height).
 */
export async function generatePrintCardPNG(
  card: Card,
  style: QRStyle,
  photoImage: HTMLImageElement | ImageBitmap | null
): Promise<string> {
  const width = 1050;
  const height = 600;

  await ensureFontLoaded(style.captionFont || 'Fraunces', '700', card.firstName);
  await ensureFontLoaded('Instrument Sans', '500', card.email || 'Email');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Crisp Fine-Art Paper Plate
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Subtle bleed & edge guides
  ctx.strokeStyle = 'rgba(17, 19, 23, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // 2. Render QR on Right Half (380 x 380, > 60% of card height)
  const qrCanvas = document.createElement('canvas');
  const qrSize = 380;
  const payload = buildCompactVCard(card);

  renderQRToCanvas({
    canvas: qrCanvas,
    payload,
    style: {
      ...style,
      plateRadius: 12,
      quietZone: 5,
    },
    size: qrSize,
    photoImage,
    forceEccH: true,
  });

  const qrX = width - qrSize - 60;
  const qrY = (height - qrSize) / 2;
  ctx.drawImage(qrCanvas, qrX, qrY);

  // 3. Typographic Information on Left Half
  const leftX = 64;
  let cursorY = 130;

  // Name
  ctx.fillStyle = '#111317';
  ctx.textAlign = 'left';
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');
  ctx.font = `bold 44px '${style.captionFont || 'Fraunces'}', Georgia, serif`;
  ctx.fillText(fullName, leftX, cursorY);

  // Title & Company
  cursorY += 46;
  ctx.fillStyle = '#B85226';
  ctx.font = "600 22px 'Instrument Sans', sans-serif";
  const titleLine = [card.jobTitle, card.company].filter(Boolean).join(' · ');
  if (titleLine) {
    ctx.fillText(titleLine, leftX, cursorY);
  }

  // Hairline Divider
  cursorY += 36;
  ctx.fillStyle = 'rgba(17, 19, 23, 0.12)';
  ctx.fillRect(leftX, cursorY, 440, 1.5);

  // Contact Rows
  cursorY += 44;
  ctx.fillStyle = '#505663';
  ctx.font = "400 20px 'Instrument Sans', sans-serif";

  if (card.phone) {
    ctx.fillText(card.phone, leftX, cursorY);
    cursorY += 32;
  }
  if (card.email) {
    ctx.fillText(card.email, leftX, cursorY);
    cursorY += 32;
  }
  if (card.website) {
    ctx.fillText(card.website.replace(/^https?:\/\//, ''), leftX, cursorY);
    cursorY += 32;
  }

  // Bottom Watermark
  ctx.fillStyle = '#9EA4B1';
  ctx.font = "500 13px 'Instrument Sans', sans-serif";
  ctx.letterSpacing = '0.08em';
  ctx.fillText('PARICHAY · OFFLINE CONTACT', leftX, height - 48);

  return canvas.toDataURL('image/png');
}

/**
 * Story Format PNG (1080 x 1920, 9:16)
 */
export async function generateStoryPNG(
  card: Card,
  style: QRStyle,
  photoImage: HTMLImageElement | ImageBitmap | null
): Promise<string> {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = style.backdropColor || '#111317';
  ctx.fillRect(0, 0, width, height);

  // Card Plaque
  const plaqueWidth = 860;
  const plaqueHeight = 1200;
  const px = (width - plaqueWidth) / 2;
  const py = (height - plaqueHeight) / 2;

  ctx.fillStyle = style.plateColor || '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(px, py, plaqueWidth, plaqueHeight, 36);
  else ctx.rect(px, py, plaqueWidth, plaqueHeight);
  ctx.fill();

  // QR
  const qrCanvas = document.createElement('canvas');
  const qrSize = 640;
  const payload = buildCompactVCard(card);
  renderQRToCanvas({
    canvas: qrCanvas,
    payload,
    style,
    size: qrSize,
    photoImage,
    forceEccH: true,
  });

  ctx.drawImage(qrCanvas, (width - qrSize) / 2, py + 120);

  // Name
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');
  await ensureFontLoaded(style.captionFont || 'Fraunces', '700', fullName);

  ctx.fillStyle = '#111317';
  ctx.textAlign = 'center';
  ctx.font = `bold 52px '${style.captionFont || 'Fraunces'}', Georgia, serif`;
  ctx.fillText(fullName, width / 2, py + 120 + qrSize + 90);

  const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
  if (subtitle) {
    ctx.fillStyle = '#505663';
    ctx.font = "500 32px 'Instrument Sans', sans-serif";
    ctx.fillText(subtitle, width / 2, py + 120 + qrSize + 150);
  }

  // Story Prompt
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = "600 24px 'Instrument Sans', sans-serif";
  ctx.fillText('SCAN WITH PHONE CAMERA TO SAVE', width / 2, height - 140);

  return canvas.toDataURL('image/png');
}

/**
 * Triggers native system share or fallback download for files/images.
 */
export async function shareOrDownloadFile(
  dataUrlOrText: string,
  filename: string,
  mimeType: string,
  title: string = BRAND.name
): Promise<void> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      // Write temporary file to cache
      const cleanData = dataUrlOrText.includes('base64,')
        ? dataUrlOrText.split('base64,')[1]
        : btoa(unescape(encodeURIComponent(dataUrlOrText)));

      const cacheResult = await Filesystem.writeFile({
        path: filename,
        data: cleanData,
        directory: Directory.Cache,
      });

      await Share.share({
        title,
        text: `${title} - Contact Details`,
        url: cacheResult.uri,
        dialogTitle: `Share ${filename}`,
      });
      return;
    } catch (e) {
      console.warn('Native share failed, attempting fallback...', e);
    }
  }

  // Web Share API fallback if supported
  if (typeof navigator !== 'undefined' && navigator.canShare && dataUrlOrText.startsWith('data:')) {
    try {
      const res = await (await import('./data-url-to-file')).dataUrlToFile(dataUrlOrText, filename, mimeType);
      if (navigator.canShare({ files: [res] })) {
        await navigator.share({
          files: [res],
          title,
        });
        return;
      }
    } catch {
      // Fallback to anchor click
    }
  }

  // Standard Web Download Fallback
  const a = document.createElement('a');
  a.href = dataUrlOrText.startsWith('data:')
    ? dataUrlOrText
    : `data:${mimeType};charset=utf-8,${encodeURIComponent(dataUrlOrText)}`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Exports full rich .vcf file.
 */
export async function exportVCardFile(card: Card, photoBase64?: string | null): Promise<void> {
  const vcfContent = buildFullVCard(card, photoBase64);
  const filename = getVCFExportFilename(card.firstName, card.lastName);
  await shareOrDownloadFile(vcfContent, filename, 'text/vcard;charset=utf-8', `${card.firstName} Contact`);
}
