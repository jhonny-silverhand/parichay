import type { Card } from '@/shared/card';
import type { QRStyle } from './qr-style-types';
import { buildCompactVCard } from '@/shared/vcard';
import { renderQRToCanvas } from './qr-renderer';
import { ensureFontLoaded } from './fonts';

export interface WallpaperPreset {
  id: string;
  name: string;
  tagline: string;
  category: 'oled' | 'aurora' | 'solaris' | 'cyber' | 'abyss' | 'prism' | 'minimal' | 'style';
  gradientStops: [string, string, ...string[]];
  gradientAngle: number;
  frameStyle: 'glass' | 'cyber' | 'minimal' | 'neon';
  accentColor: string;
  textColor: string;
  subtextColor: string;
  meshType: 'none' | 'topography' | 'grid' | 'aurora-orbs';
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'amoled-obsidian',
    name: 'Obsidian OLED',
    tagline: 'Zero-power pure black with diamond specular glass',
    category: 'oled',
    gradientStops: ['#000000', '#040508', '#000000'],
    gradientAngle: 180,
    frameStyle: 'glass',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
    meshType: 'grid',
  },
  {
    id: 'cyber-aurora',
    name: 'Cyber Aurora',
    tagline: 'Polar borealis caustics from deep indigo to emerald',
    category: 'aurora',
    gradientStops: ['#060814', '#0d2232', '#2a0b3f'],
    gradientAngle: 135,
    frameStyle: 'glass',
    accentColor: '#00F5D4',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    meshType: 'aurora-orbs',
  },
  {
    id: 'solaris-magma',
    name: 'Solaris Magma',
    tagline: 'Volcanic terracotta & brushed bronze titanium glow',
    category: 'solaris',
    gradientStops: ['#120603', '#963914', '#360c04'],
    gradientAngle: 160,
    frameStyle: 'cyber',
    accentColor: '#FF7B00',
    textColor: '#FFF4EE',
    subtextColor: 'rgba(255, 235, 224, 0.8)',
    meshType: 'topography',
  },
  {
    id: 'neo-tokyo-acid',
    name: 'Neo-Tokyo Acid',
    tagline: 'Carbon fiber titanium with high-voltage chartreuse laser grid',
    category: 'cyber',
    gradientStops: ['#08090a', '#101317', '#050607'],
    gradientAngle: 180,
    frameStyle: 'cyber',
    accentColor: '#CCFF00',
    textColor: '#FFFFFF',
    subtextColor: '#CCFF00',
    meshType: 'grid',
  },
  {
    id: 'abyssal-bioluminescence',
    name: 'Abyssal Trench',
    tagline: 'Midnight oceanic navy with bioluminescent turquoise caustics',
    category: 'abyss',
    gradientStops: ['#020612', '#05182e', '#022938'],
    gradientAngle: 145,
    frameStyle: 'glass',
    accentColor: '#00E5FF',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(224, 247, 250, 0.82)',
    meshType: 'topography',
  },
  {
    id: 'rose-quartz-prism',
    name: 'Rose Quartz Prism',
    tagline: 'High-fashion champagne blush & crystal quartz pedestal',
    category: 'prism',
    gradientStops: ['#190f15', '#381c2a', '#140810'],
    gradientAngle: 130,
    frameStyle: 'neon',
    accentColor: '#F49097',
    textColor: '#FFF0F3',
    subtextColor: 'rgba(255, 228, 235, 0.8)',
    meshType: 'aurora-orbs',
  },
  {
    id: 'bauhaus-minimal',
    name: 'Architectural Slate',
    tagline: 'Swiss precision graphite with strict typographic grid',
    category: 'minimal',
    gradientStops: ['#111214', '#18191d', '#111214'],
    gradientAngle: 180,
    frameStyle: 'minimal',
    accentColor: '#E2E8F0',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.7)',
    meshType: 'none',
  },
  {
    id: 'custom-card-style',
    name: 'Card Studio Mirror',
    tagline: 'Directly inherits your active card styling and color palette',
    category: 'style',
    gradientStops: ['#111317', '#1a1d24', '#111317'],
    gradientAngle: 145,
    frameStyle: 'glass',
    accentColor: '#B85226',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    meshType: 'topography',
  },
];

export interface WallpaperOptions {
  width?: number;
  height?: number;
  backdropChoice?: 'style' | 'charcoal' | 'navy' | 'warm';
  presetId?: string;
  frameStyle?: 'glass' | 'cyber' | 'minimal' | 'neon';
  showMetadata?: boolean;
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
  const frameStyle = options.frameStyle || selectedPreset.frameStyle;

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

  // Render Background Gradient
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

  // 2. Render Mesh / Pattern Overlay
  if (selectedPreset.meshType === 'grid') {
    ctx.save();
    ctx.strokeStyle = `${selectedPreset.accentColor}18`;
    ctx.lineWidth = 1.2;
    const gridSize = Math.round(width * 0.08);
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  } else if (selectedPreset.meshType === 'topography') {
    ctx.save();
    ctx.strokeStyle = `${selectedPreset.accentColor}24`;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 12]);
    // Organic archipelago contour curves
    for (let r = 1; r <= 5; r++) {
      ctx.beginPath();
      ctx.ellipse(width * 0.35, height * 0.45, width * (0.2 + r * 0.12), height * (0.12 + r * 0.08), 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.ellipse(width * 0.75, height * 0.7, width * (0.15 + r * 0.09), height * (0.09 + r * 0.06), -0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  } else if (selectedPreset.meshType === 'aurora-orbs') {
    ctx.save();
    const orb1 = ctx.createRadialGradient(width * 0.8, height * 0.25, 0, width * 0.8, height * 0.25, width * 0.5);
    orb1.addColorStop(0, `${selectedPreset.accentColor}35`);
    orb1.addColorStop(1, 'transparent');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, height);

    const orb2 = ctx.createRadialGradient(width * 0.2, height * 0.75, 0, width * 0.2, height * 0.75, width * 0.55);
    orb2.addColorStop(0, `${selectedPreset.accentColor}25`);
    orb2.addColorStop(1, 'transparent');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Atmospheric Ambient Vignette
  const vignette = ctx.createLinearGradient(0, 0, 0, height);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
  vignette.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // 3. Safe-Zone Math:
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

  // 4. Render Decorative Pedestal / Frame around QR
  const pad = Math.round(width * 0.04);
  const plateX = qrX - pad;
  const plateY = qrY - pad;
  const plateW = qrWidth + pad * 2;
  const plateH = qrWidth + pad * 2;
  const radius = Math.round(width * 0.06);

  ctx.save();
  if (frameStyle === 'neon') {
    // Neon radial aura halo
    const neonHalo = ctx.createRadialGradient(
      plateX + plateW / 2,
      plateY + plateH / 2,
      plateW * 0.4,
      plateX + plateW / 2,
      plateY + plateH / 2,
      plateW * 0.75
    );
    neonHalo.addColorStop(0, `${selectedPreset.accentColor}40`);
    neonHalo.addColorStop(1, 'transparent');
    ctx.fillStyle = neonHalo;
    ctx.fillRect(plateX - pad * 2, plateY - pad * 2, plateW + pad * 4, plateH + pad * 4);
  }

  // Draw Plate Base
  ctx.beginPath();
  ctx.roundRect(plateX, plateY, plateW, plateH, radius);

  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = Math.round(width * 0.05);
  ctx.shadowOffsetY = Math.round(width * 0.02);

  if (frameStyle === 'glass') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  } else if (frameStyle === 'cyber') {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.85)';
  } else if (frameStyle === 'minimal') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  }
  ctx.fill();

  // Plate Specular Border
  ctx.shadowColor = 'transparent';
  if (frameStyle === 'glass') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = Math.max(2, Math.round(width * 0.003));
  } else if (frameStyle === 'cyber') {
    ctx.strokeStyle = `${selectedPreset.accentColor}70`;
    ctx.lineWidth = Math.max(2, Math.round(width * 0.003));
  } else if (frameStyle === 'neon') {
    ctx.strokeStyle = selectedPreset.accentColor;
    ctx.lineWidth = Math.max(3, Math.round(width * 0.004));
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();

  // Cybernetic Corner Brackets if Cyber Frame
  if (frameStyle === 'cyber') {
    const bracketLen = Math.round(width * 0.06);
    ctx.strokeStyle = selectedPreset.accentColor;
    ctx.lineWidth = 3.5;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(plateX - 8, plateY + bracketLen);
    ctx.lineTo(plateX - 8, plateY - 8);
    ctx.lineTo(plateX + bracketLen, plateY - 8);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(plateX + plateW + 8 - bracketLen, plateY - 8);
    ctx.lineTo(plateX + plateW + 8, plateY - 8);
    ctx.lineTo(plateX + plateW + 8, plateY + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(plateX - 8, plateY + plateH - bracketLen);
    ctx.lineTo(plateX - 8, plateY + plateH + 8);
    ctx.lineTo(plateX + bracketLen, plateY + plateH + 8);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(plateX + plateW + 8 - bracketLen, plateY + plateH + 8);
    ctx.lineTo(plateX + plateW + 8, plateY + plateH + 8);
    ctx.lineTo(plateX + plateW + 8, plateY + plateH - bracketLen);
    ctx.stroke();
  }

  // Draw QR Code
  ctx.drawImage(qrCanvas, qrX, qrY);
  ctx.restore();

  // 5. Typographic Identity Beneath QR Plate
  const textY = qrY + qrWidth + Math.round(height * 0.04);
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');

  await ensureFontLoaded(style.captionFont || 'Fraunces', '700', fullName);

  ctx.fillStyle = selectedPreset.textColor;
  ctx.textAlign = 'center';
  const nameSize = Math.round(width * 0.055);
  ctx.font = `bold ${nameSize}px '${style.captionFont || 'Fraunces'}', Georgia, sans-serif`;
  ctx.fillText(fullName, width / 2, textY);

  const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
  if (subtitle) {
    ctx.fillStyle = selectedPreset.subtextColor;
    const subSize = Math.round(width * 0.032);
    ctx.font = `500 ${subSize}px 'Instrument Sans', -apple-system, sans-serif`;
    ctx.fillText(subtitle, width / 2, textY + Math.round(nameSize * 1.15));
  }

  // 6. Sovereign Coordinates / Airgap Watermark Stamp
  const footerY = height - Math.round(height * 0.06);
  ctx.fillStyle = `${selectedPreset.accentColor}99`;
  ctx.textAlign = 'center';
  ctx.font = `600 ${Math.round(width * 0.022)}px 'JetBrains Mono', monospace`;
  ctx.fillText('PARICHAY // AIRGAPPED SOVEREIGN MONOLITH · SCAN TO INGEST', width / 2, footerY);

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
