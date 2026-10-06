import { Capacitor } from '@capacitor/core';
import { Clipboard as CapClipboard } from '@capacitor/clipboard';

export const clipboard = {
  async write(text: string): Promise<boolean> {
    if (Capacitor.isPluginAvailable('Clipboard')) {
      try {
        await CapClipboard.write({ string: text });
        return true;
      } catch (err) {
        console.warn('Capacitor Clipboard write error', err);
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Navigator clipboard write error', err);
      }
    }
    return false;
  },

  async read(): Promise<string> {
    if (Capacitor.isPluginAvailable('Clipboard')) {
      try {
        const { value } = await CapClipboard.read();
        return value || '';
      } catch {
        return '';
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return '';
      }
    }
    return '';
  },
};
