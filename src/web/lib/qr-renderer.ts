import QRCode from 'qrcode';
import type { QRStyle } from './qr-style-types';

export interface RenderQROptions {
  canvas: HTMLCanvasElement;
  payload: string;
  style: QRStyle;
  size?: number; // Target pixel width/height (e.g. 512, 1024, 1200)
  photoImage?: HTMLImageElement | ImageBitmap | null;
  forceEccH?: boolean;
}

export function isFinderPattern(row: number, col: number, moduleCount: number): boolean {
  // Top-Left (7x7 plus 1-module separator)
  if (row < 7 && col < 7) return true;
  // Top-Right
  if (row < 7 && col >= moduleCount - 7) return true;
  // Bottom-Left
  if (row >= moduleCount - 7 && col < 7) return true;
  return false;
}

export function isFinderEyeInner(row: number, col: number, moduleCount: number): boolean {
  // 3x3 inner square in 7x7 finder
  if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
  if (row >= 2 && row <= 4 && col >= moduleCount - 5 && col <= moduleCount - 3) return true;
  if (row >= moduleCount - 5 && row >= moduleCount - 3 && col >= 2 && col <= 4) return true;
  return false;
}

export function renderQRToCanvas({
  canvas,
  payload,
  style,
  size = 600,
  photoImage = null,
  forceEccH = false,
}: RenderQROptions): void {
  const hasCenter = style.centerElement.type !== 'none' || !!photoImage;
  const eccLevel = forceEccH || hasCenter ? 'H' : 'M';

  const qr = QRCode.create(payload, { errorCorrectionLevel: eccLevel });
  const moduleCount = qr.modules.size;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);

  const quietModules = Math.max(style.quietZone || 4, 4);
  const totalModules = moduleCount + quietModules * 2;
  const modulePixelSize = size / totalModules;

  // 1. Draw Plate Background
  ctx.fillStyle = style.plateColor;
  const radius = style.plateRadius || 0;
  if (radius > 0 && ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, (radius / 512) * size);
    ctx.fill();
    if (style.plateBorderWidth && style.plateBorderColor) {
      ctx.lineWidth = style.plateBorderWidth;
      ctx.strokeStyle = style.plateBorderColor;
      ctx.stroke();
    }
  } else {
    ctx.fillRect(0, 0, size, size);
  }

  // 2. Setup Module Fill Style (Solid or Gradient)
  let moduleFillStyle: string | CanvasGradient = style.moduleColor;
  if (style.moduleGradient && style.moduleGradient.enabled) {
    const angleRad = (style.moduleGradient.angle * Math.PI) / 180;
    const x2 = size * Math.cos(angleRad);
    const y2 = size * Math.sin(angleRad);
    const grad = ctx.createLinearGradient(0, 0, Math.abs(x2), Math.abs(y2));
    grad.addColorStop(0, style.moduleGradient.stops[0]);
    grad.addColorStop(1, style.moduleGradient.stops[1]);
    moduleFillStyle = grad;
  }

  // 3. Compute Center Exclusion Zone if Center Element exists
  const centerPercent = style.centerElement.sizePercent || 20;
  const centerModuleSpan = Math.floor((centerPercent / 100) * moduleCount);
  const centerStart = Math.floor((moduleCount - centerModuleSpan) / 2);
  const centerEnd = centerStart + centerModuleSpan;

  // 4. Draw Data Modules (excluding finders & center box)
  ctx.fillStyle = moduleFillStyle;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col, moduleCount)) continue;

      if (
        hasCenter &&
        row >= centerStart &&
        row < centerEnd &&
        col >= centerStart &&
        col < centerEnd
      ) {
        continue;
      }

      if (qr.modules.get(row, col)) {
        const x = (col + quietModules) * modulePixelSize;
        const y = (row + quietModules) * modulePixelSize;
        drawModule(ctx, x, y, modulePixelSize, style.moduleShape);
      }
    }
  }

  // 5. Draw the Three 7x7 Finder Eyes
  const finderPositions = [
    { row: 0, col: 0 },
    { row: 0, col: moduleCount - 7 },
    { row: moduleCount - 7, col: 0 },
  ];

  finderPositions.forEach(({ row, col }) => {
    const x = (col + quietModules) * modulePixelSize;
    const y = (row + quietModules) * modulePixelSize;
    drawFinderEye(
      ctx,
      x,
      y,
      modulePixelSize * 7,
      modulePixelSize,
      style.eyeOuterShape,
      style.eyeInnerShape,
      style.eyeOuterColor || style.moduleColor,
      style.eyeInnerColor || style.moduleColor,
      style.plateColor
    );
  });

  // 6. Draw Center Element if enabled
  if (hasCenter) {
    const centerSizePx = (centerPercent / 100) * (size - quietModules * 2 * modulePixelSize);
    const centerX = size / 2;
    const centerY = size / 2;
    const half = centerSizePx / 2;

    ctx.save();

    // Ring / Border around center element
    if (style.centerElement.hasRing) {
      ctx.beginPath();
      if (style.centerElement.shape === 'circle') {
        ctx.arc(centerX, centerY, half + 4, 0, Math.PI * 2);
      } else {
        ctx.roundRect(centerX - half - 4, centerY - half - 4, centerSizePx + 8, centerSizePx + 8, 12);
      }
      ctx.fillStyle = style.centerElement.ringColor || style.plateColor;
      ctx.fill();
    }

    // Clip center region
    ctx.beginPath();
    if (style.centerElement.shape === 'circle') {
      ctx.arc(centerX, centerY, half, 0, Math.PI * 2);
    } else {
      ctx.roundRect(centerX - half, centerY - half, centerSizePx, centerSizePx, 10);
    }
    ctx.clip();

    if (photoImage && style.centerElement.type === 'photo') {
      ctx.drawImage(photoImage, centerX - half, centerY - half, centerSizePx, centerSizePx);
    } else {
      // Default Monogram / Icon Plate
      ctx.fillStyle = '#111317';
      ctx.fillRect(centerX - half, centerY - half, centerSizePx, centerSizePx);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.floor(centerSizePx * 0.45)}px 'Instrument Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', centerX, centerY);
    }

    ctx.restore();
  }
}

function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: QRStyle['moduleShape']
) {
  const pad = size * 0.04;
  const s = size - pad * 2;
  const mx = x + pad;
  const my = y + pad;

  ctx.beginPath();
  switch (shape) {
    case 'dots':
    case 'extra-rounded':
      ctx.arc(mx + s / 2, my + s / 2, s / 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'rounded':
      ctx.roundRect(mx, my, s, s, s * 0.35);
      ctx.fill();
      break;

    case 'classy':
      // Diamond with rounded soft edges
      ctx.roundRect(mx, my, s, s, [s * 0.45, 0, s * 0.45, 0]);
      ctx.fill();
      break;

    case 'diamond':
      ctx.moveTo(mx + s / 2, my);
      ctx.lineTo(mx + s, my + s / 2);
      ctx.lineTo(mx + s / 2, my + s);
      ctx.lineTo(mx, my + s / 2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'square':
    default:
      ctx.fillRect(mx, my, s, s);
      break;
  }
}

function drawFinderEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  eyeSize: number,
  modulePx: number,
  outerShape: QRStyle['eyeOuterShape'],
  innerShape: QRStyle['eyeInnerShape'],
  outerColor: string,
  innerColor: string,
  plateColor: string
) {
  // 1. Outer Frame (7x7 modules)
  ctx.fillStyle = outerColor;
  ctx.beginPath();
  if (outerShape === 'circle') {
    ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2);
  } else if (outerShape === 'rounded') {
    ctx.roundRect(x, y, eyeSize, eyeSize, eyeSize * 0.28);
  } else {
    ctx.rect(x, y, eyeSize, eyeSize);
  }
  ctx.fill();

  // 2. Hollow Out 5x5 Inner Plate
  ctx.fillStyle = plateColor;
  ctx.beginPath();
  const innerHollowSize = eyeSize - modulePx * 2;
  const hx = x + modulePx;
  const hy = y + modulePx;
  if (outerShape === 'circle') {
    ctx.arc(x + eyeSize / 2, y + eyeSize / 2, innerHollowSize / 2, 0, Math.PI * 2);
  } else if (outerShape === 'rounded') {
    ctx.roundRect(hx, hy, innerHollowSize, innerHollowSize, innerHollowSize * 0.24);
  } else {
    ctx.rect(hx, hy, innerHollowSize, innerHollowSize);
  }
  ctx.fill();

  // 3. Center Pupil (3x3 modules)
  ctx.fillStyle = innerColor;
  ctx.beginPath();
  const pupilSize = modulePx * 3;
  const px = x + modulePx * 2;
  const py = y + modulePx * 2;
  if (innerShape === 'circle') {
    ctx.arc(x + eyeSize / 2, y + eyeSize / 2, pupilSize / 2, 0, Math.PI * 2);
  } else if (innerShape === 'rounded') {
    ctx.roundRect(px, py, pupilSize, pupilSize, pupilSize * 0.28);
  } else {
    ctx.rect(px, py, pupilSize, pupilSize);
  }
  ctx.fill();
}
