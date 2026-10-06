import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const NativeStatusBar = {
  async setStyle(theme: 'light' | 'dark', isFullscreen = false) {
    if (!Capacitor.isPluginAvailable('StatusBar')) return;

    try {
      if (isFullscreen) {
        // Fullscreen QR has pure white plate - dark icons
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
        }
      } else if (theme === 'dark') {
        // Dark theme: light icons on obsidian background
        await StatusBar.setStyle({ style: Style.Dark });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#111317' });
        }
      } else {
        // Light theme: dark icons on warm linen background
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#F7F5F0' });
        }
      }
    } catch (e) {
      console.debug('StatusBar styling not supported in this runtime:', e);
    }
  },

  async show() {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        await StatusBar.show();
      } catch {}
    }
  },

  async hide() {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        await StatusBar.hide();
      } catch {}
    }
  },
};
