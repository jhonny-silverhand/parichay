import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { BRAND } from '@/shared/brand';

export const NativeNotifications = {
  async hasPermission(): Promise<boolean> {
    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      try {
        const status = await LocalNotifications.checkPermissions();
        return status.display === 'granted';
      } catch {
        return false;
      }
    }
    if (typeof Notification !== 'undefined') {
      return Notification.permission === 'granted';
    }
    return false;
  },

  async requestPermission(): Promise<boolean> {
    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      try {
        const status = await LocalNotifications.requestPermissions();
        return status.display === 'granted';
      } catch {
        return false;
      }
    }
    if (typeof Notification !== 'undefined') {
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return false;
  },

  async sendCardReadyNotification(name: string) {
    const title = `${BRAND.name} · Digital Card Ready`;
    const body = `Your offline vCard for ${name} is generated and ready to share!`;

    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      try {
        const permitted = await this.requestPermission();
        if (!permitted) return;

        await LocalNotifications.schedule({
          notifications: [
            {
              id: 101,
              title,
              body,
              smallIcon: 'ic_launcher_round',
              schedule: { at: new Date(Date.now() + 1000) },
              sound: undefined,
              actionTypeId: '',
              extra: { route: '/' },
            },
          ],
        });
      } catch (e) {
        console.debug('Local notification schedule error:', e);
      }
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon.svg' });
    }
  },

  async sendTestNotification() {
    const title = `${BRAND.name} · Native Notification`;
    const body = 'Local push notifications are operating 100% offline on your device.';

    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      const permitted = await this.requestPermission();
      if (!permitted) return false;

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 201,
            title,
            body,
            smallIcon: 'ic_launcher_round',
            schedule: { at: new Date(Date.now() + 500) },
          },
        ],
      });
      return true;
    } else if (typeof Notification !== 'undefined') {
      const res = await Notification.requestPermission();
      if (res === 'granted') {
        new Notification(title, { body, icon: '/icon.svg' });
        return true;
      }
    }
    return false;
  },

  async scheduleBackupReminder(days = 30) {
    if (!Capacitor.isPluginAvailable('LocalNotifications')) return;

    try {
      const permitted = await this.requestPermission();
      if (!permitted) return;

      const triggerTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 301,
            title: `${BRAND.name} · Backup Reminder`,
            body: 'Keep an offline copy of your digital business card in Settings.',
            schedule: { at: triggerTime },
            smallIcon: 'ic_launcher_round',
          },
        ],
      });
    } catch (e) {
      console.debug('Failed to schedule backup reminder:', e);
    }
  },
};
