import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Share } from 'lucide-react';
import { Button } from '../ui/Button';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone or not available, hide
  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={install}
        icon={<Download className="w-4 h-4 text-[var(--color-accent)]" />}
      >
        Install App
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Share className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-[var(--color-bg-surface)] p-6 shadow-xl border border-[var(--color-border-hairline)] space-y-4">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] font-serif">
                Install Parichay on iPhone / iPad
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                1. Tap the <strong>Share</strong> icon in the Safari navigation bar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> in the top-right corner.
              </p>
              <Button fullWidth variant="secondary" onClick={() => setShowIOSGuide(false)}>
                Got it
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
