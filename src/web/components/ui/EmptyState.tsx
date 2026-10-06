import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-4">
      {icon && (
        <div className="p-4 rounded-2xl bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)] border border-[var(--color-border-hairline)]">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[var(--color-text-primary)] font-serif">
          {title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
