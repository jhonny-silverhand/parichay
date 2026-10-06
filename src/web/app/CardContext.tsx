import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Card, AppSettings } from '@/shared/card';
import type { QRStyle } from '@/web/lib/qr-style-types';
import { PLAIN_DEFAULT_STYLE } from '@/web/lib/qr-style-types';
import { storage } from '@/web/lib/storage';
import { buildCompactVCard, computeQRFingerprint } from '@/shared/vcard';
import { AppSettingsSchema } from '@/shared/card';

interface CardContextValue {
  card: Card | null;
  style: QRStyle;
  photoDataUrl: string | null;
  settings: AppSettings;
  isLoading: boolean;
  isInitialized: boolean;
  qrHasChanged: boolean;
  acknowledgeQRChange: () => void;
  saveCard: (newCard: Card) => Promise<void>;
  saveStyle: (newStyle: QRStyle) => Promise<void>;
  savePhoto: (photoUrl: string | null) => Promise<void>;
  saveSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  eraseAllData: () => Promise<void>;
  reloadFromStorage: () => Promise<void>;
}

const CardContext = createContext<CardContextValue | null>(null);

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
};

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [style, setStyle] = useState<QRStyle>(PLAIN_DEFAULT_STYLE);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(AppSettingsSchema.parse({}));
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [qrHasChanged, setQrHasChanged] = useState(false);

  const reloadFromStorage = useCallback(async () => {
    setIsLoading(true);
    try {
      const [savedCard, savedStyle, savedPhoto, savedSettings] = await Promise.all([
        storage.getCard(),
        storage.getStyle(),
        storage.getPhoto(),
        storage.getSettings(),
      ]);

      if (savedCard) {
        setCard(savedCard);
        // Check if payload fingerprint differs from stored
        const currentPayload = buildCompactVCard(savedCard);
        const currentFingerprint = computeQRFingerprint(currentPayload);
        if (savedCard.qrFingerprint && savedCard.qrFingerprint !== currentFingerprint) {
          setQrHasChanged(true);
        }
      }

      if (savedStyle) {
        setStyle(savedStyle);
      }

      if (savedPhoto) {
        setPhotoDataUrl(savedPhoto);
      }

      if (savedSettings) {
        setSettings(savedSettings);
        // Apply theme attribute to root
        applyTheme(savedSettings.theme);
      }
    } catch (e) {
      console.error('Failed to load data from storage:', e);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    reloadFromStorage();
  }, [reloadFromStorage]);

  const applyTheme = (theme: AppSettings['theme']) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  };

  const acknowledgeQRChange = () => {
    if (card) {
      const currentPayload = buildCompactVCard(card);
      const newFingerprint = computeQRFingerprint(currentPayload);
      const updated = { ...card, qrFingerprint: newFingerprint };
      setCard(updated);
      storage.saveCard(updated);
    }
    setQrHasChanged(false);
  };

  const handleSaveCard = async (newCard: Card) => {
    const currentPayload = buildCompactVCard(newCard);
    const newFingerprint = computeQRFingerprint(currentPayload);

    // If there was an existing fingerprint and it changed, trigger banner
    if (card?.qrFingerprint && card.qrFingerprint !== newFingerprint) {
      setQrHasChanged(true);
    }

    const cardToSave: Card = {
      ...newCard,
      qrFingerprint: newFingerprint,
      updatedAt: new Date().toISOString(),
    };

    setCard(cardToSave);
    await storage.saveCard(cardToSave);
    // Clear draft if any
    await storage.saveDraftCard(null);
  };

  const handleSaveStyle = async (newStyle: QRStyle) => {
    setStyle(newStyle);
    await storage.saveStyle(newStyle);
  };

  const handleSavePhoto = async (newPhoto: string | null) => {
    setPhotoDataUrl(newPhoto);
    if (newPhoto) {
      await storage.savePhoto(newPhoto);
    } else {
      await storage.deletePhoto();
    }
  };

  const handleSaveSettings = async (partial: Partial<AppSettings>) => {
    const merged = { ...settings, ...partial };
    setSettings(merged);
    if (partial.theme) {
      applyTheme(partial.theme);
    }
    await storage.saveSettings(merged);
  };

  const handleEraseAll = async () => {
    await storage.clearAll();
    setCard(null);
    setStyle(PLAIN_DEFAULT_STYLE);
    setPhotoDataUrl(null);
    setQrHasChanged(false);
    setSettings(AppSettingsSchema.parse({}));
    applyTheme('system');
  };

  return (
    <CardContext.Provider
      value={{
        card,
        style,
        photoDataUrl,
        settings,
        isLoading,
        isInitialized,
        qrHasChanged,
        acknowledgeQRChange,
        saveCard: handleSaveCard,
        saveStyle: handleSaveStyle,
        savePhoto: handleSavePhoto,
        saveSettings: handleSaveSettings,
        eraseAllData: handleEraseAll,
        reloadFromStorage,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
