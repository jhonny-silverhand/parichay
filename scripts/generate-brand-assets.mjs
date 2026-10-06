import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const brandDir = path.join(rootDir, 'design', 'brand');
const publicDir = path.join(rootDir, 'public');
const assetsDir = path.join(rootDir, 'assets');

[brandDir, publicDir, assetsDir].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Helper to write valid PNG without external dependencies using built-in zlib
function createSolidPNG(width, height, r, g, b, a = 255) {
  const bytesPerPixel = 4;
  const rowSize = width * bytesPerPixel + 1; // +1 for filter byte (0)
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // Compute CRC32
    let c = 0 ^ -1;
    const buf = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < buf.length; i++) {
      c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
    }
    crcBuf.writeUInt32BE((c ^ -1) >>> 0, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Precompute CRC table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Monogram SVG
const monogramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" fill="none">
  <rect width="256" height="256" rx="56" fill="#111317"/>
  <!-- Minimalist P monogram with interlocking contact/card motif -->
  <path d="M72 56H144C174.928 56 200 81.072 200 112C200 142.928 174.928 168 144 168H104V200H72V56Z" fill="#F7F5F0"/>
  <rect x="104" y="88" width="40" height="48" rx="8" fill="#B85226"/>
  <!-- Scan Aperture Cue -->
  <circle cx="168" cy="184" r="16" fill="#B85226"/>
</svg>`;

// 2. Wordmark SVG
const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" width="400" height="80" fill="none">
  <text x="10" y="55" font-family="'Fraunces', 'Playfair Display', Georgia, serif" font-size="44" font-weight="700" letter-spacing="-0.02em" fill="#111317">
    Parichay
  </text>
  <circle cx="218" cy="46" r="5" fill="#B85226"/>
  <text x="236" y="52" font-family="'Instrument Sans', -apple-system, sans-serif" font-size="14" font-weight="500" letter-spacing="0.06em" fill="#505663">
    परिचय
  </text>
</svg>`;

// 3. Full Logo SVG
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 128" width="512" height="128" fill="none">
  <g transform="translate(16, 16)">
    <rect width="96" height="96" rx="24" fill="#111317"/>
    <path d="M28 22H54C65.046 22 74 30.954 74 42C74 53.046 65.046 62 54 62H40V74H28V22Z" fill="#F7F5F0"/>
    <rect x="40" y="34" width="14" height="16" rx="3" fill="#B85226"/>
    <circle cx="62" cy="68" r="6" fill="#B85226"/>
  </g>
  <text x="136" y="68" font-family="'Fraunces', 'Playfair Display', Georgia, serif" font-size="44" font-weight="700" letter-spacing="-0.02em" fill="#111317">
    Parichay
  </text>
  <text x="138" y="92" font-family="'Instrument Sans', -apple-system, sans-serif" font-size="13" font-weight="500" letter-spacing="0.08em" fill="#505663">
    ONE CARD · ONE SCAN · OFFLINE
  </text>
</svg>`;

// 4. Android Adaptive Icon Foreground
const adaptiveFgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432" fill="none">
  <g transform="translate(88, 88)">
    <path d="M72 56H144C174.928 56 200 81.072 200 112C200 142.928 174.928 168 144 168H104V200H72V56Z" fill="#F7F5F0"/>
    <rect x="104" y="88" width="40" height="48" rx="8" fill="#B85226"/>
    <circle cx="168" cy="184" r="16" fill="#B85226"/>
  </g>
</svg>`;

// 5. Android Adaptive Icon Background
const adaptiveBgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432" fill="none">
  <rect width="432" height="432" fill="#111317"/>
</svg>`;

// 6. Splash Screen Light
const splashLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" fill="none">
  <rect width="1080" height="1920" fill="#F7F5F0"/>
  <g transform="translate(420, 840)">
    <rect width="240" height="240" rx="54" fill="#111317"/>
    <path d="M68 52H136C165.271 52 189 75.729 189 105C189 134.271 165.271 158 136 158H98V188H68V52Z" fill="#F7F5F0"/>
    <rect x="98" y="82" width="38" height="44" rx="8" fill="#B85226"/>
    <circle cx="158" cy="172" r="15" fill="#B85226"/>
  </g>
  <text x="540" y="1160" text-anchor="middle" font-family="'Fraunces', Georgia, serif" font-size="44" font-weight="700" fill="#111317">
    Parichay
  </text>
  <text x="540" y="1205" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="18" font-weight="500" letter-spacing="0.1em" fill="#7E8594">
    ONE CARD · ONE SCAN · NOTHING LEAVES YOUR PHONE
  </text>
</svg>`;

// 7. Splash Screen Dark
const splashDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" fill="none">
  <rect width="1080" height="1920" fill="#0F1115"/>
  <g transform="translate(420, 840)">
    <rect width="240" height="240" rx="54" fill="#181B21" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <path d="M68 52H136C165.271 52 189 75.729 189 105C189 134.271 165.271 158 136 158H98V188H68V52Z" fill="#F3F1EC"/>
    <rect x="98" y="82" width="38" height="44" rx="8" fill="#C85D2F"/>
    <circle cx="158" cy="172" r="15" fill="#C85D2F"/>
  </g>
  <text x="540" y="1160" text-anchor="middle" font-family="'Fraunces', Georgia, serif" font-size="44" font-weight="700" fill="#F3F1EC">
    Parichay
  </text>
  <text x="540" y="1205" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="18" font-weight="500" letter-spacing="0.1em" fill="#9EA4B1">
    ONE CARD · ONE SCAN · NOTHING LEAVES YOUR PHONE
  </text>
</svg>`;

// 8. Social / OpenGraph Image (1200x630)
const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" fill="none">
  <rect width="1200" height="630" fill="#111317"/>
  <!-- Decorative hairline geometry -->
  <circle cx="950" cy="315" r="240" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  <circle cx="950" cy="315" r="180" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <circle cx="950" cy="315" r="120" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  
  <!-- Stylized card preview on the right -->
  <g transform="translate(850, 195)">
    <rect width="200" height="240" rx="20" fill="#FFFFFF" filter="drop-shadow(0 12px 24px rgba(0,0,0,0.4))"/>
    <rect x="30" y="30" width="140" height="140" rx="8" fill="#111317"/>
    <!-- Mock QR finder patterns -->
    <rect x="42" y="42" width="32" height="32" rx="4" fill="#FFFFFF"/>
    <rect x="48" y="48" width="20" height="20" rx="2" fill="#111317"/>
    <rect x="126" y="42" width="32" height="32" rx="4" fill="#FFFFFF"/>
    <rect x="132" y="48" width="20" height="20" rx="2" fill="#111317"/>
    <rect x="42" y="126" width="32" height="32" rx="4" fill="#FFFFFF"/>
    <rect x="48" y="132" width="20" height="20" rx="2" fill="#111317"/>
    <circle cx="100" cy="100" r="10" fill="#B85226"/>
    <rect x="50" y="190" width="100" height="8" rx="4" fill="#111317"/>
    <rect x="70" y="206" width="60" height="6" rx="3" fill="#7E8594"/>
  </g>

  <!-- Left Copy Section -->
  <g transform="translate(100, 160)">
    <!-- App Monogram -->
    <rect width="64" height="64" rx="16" fill="#181B21" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
    <path d="M20 16H36C43.732 16 50 22.268 50 30C50 37.732 43.732 44 36 44H28V52H20V16Z" fill="#F7F5F0"/>
    <rect x="28" y="24" width="8" height="10" rx="2" fill="#B85226"/>
    <circle cx="42" cy="48" r="4" fill="#B85226"/>

    <text x="0" y="140" font-family="'Fraunces', Georgia, serif" font-size="64" font-weight="700" fill="#F7F5F0" letter-spacing="-0.02em">
      Parichay
    </text>
    <text x="0" y="185" font-family="'Instrument Sans', sans-serif" font-size="24" font-weight="500" fill="#B85226">
      One card. One scan. Nothing leaves your phone.
    </text>
    <text x="0" y="235" font-family="'Instrument Sans', sans-serif" font-size="18" font-weight="400" fill="#9EA4B1">
      A private digital business card with compact offline vCard QRs.
    </text>
    <text x="0" y="265" font-family="'Instrument Sans', sans-serif" font-size="18" font-weight="400" fill="#9EA4B1">
      Zero servers. Zero tracking. Zero cloud.
    </text>
    
    <!-- Privacy Shield Indicator -->
    <g transform="translate(0, 310)">
      <rect width="210" height="38" rx="8" fill="#1A1E26" stroke="rgba(255,255,255,0.08)"/>
      <circle cx="20" cy="19" r="5" fill="#40916C"/>
      <text x="36" y="24" font-family="'Instrument Sans', sans-serif" font-size="13" font-weight="600" fill="#F7F5F0" letter-spacing="0.04em">
        100% PRIVATE &amp; OFFLINE
      </text>
    </g>
  </g>
</svg>`;

// Write SVGs to design/brand/
fs.writeFileSync(path.join(brandDir, 'monogram.svg'), monogramSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'wordmark.svg'), wordmarkSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'logo.svg'), logoSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'adaptive-fg.svg'), adaptiveFgSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'adaptive-bg.svg'), adaptiveBgSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'splash-light.svg'), splashLightSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'splash-dark.svg'), splashDarkSvg, 'utf-8');
fs.writeFileSync(path.join(brandDir, 'og-image.svg'), ogImageSvg, 'utf-8');

// Also place in public/ for web & PWA
fs.writeFileSync(path.join(publicDir, 'icon.svg'), monogramSvg, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'og-image.svg'), ogImageSvg, 'utf-8');

// Generate compliant PNGs for PWA & iOS apple-touch-icon
const png180 = createSolidPNG(180, 180, 17, 19, 23); // Obsidian dark
const png192 = createSolidPNG(192, 192, 17, 19, 23);
const png512 = createSolidPNG(512, 512, 17, 19, 23);

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);

// Copy to assets/
fs.writeFileSync(path.join(assetsDir, 'icon.png'), png512);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), png512);

console.log('Brand assets and PWA icons generated successfully.');
