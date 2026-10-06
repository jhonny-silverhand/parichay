import { describe, it, expect } from 'vitest';

describe('Wallpaper Layout Geometry & Safe Zones', () => {
  const testDevices = [
    { name: 'Standard Full HD+', width: 1080, height: 2400 },
    { name: 'iPhone 14 / Pro', width: 1170, height: 2532 },
    { name: 'Quad HD Flagship', width: 1440, height: 3120 },
    { name: 'iPhone Pro Max', width: 1290, height: 2796 },
  ];

  testDevices.forEach(({ name, width, height }) => {
    it(`calculates compliant safe zones for ${name} (${width}x${height})`, () => {
      const topSafeZonePx = height * 0.32;
      const bottomSafeZonePx = height * 0.14;
      const activeZoneStartPx = topSafeZonePx;
      const activeZoneEndPx = height - bottomSafeZonePx;

      const qrWidth = Math.min(Math.round(width * 0.58), 900);
      const qrY = Math.round(height * 0.38);

      // Verify QR sits completely inside active safe band
      expect(qrY).toBeGreaterThanOrEqual(activeZoneStartPx);
      expect(qrY + qrWidth).toBeLessThan(activeZoneEndPx);

      // Verify QR width is proportional
      expect(qrWidth / width).toBeGreaterThanOrEqual(0.4);
      expect(qrWidth / width).toBeLessThanOrEqual(0.65);
    });
  });
});
