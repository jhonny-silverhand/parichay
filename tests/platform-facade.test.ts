import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  haptics,
  clipboard,
  network,
  browser,
  dialog,
  deviceInfo,
  platform,
} from '../src/platform';

describe('Platform Facade & Web Fallbacks', () => {
  const originalWindow = (globalThis as any).window;
  const originalNavigatorDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

  beforeAll(() => {
    (globalThis as any).window = {
      open: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      innerWidth: 390,
      innerHeight: 844,
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        onLine: true,
        userAgent: 'ParichayTestAgent',
        vibrate: vi.fn(),
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
          readText: vi.fn().mockResolvedValue('test clipboard content'),
        },
      },
      configurable: true,
      writable: true,
    });
  });

  afterAll(() => {
    (globalThis as any).window = originalWindow;
    if (originalNavigatorDesc) {
      Object.defineProperty(globalThis, 'navigator', originalNavigatorDesc);
    }
  });

  it('correctly reports platform flags', () => {
    expect(typeof platform.isNative).toBe('boolean');
    expect(typeof platform.isWeb).toBe('boolean');
  });

  it('handles haptics calls safely in web environment without exceptions', async () => {
    await expect(haptics.impact('light')).resolves.not.toThrow();
    await expect(haptics.impact('medium')).resolves.not.toThrow();
    await expect(haptics.impact('heavy')).resolves.not.toThrow();
    await expect(haptics.notification('success')).resolves.not.toThrow();
    await expect(haptics.selection()).resolves.not.toThrow();
  });

  it('handles network getStatus and listener subscription safely', async () => {
    const status = await network.getStatus();
    expect(typeof status.connected).toBe('boolean');
    expect(['wifi', 'cellular', 'none', 'unknown']).toContain(status.connectionType);

    const unsubscribe = network.onStatusChange(() => {});
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('handles clipboard methods with safe return values', async () => {
    const written = await clipboard.write('sample text');
    expect(typeof written).toBe('boolean');

    const readVal = await clipboard.read();
    expect(typeof readVal).toBe('string');
  });

  it('handles device info retrieval with complete attributes', async () => {
    const info = await deviceInfo.getInfo();
    expect(info).toHaveProperty('model');
    expect(info).toHaveProperty('platform');
    expect(info).toHaveProperty('appVersion');
    expect(info.appVersion).toBe('1.0.0');
  });

  it('invokes browser.openUrl safely', async () => {
    const openSpy = (globalThis as any).window.open;
    await browser.openUrl({ url: 'https://omkardile.is-a.dev/' });
    expect(openSpy).toHaveBeenCalledWith('https://omkardile.is-a.dev/', '_blank', 'noopener,noreferrer');
  });

  it('provides safe dialog fallbacks', async () => {
    await expect(dialog.alert({ title: 'Test', message: 'Message' })).resolves.toBeUndefined();
    const confirmed = await dialog.confirm({ title: 'Confirm', message: 'Proceed?' });
    expect(typeof confirmed).toBe('boolean');
  });
});
