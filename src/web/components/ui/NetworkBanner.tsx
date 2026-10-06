import React, { useState, useEffect } from 'react';
import { WifiOff, Check } from 'lucide-react';
import { network } from '@/platform';

export const NetworkBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    network.getStatus().then((status) => {
      setIsOffline(!status.connected);
    });

    const unsubscribe = network.onStatusChange((status) => {
      if (!status.connected) {
        setIsOffline(true);
        setShowRestored(false);
      } else {
        setIsOffline(false);
        setShowRestored(true);
        const timer = setTimeout(() => setShowRestored(false), 2500);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline && !showRestored) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="shrink-0 w-full z-30 transition-all select-none"
    >
      {isOffline && (
        <div className="bg-[var(--color-bg-surface-elevated)] border-b border-[var(--color-border-hairline)] px-4 py-1.5 flex items-center justify-center gap-2 text-2xs font-medium text-[var(--color-text-secondary)]">
          <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Offline mode · Zero cloud dependency, your cards work 100% locally</span>
        </div>
      )}
      {showRestored && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-center gap-2 text-2xs font-medium text-emerald-800 dark:text-emerald-300">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Connection restored</span>
        </div>
      )}
    </div>
  );
};
