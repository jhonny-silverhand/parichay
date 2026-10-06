import { Capacitor } from '@capacitor/core';
import { StatusBar as CapStatusBar, Style } from '@capacitor/status-bar';

export const statusBar = {
  async setStyle(style: 'dark' | 'light' | 'default'): Promise<void> {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        const mapped =
          style === 'dark' ? Style.Dark : style === 'light' ? Style.Light : Style.Default;
        await CapStatusBar.setStyle({ style: mapped });
      } catch {
        // Silently catch
      }
    }
  },

  async setBackgroundColor(color: string): Promise<void> {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        await CapStatusBar.setBackgroundColor({ color });
      } catch {
        // Silently catch
      }
    }
  },

  async show(): Promise<void> {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        await CapStatusBar.show();
      } catch {
        // Silently catch
      }
    }
  },

  async hide(): Promise<void> {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        await CapStatusBar.hide();
      } catch {
        // Silently catch
      }
    }
  },
};
