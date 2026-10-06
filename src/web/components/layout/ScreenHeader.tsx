import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  onBack?: () => void;
  className?: string;
  bordered?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  onBack,
  className = '',
  bordered = true,
}) => {
  return (
    <header
      className={`shrink-0 z-20 bg-[var(--color-bg-primary)] safe-pad-top px-4 pb-3 flex items-center justify-between transition-colors ${
        bordered ? 'border-b border-[var(--color-border-hairline)]' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {onBack && !leftAction && (
          <button
            onClick={onBack}
            className="touch-target -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {leftAction}
        {title && (
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold font-serif text-[var(--color-text-primary)] truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-2xs text-[var(--color-text-tertiary)] truncate leading-tight mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
      {rightAction && <div className="shrink-0 flex items-center gap-2">{rightAction}</div>}
    </header>
  );
};
