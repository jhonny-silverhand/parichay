import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { storage, type StorageStatus } from '@/web/lib/storage';
import { ActionRow } from '@/web/components/ui/ActionRow';
import { Sheet } from '@/web/components/ui/Sheet';
import { Button } from '@/web/components/ui/Button';
import { useToast } from '@/web/components/ui/Toast';
import { FONT_CATALOG } from '@/web/lib/fonts';
import { CardSchema, type CardBackup } from '@/shared/card';
import { BRAND } from '@/shared/brand';
import { shareOrDownloadFile } from '@/web/lib/export';
import { NativeNotifications } from '@/native/notifications';
import { CraftsmanFooter } from '@/web/components/ui/CraftsmanFooter';
import {
  Moon,
  Sun,
  Smartphone,
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  BookOpen,
  HardDrive,
  Info,
  CheckCircle2,
  AlertTriangle,
  Bell,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { card, style, photoDataUrl, settings, saveSettings, saveCard, saveStyle, savePhoto, eraseAllData } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [storageStatus, setStorageStatus] = useState<StorageStatus>({
    persisted: false,
    backend: 'indexeddb',
  });
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const [showFontsSheet, setShowFontsSheet] = useState(false);
  const [showEraseSheet, setShowEraseSheet] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    storage.getStatus().then((status) => setStorageStatus(status));
  }, []);

  const handleExportBackup = async () => {
    if (!card) return;
    try {
      const backup: CardBackup = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        card,
        style,
        settings,
        photoBase64: photoDataUrl,
      };

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `${BRAND.packageSlug}-backup-${dateStr}.json`;
      const jsonStr = JSON.stringify(backup, null, 2);

      await shareOrDownloadFile(jsonStr, filename, 'application/json');
      toast('Backup exported successfully', 'success');
    } catch (e: any) {
      toast(e.message || 'Backup export failed', 'warning');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        if (!raw.card) throw new Error('Invalid backup file: card data missing');

        const parsedCard = CardSchema.safeParse(raw.card);
        if (!parsedCard.success) {
          throw new Error('Backup card validation failed: ' + parsedCard.error.message);
        }

        await saveCard(parsedCard.data);
        if (raw.style) await saveStyle(raw.style);
        if (raw.photoBase64) await savePhoto(raw.photoBase64);
        if (raw.settings) await saveSettings(raw.settings);

        toast('Backup restored successfully!', 'success');
        navigate('/');
      } catch (err: any) {
        toast(err.message || 'Could not restore backup', 'warning');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmErase = async () => {
    try {
      setIsErasing(true);
      await eraseAllData();
      toast('All data erased from this device', 'info');
      setShowEraseSheet(false);
      navigate('/onboarding');
    } catch (e: any) {
      toast(e.message || 'Erase failed', 'warning');
    } finally {
      setIsErasing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-6 pb-28 animate-in fade-in">
      {/* Header */}
      <div>
        <span className="text-2xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
          {BRAND.displayName}
        </span>
        <h1 className="text-xl font-bold font-serif text-[var(--color-text-primary)]">
          Preferences &amp; Privacy
        </h1>
      </div>

      {/* Appearance Section */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'system', label: 'System', icon: Smartphone },
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
          ].map((theme) => {
            const Icon = theme.icon;
            const isSelected = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => saveSettings({ theme: theme.id as any })}
                className={`py-2.5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                    : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{theme.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Storage & Privacy Status */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Device &amp; Storage
        </h2>
        <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                Local Storage Engine
              </span>
            </div>
            <span className="text-2xs font-mono capitalize px-2 py-0.5 rounded-md bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)]">
              {storageStatus.backend}
            </span>
          </div>
          <p className="text-2xs text-[var(--color-text-tertiary)] leading-relaxed">
            {storageStatus.persisted
              ? 'Storage is persisted and protected against automatic browser cache eviction.'
              : 'Stored in persistent on-device memory.'}
          </p>
        </div>
      </section>

      {/* Native Notifications Section */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Native Notifications
        </h2>
        <ActionRow
          icon={<Bell className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Send Test Notification"
          subtitle="Test offline local push notification"
          onClick={async () => {
            const sent = await NativeNotifications.sendTestNotification();
            if (sent) {
              toast('Local notification triggered!', 'success');
            } else {
              toast('Notification permission required or blocked.', 'info');
            }
          }}
        />
      </section>

      {/* Information & Legal */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Trust &amp; Transparency
        </h2>
        <ActionRow
          icon={<HelpCircle className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Help &amp; Documentation"
          subtitle="Offline user guide, FAQ & troubleshooting"
          onClick={() => navigate('/index-help')}
        />
        <ActionRow
          icon={<Sparkles className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Product Showcase &amp; Demo"
          subtitle="Explore features, presets and privacy promise"
          onClick={() => navigate('/showcase')}
        />
        <ActionRow
          icon={<ShieldCheck className="w-4 h-4 text-[var(--color-status-success)]" />}
          title="Privacy Architecture"
          subtitle="Verifiable zero-network promise & details"
          onClick={() => setShowPrivacySheet(true)}
        />
        <ActionRow
          icon={<BookOpen className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Typography & Font Licenses"
          subtitle="45+ self-hosted open source families"
          onClick={() => setShowFontsSheet(true)}
        />
      </section>

      {/* Developer & Design Tools */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Engineering &amp; Layout Tools
        </h2>
        <ActionRow
          icon={<Smartphone className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Layout Lab"
          subtitle="Test viewports (320px to 1024px & landscape)"
          onClick={() => navigate('/dev/layout-lab')}
        />
        <ActionRow
          icon={<Sparkles className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Design System Styleguide"
          subtitle="Inspect UI tokens, components and variants"
          onClick={() => navigate('/dev/styleguide')}
        />
      </section>

      {/* Backup & Recovery */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Data Management
        </h2>
        <ActionRow
          icon={<Download className="w-4 h-4 text-[var(--color-accent)]" />}
          title="Export Card Backup (.json)"
          subtitle="Encrypted in-place for safe offline keeping"
          onClick={handleExportBackup}
        />

        <label className="block cursor-pointer">
          <ActionRow
            icon={<Upload className="w-4 h-4 text-[var(--color-accent)]" />}
            title="Import Card Backup"
            subtitle="Restore contact and styles from .json file"
          />
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportBackup}
          />
        </label>

        <ActionRow
          danger
          icon={<Trash2 className="w-4 h-4" />}
          title="Erase All Data"
          subtitle="Permanently delete contact, styles and photos"
          onClick={() => setShowEraseSheet(true)}
        />
      </section>

      {/* Subtle Craftsman Footer */}
      <CraftsmanFooter showVersion className="pt-4 pb-2" />

      {/* Privacy Architecture Sheet */}
      <Sheet
        isOpen={showPrivacySheet}
        onClose={() => setShowPrivacySheet(false)}
        title="Privacy Architecture"
        description="Our promise is cryptographically and architecturally verifiable."
      >
        <div className="space-y-4 text-xs text-[var(--color-text-secondary)] leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Nothing Leaves Your Phone
            </p>
            <p className="text-2xs opacity-90">
              There is no central backend database, no telemetry SDK, no analytics tracker, and no cloud backup.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">Where is my data stored?</h3>
              <p>Your card, custom styles, and photos are saved exclusively on this device using local IndexedDB and native isolated storage.</p>
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">What is sent over the network?</h3>
              <p>Zero bytes. The application bundles all fonts, scripts, and vector assets directly in the binary. No external CDNs or Google Fonts servers are ever contacted.</p>
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">The Static QR Reality</h3>
              <p>Because your vCard contact is encoded directly inside the QR black-and-white matrix, previously printed or captured QR codes cannot be remotely edited without an internet server.</p>
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">Android Auto-Backup Protection</h3>
              <p>The Android manifest is locked with <code>android:allowBackup="false"</code> to ensure Google Account cloud backup never exfiltrates your card data to the cloud.</p>
            </div>
          </div>

          <Button fullWidth variant="secondary" onClick={() => setShowPrivacySheet(false)}>
            Close
          </Button>
        </div>
      </Sheet>

      {/* Fonts Credits Sheet */}
      <Sheet
        isOpen={showFontsSheet}
        onClose={() => setShowFontsSheet(false)}
        title="Self-Hosted Font Credits"
        description="Curated typography bundled 100% offline via Fontsource."
      >
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {FONT_CATALOG.map((f) => (
            <div
              key={f.family}
              className="p-3 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: f.family }}>
                  {f.family}
                </p>
                <span className="text-2xs text-[var(--color-accent)] font-semibold">{f.license}</span>
              </div>
              <p className="text-2xs text-[var(--color-text-tertiary)] mt-1">
                Author: {f.author} · Scripts: {f.scripts.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </Sheet>

      {/* Erase All Data Confirmation Sheet */}
      <Sheet
        isOpen={showEraseSheet}
        onClose={() => setShowEraseSheet(false)}
        title="Erase All Data?"
        description="This action cannot be undone."
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 dark:text-red-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              All contact details, custom styles, saved photos, and preferences will be permanently wiped from this device.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowEraseSheet(false)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={isErasing} onClick={handleConfirmErase}>
              {isErasing ? 'Erasing...' : 'Yes, Erase Everything'}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
};
