import { describe, it, expect } from 'vitest';
import { calculateContrastRatio } from '@/web/lib/scan-check';

describe('QR Scan Reliability & Contrast Analysis', () => {
  it('calculates maximum contrast for black on white (21:1)', () => {
    const ratio = calculateContrastRatio('#000000', '#FFFFFF');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('calculates minimum contrast for identical colors (1:1)', () => {
    const ratio = calculateContrastRatio('#111317', '#111317');
    expect(ratio).toBeCloseTo(1, 0);
  });

  it('verifies that default Parichay brand colors meet WCAG AA optical contrast (>4.5:1)', () => {
    // Obsidian on Paper Light
    const ratio = calculateContrastRatio('#111317', '#F7F5F0');
    expect(ratio).toBeGreaterThan(10);
  });

  it('detects dangerously low contrast combinations (<3.5:1)', () => {
    // Yellow on white or light grey
    const lowRatio = calculateContrastRatio('#F2B705', '#FFFFFF');
    expect(lowRatio).toBeLessThan(3.5);
  });
});
