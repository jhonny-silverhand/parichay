import React from 'react';
import { Check } from 'lucide-react';

export interface SwatchProps {
  color: string;
  isSelected?: boolean;
  onClick: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Swatch: React.FC<SwatchProps> = ({
  color,
  isSelected = false,
  onClick,
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <button
      type="button"
      onClick={() => onClick(color)}
      aria-label={`Select color ${color}`}
      style={{ backgroundColor: color }}
      className={`${sizeMap} rounded-full border border-black/10 shrink-0 relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {isSelected && (
        <Check
          className="w-4 h-4 stroke-[3]"
          style={{
            color: color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#f6f3ee' ? '#111317' : '#FFFFFF',
          }}
        />
      )}
    </button>
  );
};
