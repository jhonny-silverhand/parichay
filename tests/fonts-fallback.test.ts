import { describe, it, expect } from 'vitest';
import {
  FONT_CATALOG,
  hasDevanagari,
  resolveFontFamilyWithFallback,
} from '@/web/lib/fonts';

describe('Font Library & Non-Latin Fallback Detection', () => {
  it('contains at least 15 curated font families across categories', () => {
    expect(FONT_CATALOG.length).toBeGreaterThanOrEqual(15);
    const categories = new Set(FONT_CATALOG.map((f) => f.category));
    expect(categories.has('serif')).toBe(true);
    expect(categories.has('sans')).toBe(true);
    expect(categories.has('mono')).toBe(true);
    expect(categories.has('script')).toBe(true);
    expect(categories.has('devanagari')).toBe(true);
  });

  it('detects Devanagari script characters', () => {
    expect(hasDevanagari('Aditi Sharma')).toBe(false);
    expect(hasDevanagari('अदिती शर्मा')).toBe(true);
    expect(hasDevanagari('परिचय')).toBe(true);
  });

  it('automatically falls back to Noto font when Latin font cannot display Devanagari', () => {
    // Fraunces is a Latin-only serif font
    const resolved = resolveFontFamilyWithFallback('Fraunces', 'अदिती शर्मा');
    expect(resolved.hasFallback).toBe(true);
    expect(resolved.family).toContain('Noto Serif Devanagari');
  });

  it('does not trigger fallback when font already supports Devanagari', () => {
    const resolved = resolveFontFamilyWithFallback('Noto Sans Devanagari', 'अदिती शर्मा');
    expect(resolved.hasFallback).toBe(false);
    expect(resolved.family).toBe('Noto Sans Devanagari');
  });
});
