import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-lg mx-auto liquid-glass-card rounded-t-[36px] shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.45)] max-h-[90dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-3 pb-2 cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/30 shadow-xs" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-1 pb-4 border-b border-black/5 dark:border-white/10">
          <div>
            {title && (
              <h2 className="text-lg font-bold font-serif text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            data-sheet-close="true"
            className="p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full hover:bg-[var(--color-bg-surface-sunken)] transition-colors touch-target"
            aria-label="Close sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 safe-bottom space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
