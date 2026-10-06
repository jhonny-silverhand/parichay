import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Design Tokens Schema & Integrity', () => {
  const tokensPath = path.resolve(__dirname, '../design/tokens/tokens.json');
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  it('contains light and dark color palettes', () => {
    expect(tokens.color.light).toBeDefined();
    expect(tokens.color.dark).toBeDefined();
    expect(tokens.color.light['accent'].value).toBe('#B85226');
  });

  it('defines typography scale and font families', () => {
    expect(tokens.font.family.display.value).toContain('Fraunces');
    expect(tokens.font.family.sans.value).toContain('Instrument Sans');
    expect(tokens.font.size.base.value).toBe('15px');
  });

  it('defines 4/8pt spacing scale and touch target minimum', () => {
    expect(tokens.spacing['1'].value).toBe('4px');
    expect(tokens.spacing['2'].value).toBe('8px');
    expect(tokens.spacing['4'].value).toBe('16px');
    expect(tokens.layout['min-touch'].value).toBe('44px');
  });
});
