import { Capacitor } from '@capacitor/core';
import { ScreenOrientation as CapOrientation, type OrientationLockType } from '@capacitor/screen-orientation';

export const orientation = {
  async lock(type: 'portrait' | 'landscape'): Promise<void> {
    if (Capacitor.isPluginAvailable('ScreenOrientation')) {
      try {
        const lockType: OrientationLockType =
          type === 'landscape' ? 'landscape-primary' : 'portrait-primary';
        await CapOrientation.lock({ orientation: lockType });
      } catch {
        // Silently catch
      }
    }
  },

  async unlock(): Promise<void> {
    if (Capacitor.isPluginAvailable('ScreenOrientation')) {
      try {
        await CapOrientation.unlock();
      } catch {
        // Silently catch
      }
    }
  },

  async getCurrent(): Promise<string> {
    if (Capacitor.isPluginAvailable('ScreenOrientation')) {
      try {
        const { type } = await CapOrientation.orientation();
        return type;
      } catch {
        // Silently catch
      }
    }
    return typeof window !== 'undefined' && window.innerWidth > window.innerHeight
      ? 'landscape'
      : 'portrait';
  },
};
