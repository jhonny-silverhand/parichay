import type { Card } from '@/shared/card';
import type { QRStyle } from './qr-style-types';
import { buildCompactVCard } from '@/shared/vcard';
import { renderQRToCanvas } from './qr-renderer';
import { ensureFontLoaded } from './fonts';

export type WallpaperCategory = 'art' | 'abstract';
export type ArtThemeType =
  | 'astronaut'
  | 'cat'
  | 'gameboy'
  | 'mecha'
  | 'sakura'
  | 'coffee'
  | 'artdeco'
  | 'graffiti'
  | 'none';

export interface WallpaperPreset {
  id: string;
  name: string;
  tagline: string;
  category: 'art' | 'oled' | 'aurora' | 'solaris' | 'cyber' | 'abyss' | 'prism' | 'minimal' | 'style';
  artTheme: ArtThemeType;
  gradientStops: [string, string, ...string[]];
  gradientAngle: number;
  frameStyle: 'glass' | 'cyber' | 'minimal' | 'neon' | 'art';
  accentColor: string;
  textColor: string;
  subtextColor: string;
  meshType: 'none' | 'topography' | 'grid' | 'aurora-orbs' | 'stars' | 'cherry-blossoms';
  iconEmoji: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  // 1. CARTOON & ART TEMPLATES (QR sits inside the scene!)
  {
    id: 'art-cat-peeking',
    name: 'Kawaii Cat Peeking',
    tagline: 'Cute chubby kitten resting paws on top of your QR card',
    category: 'art',
    artTheme: 'cat',
    gradientStops: ['#16152b', '#2a274a', '#1a1833'],
    gradientAngle: 180,
    frameStyle: 'art',
    accentColor: '#FFB5A7',
    textColor: '#FFFFFF',
    subtextColor: '#FFD6BA',
    meshType: 'none',
    iconEmoji: '🐱',
  },
  {
    id: 'art-astronaut-cosmos',
    name: 'Cosmic Voyager',
    tagline: 'Astronaut floating in deep space beaming your contact beacon',
    category: 'art',
    artTheme: 'astronaut',
    gradientStops: ['#05060f', '#0f172a', '#1e1b4b'],
    gradientAngle: 160,
    frameStyle: 'art',
    accentColor: '#38BDF8',
    textColor: '#FFFFFF',
    subtextColor: '#93C5FD',
    meshType: 'stars',
    iconEmoji: '🧑‍🚀',
  },
  {
    id: 'art-retro-gameboy',
    name: 'Pixel Console 90s',
    tagline: 'Classic handheld gaming console with QR on the retro screen',
    category: 'art',
    artTheme: 'gameboy',
    gradientStops: ['#27292d', '#3f4247', '#1f2023'],
    gradientAngle: 180,
    frameStyle: 'art',
    accentColor: '#8bac0f',
    textColor: '#FFFFFF',
    subtextColor: '#9BBC0F',
    meshType: 'none',
    iconEmoji: '🎮',
  },
  {
    id: 'art-sakura-torii',
    name: 'Neo Sakura Shrine',
    tagline: 'Moonlit Japanese Torii gate with falling cherry blossoms',
    category: 'art',
    artTheme: 'sakura',
    gradientStops: ['#140824', '#28103c', '#0f0518'],
    gradientAngle: 180,
    frameStyle: 'art',
    accentColor: '#F472B6',
    textColor: '#FFFFFF',
    subtextColor: '#FBCFE8',
    meshType: 'cherry-blossoms',
    iconEmoji: '🌸',
  },
  {
    id: 'art-mecha-core',
    name: 'Cyber Mecha Core',
    tagline: 'Futuristic sci-fi armor plating with QR power reactor',
    category: 'art',
    artTheme: 'mecha',
    gradientStops: ['#0a0b0e', '#131720', '#08090c'],
    gradientAngle: 180,
    frameStyle: 'art',
    accentColor: '#00F0FF',
    textColor: '#FFFFFF',
    subtextColor: '#FACC15',
    meshType: 'grid',
    iconEmoji: '🤖',
  },
  {
    id: 'art-coffee-desk',
    name: 'Craftsman Coffee Desk',
    tagline: 'Top-down warm cafe table with latte art, foliage & coaster',
    category: 'art',
    artTheme: 'coffee',
    gradientStops: ['#211a14', '#3d2e24', '#1f1610'],
    gradientAngle: 145,
    frameStyle: 'art',
    accentColor: '#D97706',
    textColor: '#FFFBEB',
    subtextColor: '#FDE68A',
    meshType: 'none',
    iconEmoji: '☕',
  },
  {
    id: 'art-art-deco',
    name: 'Gatsby Gold Filigree',
    tagline: '1920s Art Deco opulent gilded fan arches & emerald velvet',
    category: 'art',
    artTheme: 'artdeco',
    gradientStops: ['#061712', '#0d2820', '#04100c'],
    gradientAngle: 180,
    frameStyle: 'art',
    accentColor: '#FBBF24',
    textColor: '#FEF3C7',
    subtextColor: '#FDE68A',
    meshType: 'none',
    iconEmoji: '✨',
  },
  {
    id: 'art-urban-graffiti',
    name: 'Street Art Mural',
    tagline: 'Brick wall with vibrant spray splatters & Hello sticker',
    category: 'art',
    artTheme: 'graffiti',
    gradientStops: ['#1c1917', '#292524', '#0c0a09'],
    gradientAngle: 180,
    frameStyle: 'art',
    accentColor: '#EC4899',
    textColor: '#FFFFFF',
    subtextColor: '#F43F5E',
    meshType: 'none',
    iconEmoji: '🎨',
  },

  // 2. ATMOSPHERIC & ARCHIPELAGO PRESETS
  {
    id: 'amoled-obsidian',
    name: 'Obsidian OLED',
    tagline: 'Zero-power pure black with diamond specular glass',
    category: 'oled',
    artTheme: 'none',
    gradientStops: ['#000000', '#040508', '#000000'],
    gradientAngle: 180,
    frameStyle: 'glass',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
    meshType: 'grid',
    iconEmoji: '🖤',
  },
  {
    id: 'cyber-aurora',
    name: 'Cyber Aurora',
    tagline: 'Polar borealis caustics from deep indigo to emerald',
    category: 'aurora',
    artTheme: 'none',
    gradientStops: ['#060814', '#0d2232', '#2a0b3f'],
    gradientAngle: 135,
    frameStyle: 'glass',
    accentColor: '#00F5D4',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    meshType: 'aurora-orbs',
    iconEmoji: '🌌',
  },
  {
    id: 'solaris-magma',
    name: 'Solaris Magma',
    tagline: 'Volcanic terracotta & brushed bronze titanium glow',
    category: 'solaris',
    artTheme: 'none',
    gradientStops: ['#120603', '#963914', '#360c04'],
    gradientAngle: 160,
    frameStyle: 'cyber',
    accentColor: '#FF7B00',
    textColor: '#FFF4EE',
    subtextColor: 'rgba(255, 235, 224, 0.8)',
    meshType: 'topography',
    iconEmoji: '🌋',
  },
  {
    id: 'neo-tokyo-acid',
    name: 'Neo-Tokyo Acid',
    tagline: 'Carbon fiber titanium with high-voltage chartreuse laser grid',
    category: 'cyber',
    artTheme: 'none',
    gradientStops: ['#08090a', '#101317', '#050607'],
    gradientAngle: 180,
    frameStyle: 'cyber',
    accentColor: '#CCFF00',
    textColor: '#FFFFFF',
    subtextColor: '#CCFF00',
    meshType: 'grid',
    iconEmoji: '⚡',
  },
  {
    id: 'abyssal-bioluminescence',
    name: 'Abyssal Trench',
    tagline: 'Midnight oceanic navy with bioluminescent turquoise caustics',
    category: 'abyss',
    artTheme: 'none',
    gradientStops: ['#020612', '#05182e', '#022938'],
    gradientAngle: 145,
    frameStyle: 'glass',
    accentColor: '#00E5FF',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(224, 247, 250, 0.82)',
    meshType: 'topography',
    iconEmoji: '🌊',
  },
  {
    id: 'rose-quartz-prism',
    name: 'Rose Quartz Prism',
    tagline: 'High-fashion champagne blush & crystal quartz pedestal',
    category: 'prism',
    artTheme: 'none',
    gradientStops: ['#190f15', '#381c2a', '#140810'],
    gradientAngle: 130,
    frameStyle: 'neon',
    accentColor: '#F49097',
    textColor: '#FFF0F3',
    subtextColor: 'rgba(255, 228, 235, 0.8)',
    meshType: 'aurora-orbs',
    iconEmoji: '💎',
  },
  {
    id: 'bauhaus-minimal',
    name: 'Architectural Slate',
    tagline: 'Swiss precision graphite with strict typographic grid',
    category: 'minimal',
    artTheme: 'none',
    gradientStops: ['#111214', '#18191d', '#111214'],
    gradientAngle: 180,
    frameStyle: 'minimal',
    accentColor: '#E2E8F0',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.7)',
    meshType: 'none',
    iconEmoji: '📐',
  },
  {
    id: 'custom-card-style',
    name: 'Card Studio Mirror',
    tagline: 'Directly inherits your active card styling and color palette',
    category: 'style',
    artTheme: 'none',
    gradientStops: ['#111317', '#1a1d24', '#111317'],
    gradientAngle: 145,
    frameStyle: 'glass',
    accentColor: '#B85226',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    meshType: 'topography',
    iconEmoji: '🎴',
  },
];

export interface WallpaperOptions {
  width?: number;
  height?: number;
  backdropChoice?: 'style' | 'charcoal' | 'navy' | 'warm';
  presetId?: string;
  frameStyle?: 'glass' | 'cyber' | 'minimal' | 'neon' | 'art';
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

// ============================================================================
// ART TEMPLATE DRAWING ENGINE
// ============================================================================

/**
 * 1. Cute Kawaii Cat Peeking Over QR Box
 */
function drawCatPeekingArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();
  const catCenterX = width / 2;
  const catHeadRadius = qrWidth * 0.24;
  const catHeadY = qrY - catHeadRadius * 0.45;

  // Cat Head Base (Chubby Orange/Cream Kitty)
  ctx.fillStyle = '#FFA07A';
  ctx.beginPath();
  ctx.arc(catCenterX, catHeadY, catHeadRadius, 0, Math.PI * 2);
  ctx.fill();

  // Cat Ears
  const earW = catHeadRadius * 0.55;
  const earH = catHeadRadius * 0.8;
  // Left Ear
  ctx.beginPath();
  ctx.moveTo(catCenterX - catHeadRadius * 0.85, catHeadY);
  ctx.lineTo(catCenterX - catHeadRadius * 0.6, catHeadY - earH);
  ctx.lineTo(catCenterX - catHeadRadius * 0.15, catHeadY - catHeadRadius * 0.7);
  ctx.closePath();
  ctx.fillStyle = '#FFA07A';
  ctx.fill();
  // Inner Pink Ear Left
  ctx.beginPath();
  ctx.moveTo(catCenterX - catHeadRadius * 0.75, catHeadY - 4);
  ctx.lineTo(catCenterX - catHeadRadius * 0.58, catHeadY - earH * 0.75);
  ctx.lineTo(catCenterX - catHeadRadius * 0.28, catHeadY - catHeadRadius * 0.58);
  ctx.closePath();
  ctx.fillStyle = '#FFB6C1';
  ctx.fill();

  // Right Ear
  ctx.beginPath();
  ctx.moveTo(catCenterX + catHeadRadius * 0.85, catHeadY);
  ctx.lineTo(catCenterX + catHeadRadius * 0.6, catHeadY - earH);
  ctx.lineTo(catCenterX + catHeadRadius * 0.15, catHeadY - catHeadRadius * 0.7);
  ctx.closePath();
  ctx.fillStyle = '#FFA07A';
  ctx.fill();
  // Inner Pink Ear Right
  ctx.beginPath();
  ctx.moveTo(catCenterX + catHeadRadius * 0.75, catHeadY - 4);
  ctx.lineTo(catCenterX + catHeadRadius * 0.58, catHeadY - earH * 0.75);
  ctx.lineTo(catCenterX + catHeadRadius * 0.28, catHeadY - catHeadRadius * 0.58);
  ctx.closePath();
  ctx.fillStyle = '#FFB6C1';
  ctx.fill();

  // Kawaii Eyes (Big sparkling eyes)
  const eyeRadius = catHeadRadius * 0.18;
  const eyeY = catHeadY - catHeadRadius * 0.05;
  // Left Eye
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.arc(catCenterX - catHeadRadius * 0.38, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  // Sparkle highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(catCenterX - catHeadRadius * 0.42, eyeY - eyeRadius * 0.3, eyeRadius * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Right Eye
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.arc(catCenterX + catHeadRadius * 0.38, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  // Sparkle highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(catCenterX + catHeadRadius * 0.34, eyeY - eyeRadius * 0.3, eyeRadius * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Pink Nose
  ctx.fillStyle = '#FF69B4';
  ctx.beginPath();
  ctx.moveTo(catCenterX, eyeY + catHeadRadius * 0.22);
  ctx.lineTo(catCenterX - 6, eyeY + catHeadRadius * 0.14);
  ctx.lineTo(catCenterX + 6, eyeY + catHeadRadius * 0.14);
  ctx.closePath();
  ctx.fill();

  // Whiskers
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2.5;
  // Left Whiskers
  ctx.beginPath();
  ctx.moveTo(catCenterX - catHeadRadius * 0.45, eyeY + catHeadRadius * 0.2);
  ctx.lineTo(catCenterX - catHeadRadius * 1.15, eyeY + catHeadRadius * 0.12);
  ctx.moveTo(catCenterX - catHeadRadius * 0.45, eyeY + catHeadRadius * 0.28);
  ctx.lineTo(catCenterX - catHeadRadius * 1.15, eyeY + catHeadRadius * 0.34);
  ctx.stroke();

  // Right Whiskers
  ctx.beginPath();
  ctx.moveTo(catCenterX + catHeadRadius * 0.45, eyeY + catHeadRadius * 0.2);
  ctx.lineTo(catCenterX + catHeadRadius * 1.15, eyeY + catHeadRadius * 0.12);
  ctx.moveTo(catCenterX + catHeadRadius * 0.45, eyeY + catHeadRadius * 0.28);
  ctx.lineTo(catCenterX + catHeadRadius * 1.15, eyeY + catHeadRadius * 0.34);
  ctx.stroke();

  // Two Chubby Paws Resting on Top Edge of the QR Box
  const pawW = catHeadRadius * 0.42;
  const pawH = catHeadRadius * 0.32;
  // Left Paw
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(qrX + qrWidth * 0.25, qrY, pawW, pawH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFA07A';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Right Paw
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(qrX + qrWidth * 0.75, qrY, pawW, pawH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Playful Tail Curled on the bottom right
  ctx.strokeStyle = '#FFA07A';
  ctx.lineWidth = Math.round(width * 0.035);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(qrX + qrWidth + 12, qrY + qrWidth * 0.65, qrWidth * 0.25, 0.5 * Math.PI, 1.6 * Math.PI);
  ctx.stroke();

  // Speech Bubble or Tag above
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - qrWidth * 0.4, catHeadY - earH - 42, qrWidth * 0.8, 36, 18);
  ctx.fill();
  ctx.fillStyle = '#FFD1DC';
  ctx.font = `bold ${Math.round(width * 0.028)}px 'Instrument Sans', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🐾 SCAN ME MEOW! · ' + card.firstName.toUpperCase(), width / 2, catHeadY - earH - 18);

  ctx.restore();
}

/**
 * 2. Cosmic Voyager Astronaut Floating in Deep Space
 */
function drawAstronautArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();

  // Twinkling Star Field
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 70; i++) {
    const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
    const sy = (Math.cos(i * 77) * 0.5 + 0.5) * height;
    const r = (i % 3 === 0 ? 2.5 : 1.2);
    ctx.globalAlpha = 0.3 + (i % 5) * 0.14;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Saturn Planet in Top Right Corner
  const planetX = width * 0.84;
  const planetY = height * 0.18;
  const planetR = width * 0.08;
  // Saturn Body
  const planetGrad = ctx.createLinearGradient(planetX - planetR, planetY, planetX + planetR, planetY);
  planetGrad.addColorStop(0, '#f59e0b');
  planetGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(planetX, planetY, planetR, 0, Math.PI * 2);
  ctx.fill();
  // Saturn Rings
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(planetX, planetY, planetR * 2.2, planetR * 0.55, -0.4, 0, Math.PI * 2);
  ctx.stroke();

  // Floating Cute Astronaut above the QR box
  const astroX = width * 0.28;
  const astroY = qrY - qrWidth * 0.16;
  const astroScale = qrWidth * 0.0035;

  ctx.save();
  ctx.translate(astroX, astroY);
  ctx.rotate(-0.15); // Floating tilt

  // Astronaut Backpack
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-22 * astroScale, -15 * astroScale, 44 * astroScale, 38 * astroScale);

  // Astronaut Body
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(-18 * astroScale, -10 * astroScale, 36 * astroScale, 34 * astroScale, 10 * astroScale);
  ctx.fill();

  // Helmet
  const helmetR = 18 * astroScale;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -20 * astroScale, helmetR, 0, Math.PI * 2);
  ctx.fill();

  // Visor (Gold / Cyan reflective glass)
  const visorGrad = ctx.createLinearGradient(0, -28 * astroScale, 0, -12 * astroScale);
  visorGrad.addColorStop(0, '#38bdf8');
  visorGrad.addColorStop(0.5, '#0284c7');
  visorGrad.addColorStop(1, '#fbbf24');
  ctx.fillStyle = visorGrad;
  ctx.beginPath();
  ctx.ellipse(2 * astroScale, -20 * astroScale, 12 * astroScale, 9 * astroScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Oxygen Tether Line leading to the QR Code
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(10 * astroScale, 10 * astroScale);
  ctx.bezierCurveTo(30 * astroScale, 20 * astroScale, 50 * astroScale, -10 * astroScale, 70 * astroScale, 35 * astroScale);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();

  // Holographic Beam Stamp
  ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - qrWidth * 0.45, qrY - 32, qrWidth * 0.9, 28, 14);
  ctx.fill();
  ctx.fillStyle = '#38BDF8';
  ctx.font = `bold ${Math.round(width * 0.024)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('📡 BEACON FREQUENCY // ORBIT ACTIVE', width / 2, qrY - 14);

  ctx.restore();
}

/**
 * 3. Retro 90s Game Boy / Handheld Arcade Console
 */
function drawRetroGameBoyArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();
  const consoleW = qrWidth * 1.35;
  const consoleH = qrWidth * 1.85;
  const consoleX = (width - consoleW) / 2;
  const consoleY = qrY - qrWidth * 0.35;

  // Console Body (Classic 90s Plastic Bevel)
  const bodyGrad = ctx.createLinearGradient(consoleX, consoleY, consoleX + consoleW, consoleY + consoleH);
  bodyGrad.addColorStop(0, '#d1d5db');
  bodyGrad.addColorStop(1, '#9ca3af');
  ctx.fillStyle = bodyGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 15;
  ctx.beginPath();
  ctx.roundRect(consoleX, consoleY, consoleW, consoleH, [40, 40, 80, 40]);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Screen Glass Outer Bezel (Dark Grey Tint)
  const bezelPad = 28;
  const bezelX = consoleX + bezelPad;
  const bezelY = consoleY + 45;
  const bezelW = consoleW - bezelPad * 2;
  const bezelH = qrWidth + 65;
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.roundRect(bezelX, bezelY, bezelW, bezelH, 18);
  ctx.fill();

  // Battery Indicator LED (Glowing Red)
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(bezelX + 22, bezelY + 35, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#9ca3af';
  ctx.font = `600 9px monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('BATTERY', bezelX + 32, bezelY + 38);

  // Bezel Header Lines
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bezelX + 110, bezelY + 22);
  ctx.lineTo(bezelX + bezelW - 20, bezelY + 22);
  ctx.stroke();

  // Cross D-Pad on the Bottom Left
  const dpadX = consoleX + consoleW * 0.24;
  const dpadY = consoleY + consoleH - consoleW * 0.32;
  const dpadArm = consoleW * 0.085;
  ctx.fillStyle = '#1f2937';
  // Vertical Bar
  ctx.fillRect(dpadX - dpadArm / 2, dpadY - dpadArm * 1.5, dpadArm, dpadArm * 3);
  // Horizontal Bar
  ctx.fillRect(dpadX - dpadArm * 1.5, dpadY - dpadArm / 2, dpadArm * 3, dpadArm);
  // Center indent
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(dpadX, dpadY, dpadArm * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Slanted A & B Action Buttons on the Bottom Right
  const btnRadius = consoleW * 0.07;
  const btnAY = dpadY - 14;
  const btnAX = consoleX + consoleW * 0.82;
  const btnBY = dpadY + 12;
  const btnBX = consoleX + consoleW * 0.65;

  ctx.fillStyle = '#9f1239'; // Retro Magenta Buttons
  ctx.beginPath();
  ctx.arc(btnAX, btnAY, btnRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(btnBX, btnBY, btnRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#374151';
  ctx.font = `bold 12px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('A', btnAX, btnAY + btnRadius + 16);
  ctx.fillText('B', btnBX, btnBY + btnRadius + 16);

  // Slanted Select & Start Pill Buttons
  const pillW = consoleW * 0.12;
  const pillH = 10;
  const pillY = consoleY + consoleH - 45;
  ctx.fillStyle = '#4b5563';
  ctx.save();
  ctx.translate(consoleX + consoleW * 0.4, pillY);
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 5);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(consoleX + consoleW * 0.58, pillY);
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 5);
  ctx.fill();
  ctx.restore();

  // Bottom Speaker Slits
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 3.5;
  const spkX = consoleX + consoleW - 35;
  const spkY = consoleY + consoleH - 35;
  for (let s = 0; s < 5; s++) {
    ctx.beginPath();
    ctx.moveTo(spkX - s * 10, spkY);
    ctx.lineTo(spkX - s * 10 + 18, spkY - 32);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 4. Cyber Mecha Core / Sci-Fi Android Reactor
 */
function drawMechaCoreArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();
  // Diagonal Hazard Stripes along Top and Bottom
  const stripeH = 18;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, qrY - 45, width, stripeH);
  ctx.clip();
  for (let x = -width; x < width * 2; x += 36) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x, qrY - 45, 18, stripeH);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(x + 18, qrY - 45, 18, stripeH);
  }
  ctx.restore();

  // Hexagonal Reactor Core Rim around QR
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 15;
  ctx.strokeRect(qrX - 16, qrY - 16, qrWidth + 32, qrWidth + 32);

  // Power Conduit Pipes on Left & Right
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 6;
  ctx.shadowBlur = 0;

  // Left Pipe
  ctx.beginPath();
  ctx.moveTo(qrX - 45, qrY - 20);
  ctx.lineTo(qrX - 25, qrY + qrWidth * 0.2);
  ctx.lineTo(qrX - 25, qrY + qrWidth * 0.8);
  ctx.lineTo(qrX - 45, qrY + qrWidth + 20);
  ctx.stroke();

  // Right Pipe
  ctx.beginPath();
  ctx.moveTo(qrX + qrWidth + 45, qrY - 20);
  ctx.lineTo(qrX + qrWidth + 25, qrY + qrWidth * 0.2);
  ctx.lineTo(qrX + qrWidth + 25, qrY + qrWidth * 0.8);
  ctx.lineTo(qrX + qrWidth + 45, qrY + qrWidth + 20);
  ctx.stroke();

  // Hydraulic Bolt Rivets
  ctx.fillStyle = '#e4e4e7';
  const bolts = [
    [qrX - 10, qrY - 10],
    [qrX + qrWidth + 10, qrY - 10],
    [qrX - 10, qrY + qrWidth + 10],
    [qrX + qrWidth + 10, qrY + qrWidth + 10],
  ];
  bolts.forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Mecha Unit ID
  ctx.fillStyle = '#00f0ff';
  ctx.font = `bold 11px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('UNIT // MK-IV AIRGAP MONOLITH · SYSTEM ONLINE', width / 2, qrY - 18);

  ctx.restore();
}

/**
 * 5. Japanese Torii Gate with Moon and Cherry Blossoms
 */
function drawSakuraToriiArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();

  // Giant Soft Radiant Moon behind QR
  const moonX = width / 2;
  const moonY = qrY + qrWidth * 0.35;
  const moonR = qrWidth * 0.72;
  const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR);
  moonGrad.addColorStop(0, 'rgba(255, 240, 245, 0.45)');
  moonGrad.addColorStop(0.7, 'rgba(251, 207, 232, 0.18)');
  moonGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  // Torii Gate Structure Framing the QR
  const toriiW = qrWidth + 70;
  const toriiTopY = qrY - 45;
  const toriiPillarL = (width - toriiW) / 2;
  const toriiPillarR = (width + toriiW) / 2;

  // Upper Curved Kasagi Beam
  ctx.fillStyle = '#e11d48'; // Japanese Vermilion Crimson
  ctx.beginPath();
  ctx.moveTo(toriiPillarL - 25, toriiTopY);
  ctx.lineTo(toriiPillarR + 25, toriiTopY);
  ctx.lineTo(toriiPillarR + 15, toriiTopY + 14);
  ctx.lineTo(toriiPillarL - 15, toriiTopY + 14);
  ctx.closePath();
  ctx.fill();

  // Black Roof Cap
  ctx.fillStyle = '#09090b';
  ctx.fillRect(toriiPillarL - 32, toriiTopY - 6, toriiW + 64, 7);

  // Secondary Shimaki Beam
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(toriiPillarL - 10, toriiTopY + 22, toriiW + 20, 10);

  // Pillars
  const pillarW = 14;
  ctx.fillStyle = '#be123c';
  ctx.fillRect(toriiPillarL, toriiTopY + 22, pillarW, qrWidth + 60);
  ctx.fillRect(toriiPillarR - pillarW, toriiTopY + 22, pillarW, qrWidth + 60);

  // Black Pillar Bases
  ctx.fillStyle = '#18181b';
  ctx.fillRect(toriiPillarL - 4, toriiTopY + qrWidth + 72, pillarW + 8, 14);
  ctx.fillRect(toriiPillarR - pillarW - 4, toriiTopY + qrWidth + 72, pillarW + 8, 14);

  // Cherry Blossom Petals Floating
  ctx.fillStyle = '#fda4af';
  for (let p = 0; p < 25; p++) {
    const px = (Math.sin(p * 55) * 0.5 + 0.5) * width;
    const py = (Math.cos(p * 33) * 0.5 + 0.5) * height;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(p * 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Kanji Header Seal
  ctx.fillStyle = '#f43f5e';
  ctx.font = `bold 13px 'Noto Serif Devanagari', serif`;
  ctx.textAlign = 'center';
  ctx.fillText('名刺 · SOVEREIGN SHRINE', width / 2, toriiTopY - 14);

  ctx.restore();
}

/**
 * 6. Craftsman Coffee & Workspace Flatlay
 */
function drawCoffeeDeskArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();

  // Ceramic Coffee Mug in Top Left
  const mugX = width * 0.22;
  const mugY = qrY - 55;
  const mugR = width * 0.09;

  // Saucer Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(mugX, mugY + 4, mugR * 1.35, mugR * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Saucer
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(mugX, mugY, mugR * 1.25, 0, Math.PI * 2);
  ctx.fill();

  // Mug Rim
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(mugX, mugY, mugR, 0, Math.PI * 2);
  ctx.fill();

  // Coffee Liquid with Latte Art
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(mugX, mugY, mugR * 0.88, 0, Math.PI * 2);
  ctx.fill();
  // Cream Heart
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(mugX - 4, mugY - 2, 7, 0, Math.PI * 2);
  ctx.arc(mugX + 4, mugY - 2, 7, 0, Math.PI * 2);
  ctx.lineTo(mugX, mugY + 10);
  ctx.fill();

  // Monstera Foliage in Top Right Corner
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.ellipse(width * 0.88, height * 0.22, width * 0.18, width * 0.1, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#047857';
  ctx.beginPath();
  ctx.ellipse(width * 0.82, height * 0.16, width * 0.15, width * 0.08, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Wooden Coaster Plate behind QR
  ctx.fillStyle = '#3f2d20';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(qrX - 18, qrY - 18, qrWidth + 36, qrWidth + 36, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Brass Pin Badge
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(width / 2, qrY - 18, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 7. Gatsby 1920s Art Deco Luxury Gold Filigree
 */
function drawArtDecoArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();
  ctx.strokeStyle = '#fbbf24'; // Rich Gold
  ctx.lineWidth = 2.5;

  // Concentric Stepped Corners
  const cornerSize = width * 0.18;
  const corners = [
    [0, 0, 1, 1],
    [width, 0, -1, 1],
    [0, height, 1, -1],
    [width, height, -1, -1],
  ];

  corners.forEach(([cx, cy, sx, sy]) => {
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + (sx * cornerSize * i) / 3, cy);
      ctx.lineTo(cx, cy + (sy * cornerSize * i) / 3);
      ctx.stroke();
    }
  });

  // Sunburst Arches above QR
  const archCenterX = width / 2;
  const archCenterY = qrY - 30;
  for (let a = -4; a <= 4; a++) {
    const angle = -Math.PI / 2 + (a * Math.PI) / 16;
    ctx.beginPath();
    ctx.moveTo(archCenterX, archCenterY);
    ctx.lineTo(archCenterX + Math.cos(angle) * 55, archCenterY + Math.sin(angle) * 55);
    ctx.stroke();
  }

  // Stepped Gold Frame around QR
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(qrX - 14, qrY - 14, qrWidth + 28, qrWidth + 28);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(qrX - 8, qrY - 8, qrWidth + 16, qrWidth + 16);

  ctx.restore();
}

/**
 * 8. Urban Street Graffiti & Hello Sticker Mural
 */
function drawGraffitiWallArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  qrX: number,
  qrY: number,
  qrWidth: number,
  card: Card
) {
  ctx.save();

  // Spray-Paint Splatters
  const splatters = [
    { x: qrX - 25, y: qrY - 20, color: '#ec4899', r: 35 },
    { x: qrX + qrWidth + 30, y: qrY + 40, color: '#06b6d4', r: 45 },
    { x: qrX + qrWidth - 20, y: qrY + qrWidth + 30, color: '#eab308', r: 40 },
  ];
  splatters.forEach((s) => {
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    // Micro drip droplets
    for (let d = 0; d < 8; d++) {
      ctx.beginPath();
      ctx.arc(s.x + (Math.sin(d * 4) * s.r * 1.3), s.y + (Math.cos(d * 4) * s.r * 1.3), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1.0;

  // "HELLO MY NAME IS" Sticker Tag at top of QR
  const stickerW = qrWidth * 0.75;
  const stickerH = 50;
  const stickerX = (width - stickerW) / 2;
  const stickerY = qrY - 65;

  ctx.save();
  ctx.translate(stickerX + stickerW / 2, stickerY + stickerH / 2);
  ctx.rotate(-0.04); // Slightly tilted sticker

  // Red Header
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(-stickerW / 2, -stickerH / 2, stickerW, stickerH * 0.42, [8, 8, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 10px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('HELLO, MY NAME IS', 0, -stickerH / 2 + 15);

  // White Body
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(-stickerW / 2, -stickerH / 2 + stickerH * 0.42, stickerW, stickerH * 0.58, [0, 0, 8, 8]);
  ctx.fill();

  // Hand-Painted Owner Name in the Sticker
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold 16px 'Kalam', cursive, sans-serif`;
  ctx.fillText(card.firstName, 0, stickerH / 2 - 8);

  ctx.restore();

  // Spray-Paint Wheatpaste Border around QR
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 4;
  ctx.strokeRect(qrX - 8, qrY - 8, qrWidth + 16, qrWidth + 16);

  ctx.restore();
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

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

  // 3. Render Art Template Illustrations around QR (if active art preset)
  if (selectedPreset.artTheme === 'cat') {
    drawCatPeekingArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'astronaut') {
    drawAstronautArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'gameboy') {
    drawRetroGameBoyArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'mecha') {
    drawMechaCoreArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'sakura') {
    drawSakuraToriiArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'coffee') {
    drawCoffeeDeskArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'artdeco') {
    drawArtDecoArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else if (selectedPreset.artTheme === 'graffiti') {
    drawGraffitiWallArt(ctx, width, height, qrX, qrY, qrWidth, card);
  } else {
    // Atmospheric Mesh Background (for abstract presets)
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
  }

  // 4. Render Decorative Pedestal / Frame around QR
  const pad = Math.round(width * 0.035);
  const plateX = qrX - pad;
  const plateY = qrY - pad;
  const plateW = qrWidth + pad * 2;
  const plateH = qrWidth + pad * 2;
  const radius = Math.round(width * 0.05);

  ctx.save();
  if (frameStyle === 'neon') {
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

  // Base Plate
  ctx.beginPath();
  ctx.roundRect(plateX, plateY, plateW, plateH, radius);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = Math.round(width * 0.045);
  ctx.shadowOffsetY = Math.round(width * 0.018);

  if (frameStyle === 'glass') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  } else if (frameStyle === 'cyber') {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.85)';
  } else if (frameStyle === 'art') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  } else if (frameStyle === 'minimal') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  }
  ctx.fill();

  // Specular Border
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
  } else if (frameStyle === 'art') {
    ctx.strokeStyle = `${selectedPreset.accentColor}90`;
    ctx.lineWidth = Math.max(2.5, Math.round(width * 0.0035));
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();

  // Draw QR Image
  ctx.drawImage(qrCanvas, qrX, qrY);
  ctx.restore();

  // 5. Typographic Identity Beneath QR Plate
  const textY = qrY + qrWidth + Math.round(height * 0.042);
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
  const footerY = height - Math.round(height * 0.055);
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
