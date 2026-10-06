import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantMap = {
  primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
  secondary: 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] border border-[var(--color-border-hairline)] hover:bg-[var(--color-bg-surface-sunken)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-sunken)]',
  danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20',
};

const sizeMap = {
  sm: 'w-8 h-8 rounded-lg text-sm',
  md: 'w-10 h-10 rounded-xl text-base',
  lg: 'w-12 h-12 rounded-2xl text-lg',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={`touch-target inline-flex items-center justify-center transition-all press-scale select-none ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
