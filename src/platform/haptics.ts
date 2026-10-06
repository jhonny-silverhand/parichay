import { Capacitor } from '@capacitor/core';
import { Haptics as CapHaptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const haptics = {
  async impact(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
    if (Capacitor.isPluginAvailable('Haptics')) {
      try {
        const mapped =
          style === 'heavy'
            ? ImpactStyle.Heavy
            : style === 'medium'
            ? ImpactStyle.Medium
            : ImpactStyle.Light;
        await CapHaptics.impact({ style: mapped });
      } catch {
        // Silently catch unsupported environments
      }
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const ms = style === 'heavy' ? 40 : style === 'medium' ? 20 : 10;
      try {
        navigator.vibrate(ms);
      } catch {
        // Silently catch
      }
    }
  },

  async notification(type: 'success' | 'warning' | 'error' = 'success'): Promise<void> {
    if (Capacitor.isPluginAvailable('Haptics')) {
      try {
        const mapped =
          type === 'error'
            ? NotificationType.Error
            : type === 'warning'
            ? NotificationType.Warning
            : NotificationType.Success;
        await CapHaptics.notification({ type: mapped });
      } catch {
        // Silently catch
      }
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const pattern = type === 'error' ? [30, 40, 30] : [20, 20];
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently catch
      }
    }
  },

  async selection(): Promise<void> {
    if (Capacitor.isPluginAvailable('Haptics')) {
      try {
        await CapHaptics.selectionChanged();
      } catch {
        // Silently catch
      }
    }
  },
};
