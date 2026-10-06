import fs from 'node:fs';
import path from 'node:path';

// Master high-definition SVG logo for Parichay
// Fusion of Latin 'P', Devanagari 'प' curve, optical camera aperture, and QR finder matrix.
const masterLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181B22"/>
      <stop offset="50%" stop-color="#101217"/>
      <stop offset="100%" stop-color="#08090C"/>
    </linearGradient>

    <!-- Metallic Terracotta Accent Gradient -->
    <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E27344"/>
      <stop offset="40%" stop-color="#C25727"/>
      <stop offset="100%" stop-color="#933714"/>
    </linearGradient>

    <!-- Warm Copper Gold Accent Gradient -->
    <linearGradient id="goldCopperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F6D199"/>
      <stop offset="50%" stop-color="#D98A52"/>
      <stop offset="100%" stop-color="#A4421B"/>
    </linearGradient>

    <!-- Subtle Plate Shadow -->
    <filter id="plateShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#E27344" flood-opacity="0.15"/>
    </filter>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base Frame (Apple iOS / Android Adaptive squircle) -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>

  <!-- Subtle Inner Framing Line -->
  <rect x="28" y="28" width="456" height="456" rx="96" fill="none" stroke="rgba(226, 115, 68, 0.12)" stroke-width="1.5"/>

  <!-- Optical Grid Dots in Background -->
  <g opacity="0.08" fill="#FFFFFF">
    <circle cx="96" cy="96" r="3"/>
    <circle cx="128" cy="96" r="3"/>
    <circle cx="384" cy="96" r="3"/>
    <circle cx="416" cy="96" r="3"/>
    <circle cx="96" cy="416" r="3"/>
    <circle cx="128" cy="416" r="3"/>
    <circle cx="384" cy="416" r="3"/>
    <circle cx="416" cy="416" r="3"/>
  </g>

  <!-- Central Emblem Group -->
  <g filter="url(#plateShadow)" transform="translate(0, 0)">
    
    <!-- Top-Left QR Finder Eye Bracket (The "Scan" Anchor) -->
    <path d="M 120 180 L 120 136 C 120 127 127 120 136 120 L 180 120" 
          fill="none" stroke="url(#goldCopperGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Top-Right QR Finder Eye Bracket -->
    <path d="M 332 120 L 376 120 C 385 120 392 127 392 136 L 392 180" 
          fill="none" stroke="url(#goldCopperGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Bottom-Left QR Finder Eye Bracket -->
    <path d="M 120 332 L 120 376 C 120 385 127 392 136 392 L 180 392" 
          fill="none" stroke="url(#goldCopperGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Bottom-Right Optical Reticle Aperture Dot -->
    <circle cx="380" cy="380" r="10" fill="url(#terracottaGrad)"/>
    <circle cx="380" cy="380" r="18" fill="none" stroke="url(#terracottaGrad)" stroke-width="3" opacity="0.6"/>

    <!-- Central Sculptural Monogram 'P' (Latin P & Devanagari Pa 'प' harmonious synthesis) -->
    <!-- Vertical Spine (The Sturdy Post of the Business Card) -->
    <rect x="178" y="160" width="28" height="192" rx="14" fill="url(#terracottaGrad)"/>

    <!-- Upper Loop (Precision Curved Architectural Bow) -->
    <path d="M 192 160 
             L 264 160 
             C 314 160, 344 186, 344 228 
             C 344 270, 314 296, 264 296 
             L 192 296" 
          fill="none" 
          stroke="url(#terracottaGrad)" 
          stroke-width="28" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>

    <!-- Inner Core: Illuminating Optical Aperture Pupil -->
    <circle cx="262" cy="228" r="22" fill="url(#goldCopperGrad)"/>
    <circle cx="262" cy="228" r="10" fill="#111317"/>

    <!-- Subtle Connection Beam / Laser Aperture Filament -->
    <line x1="284" y1="228" x2="350" y2="228" stroke="url(#goldCopperGrad)" stroke-width="3" stroke-dasharray="4 4" opacity="0.6"/>
  </g>

  <!-- Lower Brand Identity Micro-Signature -->
  <text x="256" y="444" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="16" 
        font-weight="700" 
        letter-spacing="5" 
        text-anchor="middle" 
        fill="#A3ACB9">PARICHAY</text>
  <text x="256" y="464" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="10" 
        font-weight="500" 
        letter-spacing="3" 
        text-anchor="middle" 
        fill="#E27344" opacity="0.8">परिचय · OFFLINE CARD</text>
</svg>
`;

const publicDir = path.resolve('public');
const designBrandDir = path.resolve('design/brand');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(designBrandDir, { recursive: true });

// Write master SVG files
fs.writeFileSync(path.join(publicDir, 'logo.svg'), masterLogoSvg, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'icon.svg'), masterLogoSvg, 'utf-8');
fs.writeFileSync(path.join(designBrandDir, 'logo.svg'), masterLogoSvg, 'utf-8');
fs.writeFileSync(path.join(designBrandDir, 'monogram.svg'), masterLogoSvg, 'utf-8');

console.log('Master brand logo created successfully.');
