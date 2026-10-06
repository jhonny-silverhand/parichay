import { Capacitor } from '@capacitor/core';
import { Device as CapDevice } from '@capacitor/device';
import { App as CapApp } from '@capacitor/app';
import type { DeviceInfo, PlatformType } from './types';

export const deviceInfo = {
  async getInfo(): Promise<DeviceInfo> {
    let appVersion = '1.0.0';
    let appBuild = '1';

    if (Capacitor.isPluginAvailable('App')) {
      try {
        const appInfo = await CapApp.getInfo();
        appVersion = appInfo.version;
        appBuild = appInfo.build;
      } catch {
        // Silently fallback
      }
    }

    if (Capacitor.isPluginAvailable('Device')) {
      try {
        const info = await CapDevice.getInfo();
        return {
          model: info.model,
          platform: (info.platform as PlatformType) || 'web',
          operatingSystem: (info.operatingSystem as any) || 'unknown',
          osVersion: info.osVersion,
          manufacturer: info.manufacturer,
          isVirtual: info.isVirtual,
          appVersion,
          appBuild,
        };
      } catch {
        // Fall through
      }
    }

    const platform: PlatformType = Capacitor.isNativePlatform()
      ? (Capacitor.getPlatform() as PlatformType)
      : 'web';

    return {
      model: typeof navigator !== 'undefined' ? navigator.userAgent : 'Generic Browser',
      platform,
      operatingSystem: 'unknown',
      osVersion: '1.0',
      manufacturer: 'Unknown',
      isVirtual: false,
      appVersion,
      appBuild,
    };
  },

  async getBatteryLevel(): Promise<number | null> {
    if (Capacitor.isPluginAvailable('Device')) {
      try {
        const info = await CapDevice.getBatteryInfo();
        return info.batteryLevel ?? null;
      } catch {
        return null;
      }
    }
    return null;
  },
};
