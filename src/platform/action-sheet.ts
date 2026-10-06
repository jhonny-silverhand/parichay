import { Capacitor } from '@capacitor/core';
import {
  ActionSheet as CapActionSheet,
  ActionSheetButtonStyle,
  type ActionSheetButton,
} from '@capacitor/action-sheet';

export interface ActionSheetOption {
  title: string;
  style?: 'default' | 'destructive' | 'cancel';
  icon?: string;
}

export const actionSheet = {
  async show(title: string, options: ActionSheetOption[]): Promise<number | null> {
    if (Capacitor.isPluginAvailable('ActionSheet')) {
      try {
        const buttons: ActionSheetButton[] = options.map((opt) => ({
          title: opt.title,
          style:
            opt.style === 'destructive'
              ? ActionSheetButtonStyle.Destructive
              : opt.style === 'cancel'
              ? ActionSheetButtonStyle.Cancel
              : ActionSheetButtonStyle.Default,
          icon: opt.icon,
        }));

        const result = await CapActionSheet.showActions({
          title,
          options: buttons,
        });

        return result.index;
      } catch {
        return null;
      }
    }
    return null;
  },
};
