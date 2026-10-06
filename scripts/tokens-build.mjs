import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const tokensPath = path.join(rootDir, 'design', 'tokens', 'tokens.json');
const outputPath = path.join(rootDir, 'src', 'web', 'styles', 'tokens.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

function formatCSS(tokens) {
  const lightColors = tokens.color.light;
  const darkColors = tokens.color.dark;
  const fonts = tokens.font;
  const spacing = tokens.spacing;
  const radius = tokens.radius;
  const elevation = tokens.elevation;
  const motion = tokens.motion;
  const layout = tokens.layout;

  let css = `/**
 * AUTO-GENERATED DESIGN TOKENS
 * Generated from design/tokens/tokens.json by scripts/tokens-build.mjs
 * DO NOT EDIT DIRECTLY.
 */

:root {
  /* Layout & Geometry */
  --layout-max-width: ${layout['max-width'].value};
  --layout-desktop-split: ${layout['desktop-split'].value};
  --min-touch-target: ${layout['min-touch'].value};

  /* Typography Families */
  --font-display: ${fonts.family.display.value};
  --font-sans: ${fonts.family.sans.value};
  --font-mono: ${fonts.family.mono.value};
  --font-devanagari: ${fonts.family.devanagari.value};

  /* Typography Scales */
  --text-2xs: ${fonts.size['2xs'].value};
  --text-xs: ${fonts.size['xs'].value};
  --text-sm: ${fonts.size.sm.value};
  --text-base: ${fonts.size.base.value};
  --text-md: ${fonts.size.md.value};
  --text-lg: ${fonts.size.lg.value};
  --text-xl: ${fonts.size.xl.value};
  --text-2xl: ${fonts.size['2xl'].value};
  --text-3xl: ${fonts.size['3xl'].value};
  --text-display: ${fonts.size.display.value};

  /* Font Weights */
  --weight-normal: ${fonts.weight.normal.value};
  --weight-medium: ${fonts.weight.medium.value};
  --weight-semibold: ${fonts.weight.semibold.value};
  --weight-bold: ${fonts.weight.bold.value};

  /* Line Heights */
  --leading-tight: ${fonts.lineHeight.tight.value};
  --leading-snug: ${fonts.lineHeight.snug.value};
  --leading-normal: ${fonts.lineHeight.normal.value};
  --leading-relaxed: ${fonts.lineHeight.relaxed.value};

  /* Letter Spacing */
  --tracking-tighter: ${fonts.letterSpacing.tighter.value};
  --tracking-tight: ${fonts.letterSpacing.tight.value};
  --tracking-normal: ${fonts.letterSpacing.normal.value};
  --tracking-wide: ${fonts.letterSpacing.wide.value};
  --tracking-widest: ${fonts.letterSpacing.widest.value};

  /* Spacing Grid (4/8pt) */
  --space-0: ${spacing['0'].value};
  --space-1: ${spacing['1'].value};
  --space-2: ${spacing['2'].value};
  --space-3: ${spacing['3'].value};
  --space-4: ${spacing['4'].value};
  --space-5: ${spacing['5'].value};
  --space-6: ${spacing['6'].value};
  --space-8: ${spacing['8'].value};
  --space-10: ${spacing['10'].value};
  --space-12: ${spacing['12'].value};
  --space-16: ${spacing['16'].value};

  /* Radius Scale */
  --radius-none: ${radius.none.value};
  --radius-xs: ${radius.xs.value};
  --radius-sm: ${radius.sm.value};
  --radius-md: ${radius.md.value};
  --radius-lg: ${radius.lg.value};
  --radius-xl: ${radius.xl.value};
  --radius-full: ${radius.full.value};

  /* Elevation Shadows */
  --elevation-none: ${elevation.none.value};
  --elevation-subtle: ${elevation.subtle.value};
  --elevation-card: ${elevation.card.value};
  --elevation-sheet: ${elevation.sheet.value};
  --elevation-floating: ${elevation.floating.value};

  /* Motion & Transitions */
  --duration-instant: ${motion.duration.instant.value};
  --duration-fast: ${motion.duration.fast.value};
  --duration-normal: ${motion.duration.normal.value};
  --duration-deliberate: ${motion.duration.deliberate.value};
  --ease-standard: ${motion.easing.standard.value};
  --ease-enter: ${motion.easing.enter.value};
  --ease-exit: ${motion.easing.exit.value};

  /* Light Theme Colors (Default) */
`;

  for (const [key, item] of Object.entries(lightColors)) {
    css += `  --color-${key}: ${item.value};\n`;
  }

  css += `}\n\n`;

  css += `/* Dark Theme Token Overrides */\n[data-theme="dark"] {\n`;
  for (const [key, item] of Object.entries(darkColors)) {
    css += `  --color-${key}: ${item.value};\n`;
  }
  css += `}\n\n`;

  css += `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n`;
  for (const [key, item] of Object.entries(darkColors)) {
    css += `    --color-${key}: ${item.value};\n`;
  }
  css += `  }\n}\n`;

  return css;
}

const cssOutput = formatCSS(tokens);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, cssOutput, 'utf-8');
console.log(`Tokens compiled successfully to ${outputPath}`);
