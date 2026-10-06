import { registerPlugin, Capacitor } from '@capacitor/core';

export interface ScreenMetrics {
  widthPx: number;
  heightPx: number;
  density: number;
}

export interface SetWallpaperOptions {
  dataUrl?: string;
  path?: string;
  alsoHome?: boolean;
}

export interface SaveGalleryOptions {
  dataUrl: string;
  filename: string;
}

export interface DeviceToolsPlugin {
  getScreenMetrics(): Promise<ScreenMetrics>;
  setLockScreenWallpaper(options: SetWallpaperOptions): Promise<{ success: boolean; error?: string }>;
  openWallpaperPicker(options: { path?: string; dataUrl?: string }): Promise<{ success: boolean }>;
  saveImageToGallery(options: SaveGalleryOptions): Promise<{ success: boolean; uri?: string }>;
  openGoogleWallet(): Promise<{ success: boolean }>;
  keepScreenOn(options: { enabled: boolean }): Promise<{ success: boolean }>;
}

let wakeLockSentinel: any = null;

// Pure Web Fallbacks
const WebDeviceTools: DeviceToolsPlugin = {
  async getScreenMetrics(): Promise<ScreenMetrics> {
    if (typeof window === 'undefined') {
      return { widthPx: 1080, heightPx: 1920, density: 1 };
    }
    const dpr = window.devicePixelRatio || 1;
    return {
      widthPx: Math.round(window.screen.width * dpr),
      heightPx: Math.round(window.screen.height * dpr),
      density: dpr,
    };
  },

  async setLockScreenWallpaper(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Direct wallpaper setting requires Android native app. Please save image and set in Settings.',
    };
  },

  async openWallpaperPicker(): Promise<{ success: boolean }> {
    return { success: false };
  },

  async saveImageToGallery({ dataUrl, filename }: SaveGalleryOptions): Promise<{ success: boolean; uri?: string }> {
    if (typeof document === 'undefined') return { success: false };
    try {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  async openGoogleWallet(): Promise<{ success: boolean }> {
    return { success: false };
  },

  async keepScreenOn({ enabled }): Promise<{ success: boolean }> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (enabled) {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        } else if (wakeLockSentinel) {
          await wakeLockSentinel.release();
          wakeLockSentinel = null;
        }
        return { success: true };
      } catch {
        return { success: false };
      }
    }
    return { success: false };
  },
};

// Register Capacitor plugin with fallback
export const DeviceTools = Capacitor.isPluginAvailable('DeviceTools')
  ? registerPlugin<DeviceToolsPlugin>('DeviceTools', {
      web: () => Promise.resolve(WebDeviceTools),
    })
  : WebDeviceTools;
