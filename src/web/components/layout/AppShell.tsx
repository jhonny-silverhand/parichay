import React, { useEffect, useState } from 'react';
import { LiquidAmbientBackground } from './LiquidAmbientBackground';

interface AppShellProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  header,
  children,
  bottomBar,
  className = '',
}) => {
  const [keyboardOffset, setKeyboardOffset] = useState<number>(0);

  useEffect(() => {
    // Web VisualViewport API tracking for virtual keyboard
    if (typeof window !== 'undefined' && window.visualViewport) {
      const handleResize = () => {
        if (!window.visualViewport) return;
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport.height;
        const diff = Math.max(0, windowHeight - viewportHeight);
        setKeyboardOffset(diff);
        document.documentElement.style.setProperty('--keyboard-offset', `${diff}px`);
      };

      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('scroll', handleResize);
      };
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] select-none ${className}`}
      style={{
        paddingBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : undefined,
      }}
    >
      {/* Background Liquid Chromatic Aura Mesh */}
      <LiquidAmbientBackground />

      {header && <div className="shrink-0 z-30 relative">{header}</div>}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col overflow-hidden">
        {children}
      </div>
      {bottomBar && <div className="shrink-0 z-30 relative">{bottomBar}</div>}
    </div>
  );
};
