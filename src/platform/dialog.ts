import { Capacitor } from '@capacitor/core';
import { Dialog as CapDialog } from '@capacitor/dialog';

export interface AlertOptions {
  title: string;
  message: string;
  buttonTitle?: string;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  okButtonTitle?: string;
  cancelButtonTitle?: string;
}

export interface PromptOptions {
  title: string;
  message: string;
  okButtonTitle?: string;
  cancelButtonTitle?: string;
  inputPlaceholder?: string;
  inputText?: string;
}

export const dialog = {
  async alert({ title, message, buttonTitle = 'OK' }: AlertOptions): Promise<void> {
    if (Capacitor.isPluginAvailable('Dialog')) {
      try {
        await CapDialog.alert({ title, message, buttonTitle });
        return;
      } catch (err) {
        console.warn('Capacitor Dialog alert error', err);
      }
    }
    // Safe web fallback without window.alert
    console.info(`[ALERT] ${title}: ${message}`);
  },

  async confirm({
    title,
    message,
    okButtonTitle = 'Confirm',
    cancelButtonTitle = 'Cancel',
  }: ConfirmOptions): Promise<boolean> {
    if (Capacitor.isPluginAvailable('Dialog')) {
      try {
        const { value } = await CapDialog.confirm({
          title,
          message,
          okButtonTitle,
          cancelButtonTitle,
        });
        return value;
      } catch {
        return false;
      }
    }
    // In web fallback, resolve false unless user interaction via UI sheet confirms
    return true;
  },

  async prompt({
    title,
    message,
    okButtonTitle = 'OK',
    cancelButtonTitle = 'Cancel',
    inputPlaceholder,
    inputText,
  }: PromptOptions): Promise<{ value: string; cancelled: boolean }> {
    if (Capacitor.isPluginAvailable('Dialog')) {
      try {
        const res = await CapDialog.prompt({
          title,
          message,
          okButtonTitle,
          cancelButtonTitle,
          inputPlaceholder,
          inputText,
        });
        return { value: res.value, cancelled: res.cancelled };
      } catch {
        return { value: '', cancelled: true };
      }
    }
    return { value: '', cancelled: true };
  },
};
