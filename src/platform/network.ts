import { Capacitor } from '@capacitor/core';
import { Network as CapNetwork } from '@capacitor/network';
import type { NetworkStatus } from './types';

export const network = {
  async getStatus(): Promise<NetworkStatus> {
    if (Capacitor.isPluginAvailable('Network')) {
      try {
        const status = await CapNetwork.getStatus();
        if (status && typeof status.connected === 'boolean') {
          return {
            connected: status.connected,
            connectionType: (status.connectionType as any) || 'unknown',
          };
        }
      } catch {
        // Fall through
      }
    }

    const online =
      typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

    return {
      connected: online,
      connectionType: online ? 'wifi' : 'none',
    };
  },

  onStatusChange(callback: (status: NetworkStatus) => void): () => void {
    if (Capacitor.isPluginAvailable('Network')) {
      const handle = CapNetwork.addListener('networkStatusChange', (status) => {
        callback({
          connected: status.connected,
          connectionType: (status.connectionType as any) || 'unknown',
        });
      });
      return () => {
        handle.then((h) => h.remove()).catch(() => {});
      };
    }

    if (typeof window !== 'undefined') {
      const handleOnline = () => callback({ connected: true, connectionType: 'wifi' });
      const handleOffline = () => callback({ connected: false, connectionType: 'none' });

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {};
  },
};
