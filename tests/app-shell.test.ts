import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(__dirname, '..');

describe('App Shell Layout & Invariants Verification', () => {
  it('enforces fixed position and zero body scrolling in global.css', () => {
    const globalCss = fs.readFileSync(path.join(rootDir, 'src/web/styles/global.css'), 'utf-8');
    expect(globalCss).toContain('overflow: hidden');
    expect(globalCss).toContain('overscroll-behavior: none');
    expect(globalCss).toContain('position: fixed');
    expect(globalCss).toContain('--safe-top');
    expect(globalCss).toContain('--safe-bottom');
  });

  it('declares interactive-widget=resizes-content in index.html', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    expect(indexHtml).toContain('interactive-widget=resizes-content');
    expect(indexHtml).toContain('viewport-fit=cover');
  });

  it('guarantees min 16px font size on inputs in global.css', () => {
    const globalCss = fs.readFileSync(path.join(rootDir, 'src/web/styles/global.css'), 'utf-8');
    expect(globalCss).toContain('font-size: max(16px, 1rem) !important');
  });

  it('verifies Layout Lab dev route exists in App.tsx', () => {
    const appTsx = fs.readFileSync(path.join(rootDir, 'src/web/app/App.tsx'), 'utf-8');
    expect(appTsx).toContain('path="/dev/layout-lab"');
    expect(appTsx).toContain('path="/dev/styleguide"');
  });
});
