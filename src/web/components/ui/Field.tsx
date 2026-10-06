import React from 'react';

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  hint,
  rightElement,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `field_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
        {rightElement && <div>{rightElement}</div>}
      </div>

      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all ${
          error ? 'border-[var(--color-status-error)] ring-1 ring-[var(--color-status-error)]' : ''
        } ${className}`}
        {...props}
      />

      {error ? (
        <span className="text-xs text-[var(--color-status-error)]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
      ) : null}
    </div>
  );
};
