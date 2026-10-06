import { get, set, del, clear } from 'idb-keyval';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { CardSchema, type Card, AppSettingsSchema, type AppSettings } from '@/shared/card';
import type { QRStyle } from './qr-style-types';

const KEY_CARD = 'parichay_card_v1';
const KEY_CARD_BAK = 'parichay_card_v1_bak';
const KEY_CARD_DRAFT = 'parichay_card_draft';
const KEY_STYLE = 'parichay_style_v1';
const KEY_SETTINGS = 'parichay_settings_v1';
const PHOTO_FILENAME = 'parichay_profile_photo.jpg';

export interface StorageStatus {
  persisted: boolean;
  backend: 'native' | 'indexeddb';
}

export interface StorageAdapter {
  getCard(): Promise<Card | null>;
  saveCard(card: Card): Promise<void>;
  getDraftCard(): Promise<Partial<Card> | null>;
  saveDraftCard(draft: Partial<Card> | null): Promise<void>;
  getPhoto(): Promise<string | null>;
  savePhoto(photoDataUrl: string): Promise<void>;
  deletePhoto(): Promise<void>;
  getStyle(): Promise<QRStyle | null>;
  saveStyle(style: QRStyle): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
  clearAll(): Promise<void>;
  getStatus(): Promise<StorageStatus>;
}

// 1. Web Storage via IndexedDB (idb-keyval)
class WebStorageAdapter implements StorageAdapter {
  async getCard(): Promise<Card | null> {
    try {
      const raw = await get<unknown>(KEY_CARD);
      if (!raw) return null;
      const parsed = CardSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data;
      }
      console.warn('Card schema mismatch, attempting backup restore...', parsed.error);
      const bak = await get<unknown>(KEY_CARD_BAK);
      if (bak) {
        const bakParsed = CardSchema.safeParse(bak);
        if (bakParsed.success) return bakParsed.data;
      }
      return null;
    } catch (e) {
      console.error('Failed to read card from IndexedDB:', e);
      return null;
    }
  }

  async saveCard(card: Card): Promise<void> {
    try {
      // First save current good as backup
      const existing = await get<unknown>(KEY_CARD);
      if (existing) {
        await set(KEY_CARD_BAK, existing);
      }
      await set(KEY_CARD, card);
    } catch (e) {
      console.error('Failed to save card to IndexedDB:', e);
      throw e;
    }
  }

  async getDraftCard(): Promise<Partial<Card> | null> {
    try {
      return (await get<Partial<Card>>(KEY_CARD_DRAFT)) || null;
    } catch {
      return null;
    }
  }

  async saveDraftCard(draft: Partial<Card> | null): Promise<void> {
    try {
      if (!draft) {
        await del(KEY_CARD_DRAFT);
      } else {
        await set(KEY_CARD_DRAFT, draft);
      }
    } catch (e) {
      console.warn('Failed to save draft:', e);
    }
  }

  async getPhoto(): Promise<string | null> {
    try {
      return (await get<string>(PHOTO_FILENAME)) || null;
    } catch {
      return null;
    }
  }

  async savePhoto(photoDataUrl: string): Promise<void> {
    await set(PHOTO_FILENAME, photoDataUrl);
  }

  async deletePhoto(): Promise<void> {
    await del(PHOTO_FILENAME);
  }

  async getStyle(): Promise<QRStyle | null> {
    try {
      return (await get<QRStyle>(KEY_STYLE)) || null;
    } catch {
      return null;
    }
  }

  async saveStyle(style: QRStyle): Promise<void> {
    await set(KEY_STYLE, style);
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const raw = await get<unknown>(KEY_SETTINGS);
      const parsed = AppSettingsSchema.safeParse(raw);
      if (parsed.success) return parsed.data;
    } catch (e) {
      console.warn('Settings parse failed, returning defaults:', e);
    }
    return AppSettingsSchema.parse({});
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await set(KEY_SETTINGS, settings);
  }

  async clearAll(): Promise<void> {
    await clear();
  }

  async getStatus(): Promise<StorageStatus> {
    let persisted = false;
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persisted) {
      persisted = await navigator.storage.persisted();
      if (!persisted && navigator.storage.persist) {
        persisted = await navigator.storage.persist();
      }
    }
    return { persisted, backend: 'indexeddb' };
  }
}

// 2. Native Storage via Capacitor Preferences & Filesystem
class NativeStorageAdapter implements StorageAdapter {
  async getCard(): Promise<Card | null> {
    try {
      const { value } = await Preferences.get({ key: KEY_CARD });
      if (!value) return null;
      const parsed = CardSchema.safeParse(JSON.parse(value));
      if (parsed.success) return parsed.data;

      // Fallback to backup
      const bak = await Preferences.get({ key: KEY_CARD_BAK });
      if (bak.value) {
        const bakParsed = CardSchema.safeParse(JSON.parse(bak.value));
        if (bakParsed.success) return bakParsed.data;
      }
      return null;
    } catch (e) {
      console.error('Native read card error:', e);
      return null;
    }
  }

  async saveCard(card: Card): Promise<void> {
    try {
      const existing = await Preferences.get({ key: KEY_CARD });
      if (existing.value) {
        await Preferences.set({ key: KEY_CARD_BAK, value: existing.value });
      }
      await Preferences.set({ key: KEY_CARD, value: JSON.stringify(card) });
    } catch (e) {
      console.error('Native save card error:', e);
      throw e;
    }
  }

  async getDraftCard(): Promise<Partial<Card> | null> {
    try {
      const { value } = await Preferences.get({ key: KEY_CARD_DRAFT });
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async saveDraftCard(draft: Partial<Card> | null): Promise<void> {
    if (!draft) {
      await Preferences.remove({ key: KEY_CARD_DRAFT });
    } else {
      await Preferences.set({ key: KEY_CARD_DRAFT, value: JSON.stringify(draft) });
    }
  }

  async getPhoto(): Promise<string | null> {
    try {
      const res = await Filesystem.readFile({
        path: PHOTO_FILENAME,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return typeof res.data === 'string' ? res.data : null;
    } catch {
      return null;
    }
  }

  async savePhoto(photoDataUrl: string): Promise<void> {
    await Filesystem.writeFile({
      path: PHOTO_FILENAME,
      data: photoDataUrl,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  }

  async deletePhoto(): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: PHOTO_FILENAME,
        directory: Directory.Data,
      });
    } catch {
      // Ignore if not found
    }
  }

  async getStyle(): Promise<QRStyle | null> {
    try {
      const { value } = await Preferences.get({ key: KEY_STYLE });
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async saveStyle(style: QRStyle): Promise<void> {
    await Preferences.set({ key: KEY_STYLE, value: JSON.stringify(style) });
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const { value } = await Preferences.get({ key: KEY_SETTINGS });
      if (value) {
        const parsed = AppSettingsSchema.safeParse(JSON.parse(value));
        if (parsed.success) return parsed.data;
      }
    } catch (e) {
      console.warn('Native settings parse error:', e);
    }
    return AppSettingsSchema.parse({});
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await Preferences.set({ key: KEY_SETTINGS, value: JSON.stringify(settings) });
  }

  async clearAll(): Promise<void> {
    await Preferences.clear();
    await this.deletePhoto();
  }

  async getStatus(): Promise<StorageStatus> {
    return { persisted: true, backend: 'native' };
  }
}

// Export singleton instance based on active runtime platform
export const storage: StorageAdapter = Capacitor.isNativePlatform()
  ? new NativeStorageAdapter()
  : new WebStorageAdapter();
