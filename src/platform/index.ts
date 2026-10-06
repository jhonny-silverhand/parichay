import { Capacitor } from '@capacitor/core';

export * from './types';
export { haptics } from './haptics';
export { share } from './share';
export { clipboard } from './clipboard';
export { network } from './network';
export { browser } from './browser';
export { dialog } from './dialog';
export { toast } from './toast';
export { actionSheet } from './action-sheet';
export { keyboard } from './keyboard';
export { statusBar } from './status-bar';
export { orientation } from './orientation';
export { lifecycle } from './lifecycle';
export { deviceInfo } from './device-info';
export { permissions } from './permissions';
export { splash } from './splash';

export const platform = {
  isNative: Capacitor.isNativePlatform(),
  isAndroid: Capacitor.getPlatform() === 'android',
  isIOS: Capacitor.getPlatform() === 'ios',
  isWeb: !Capacitor.isNativePlatform(),
  type: Capacitor.getPlatform(),
};
