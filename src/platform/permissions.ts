import { Capacitor } from '@capacitor/core';
import { dialog } from './dialog';

export interface PermissionFlowOptions {
  title: string;
  explanation: string;
  deniedExplanation?: string;
}

export const permissions = {
  /**
   * Reusable permission flow:
   * 1. Warm-up explanation prompt explaining WHY the permission is needed.
   * 2. If user agrees, calls system request action.
   * 3. If denied, provides guidance to enable via system settings.
   */
  async requestWithWarmup(
    permissionKey: string,
    options: PermissionFlowOptions,
    requestFn: () => Promise<{ granted: boolean }>
  ): Promise<boolean> {
    // 1. Warm-up explanation
    const userWantsToProceed = await dialog.confirm({
      title: options.title,
      message: options.explanation,
      okButtonTitle: 'Continue',
      cancelButtonTitle: 'Not Now',
    });

    if (!userWantsToProceed) {
      return false;
    }

    try {
      const result = await requestFn();
      if (result.granted) {
        return true;
      }
    } catch (err) {
      console.warn(`Permission request failed for ${permissionKey}`, err);
    }

    // 3. Denied feedback
    if (options.deniedExplanation) {
      await dialog.alert({
        title: 'Permission Required',
        message: options.deniedExplanation,
        buttonTitle: 'OK',
      });
    }

    return false;
  },
};
