import { Capacitor } from '@capacitor/core';
import { SplashScreen as CapSplash } from '@capacitor/splash-screen';

export const splash = {
  async hide(): Promise<void> {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      try {
        await CapSplash.hide();
      } catch {
        // Silently catch
      }
    }
  },
};
