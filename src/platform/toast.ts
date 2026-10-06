import { Capacitor } from '@capacitor/core';
import { Toast as CapToast } from '@capacitor/toast';

export interface ShowToastOptions {
  text: string;
  duration?: 'short' | 'long';
  position?: 'top' | 'center' | 'bottom';
}

export const toast = {
  async show({ text, duration = 'short', position = 'bottom' }: ShowToastOptions): Promise<void> {
    if (Capacitor.isPluginAvailable('Toast')) {
      try {
        await CapToast.show({
          text,
          duration,
          position,
        });
        return;
      } catch (err) {
        console.warn('Capacitor Toast error', err);
      }
    }

    // In web, fallback to console or dispatch custom event for in-app toast
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('parichay-toast', {
          detail: { message: text, type: 'info' },
        })
      );
    }
  },
};
