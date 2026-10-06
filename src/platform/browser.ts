import { Capacitor } from '@capacitor/core';
import { Browser as CapBrowser } from '@capacitor/browser';

export interface OpenUrlOptions {
  url: string;
  windowName?: string;
}

export const browser = {
  /**
   * Opens an external URL in the system browser (Safari/Chrome custom tab) on native
   * and via a safe blank window on web.
   */
  async openUrl({ url, windowName = '_blank' }: OpenUrlOptions): Promise<void> {
    if (!url) return;

    if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Browser')) {
      try {
        await CapBrowser.open({
          url,
          presentationStyle: 'popover',
          toolbarColor: '#111317',
        });
        return;
      } catch (err) {
        console.warn('Capacitor Browser open failed, falling back to window.open', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.open(url, windowName, 'noopener,noreferrer');
    }
  },

  async close(): Promise<void> {
    if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Browser')) {
      try {
        await CapBrowser.close();
      } catch {
        // Silently catch
      }
    }
  },
};
