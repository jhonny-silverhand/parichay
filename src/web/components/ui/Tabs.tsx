import React from 'react';

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string> {
  options: TabOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  fullWidth?: boolean;
}

export function Tabs<T extends string>({
  options,
  activeId,
  onChange,
  fullWidth = false,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 rounded-xl bg-[var(--color-bg-surface-sunken)] border border-[var(--color-border-hairline)] ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all select-none touch-target ${
              isActive
                ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
