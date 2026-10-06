import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

export const lifecycle = {
  onPause(callback: () => void): () => void {
    if (Capacitor.isPluginAvailable('App')) {
      const handle = CapApp.addListener('appStateChange', (state) => {
        if (!state.isActive) callback();
      });
      return () => {
        handle.then((h) => h.remove()).catch(() => {});
      };
    }
    if (typeof document !== 'undefined') {
      const handleVis = () => {
        if (document.visibilityState === 'hidden') callback();
      };
      document.addEventListener('visibilitychange', handleVis);
      return () => document.removeEventListener('visibilitychange', handleVis);
    }
    return () => {};
  },

  onResume(callback: () => void): () => void {
    if (Capacitor.isPluginAvailable('App')) {
      const handle = CapApp.addListener('appStateChange', (state) => {
        if (state.isActive) callback();
      });
      return () => {
        handle.then((h) => h.remove()).catch(() => {});
      };
    }
    if (typeof document !== 'undefined') {
      const handleVis = () => {
        if (document.visibilityState === 'visible') callback();
      };
      document.addEventListener('visibilitychange', handleVis);
      return () => document.removeEventListener('visibilitychange', handleVis);
    }
    return () => {};
  },

  onBackButton(callback: () => void): () => void {
    if (Capacitor.isPluginAvailable('App')) {
      const handle = CapApp.addListener('backButton', () => {
        callback();
      });
      return () => {
        handle.then((h) => h.remove()).catch(() => {});
      };
    }
    return () => {};
  },

  exitApp(): void {
    if (Capacitor.isPluginAvailable('App')) {
      CapApp.exitApp();
    }
  },
};
