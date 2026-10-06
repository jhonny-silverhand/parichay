import { Capacitor } from '@capacitor/core';
import { Share as CapShare } from '@capacitor/share';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
  files?: string[]; // Array of file URIs
}

export const share = {
  async canShare(): Promise<boolean> {
    if (Capacitor.isPluginAvailable('Share')) {
      try {
        const { value } = await CapShare.canShare();
        return value;
      } catch {
        return false;
      }
    }
    return typeof navigator !== 'undefined' && 'share' in navigator;
  },

  async share(options: ShareOptions): Promise<boolean> {
    if (Capacitor.isPluginAvailable('Share')) {
      try {
        await CapShare.share({
          title: options.title,
          text: options.text,
          url: options.url,
          dialogTitle: options.dialogTitle,
          files: options.files,
        });
        return true;
      } catch (err: any) {
        // Ignore user cancellation
        if (err.name === 'AbortError' || err.message?.includes('canceled')) {
          return false;
        }
        console.warn('Capacitor Share failed', err);
      }
    }

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
        return true;
      } catch (err: any) {
        if (err.name === 'AbortError') return false;
      }
    }

    return false;
  },
};
