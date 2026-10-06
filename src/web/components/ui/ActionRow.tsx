import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface ActionRowProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

export const ActionRow: React.FC<ActionRowProps> = ({
  icon,
  title,
  subtitle,
  rightElement,
  onClick,
  danger = false,
}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 text-left select-none touch-target ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        danger
          ? 'bg-[var(--color-status-error)]/10 border border-[var(--color-status-error)]/30 text-[var(--color-status-error)]'
          : 'liquid-glass-button text-[var(--color-text-primary)]'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {icon && (
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              danger
                ? 'bg-[var(--color-status-error)]/15 text-[var(--color-status-error)]'
                : 'bg-black/5 dark:bg-white/10 text-[var(--color-accent)]'
            }`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">{title}</p>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {rightElement}
        {onClick && !rightElement && (
          <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        )}
      </div>
    </Component>
  );
};
