import { Capacitor } from '@capacitor/core';
import { Keyboard as CapKeyboard } from '@capacitor/keyboard';

export const keyboard = {
  async hide(): Promise<void> {
    if (Capacitor.isPluginAvailable('Keyboard')) {
      try {
        await CapKeyboard.hide();
      } catch {
        // Silently catch
      }
    } else if (typeof document !== 'undefined' && document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  },

  async show(): Promise<void> {
    if (Capacitor.isPluginAvailable('Keyboard')) {
      try {
        await CapKeyboard.show();
      } catch {
        // Silently catch
      }
    }
  },

  onShow(callback: (info: { keyboardHeight: number }) => void): () => void {
    if (Capacitor.isPluginAvailable('Keyboard')) {
      const handle = CapKeyboard.addListener('keyboardWillShow', callback);
      return () => {
        handle.then((h) => h.remove()).catch(() => {});
      };
    }
    return () => {};
  },

  onHide(callback: () => void): () => void {
    if (Capacitor.isPluginAvailable('Keyboard')) {
      const handle = CapKeyboard.addListener('keyboardWillHide', callback);
      return () => {
        handle.then((h) => h.remove()).catch(() => {});
      };
    }
    return () => {};
  },
};
