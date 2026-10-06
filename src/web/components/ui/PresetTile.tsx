import React from 'react';
import type { QRStyle } from '@/web/lib/qr-style-types';
import { Check } from 'lucide-react';

export interface PresetTileProps {
  preset: QRStyle;
  isSelected: boolean;
  onSelect: (preset: QRStyle) => void;
}

export const PresetTile: React.FC<PresetTileProps> = ({
  preset,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all text-left shrink-0 w-24 select-none touch-target ${
        isSelected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)] shadow-xs'
          : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface)] hover:border-[var(--color-border-strong)]'
      }`}
    >
      {/* Mini Card Preview */}
      <div
        className="w-full h-16 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xs"
        style={{
          backgroundColor: preset.backdropColor,
          backgroundImage: preset.backdropGradient
            ? `linear-gradient(${preset.backdropGradient.angle}deg, ${preset.backdropGradient.stops[0]}, ${preset.backdropGradient.stops[1]})`
            : undefined,
        }}
      >
        {/* Mini QR Plate */}
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center relative shadow-xs"
          style={{ backgroundColor: preset.plateColor }}
        >
          {/* Mock mini finder eyes */}
          <div
            className="w-2.5 h-2.5 absolute top-1 left-1"
            style={{
              backgroundColor: preset.eyeOuterColor || preset.moduleColor,
              borderRadius: preset.eyeOuterShape === 'circle' ? '50%' : preset.eyeOuterShape === 'rounded' ? '2px' : '0px',
            }}
          />
          <div
            className="w-2.5 h-2.5 absolute top-1 right-1"
            style={{
              backgroundColor: preset.eyeOuterColor || preset.moduleColor,
              borderRadius: preset.eyeOuterShape === 'circle' ? '50%' : preset.eyeOuterShape === 'rounded' ? '2px' : '0px',
            }}
          />
          <div
            className="w-2.5 h-2.5 absolute bottom-1 left-1"
            style={{
              backgroundColor: preset.eyeOuterColor || preset.moduleColor,
              borderRadius: preset.eyeOuterShape === 'circle' ? '50%' : preset.eyeOuterShape === 'rounded' ? '2px' : '0px',
            }}
          />
        </div>

        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        )}
      </div>

      <span className="text-2xs font-medium text-[var(--color-text-primary)] truncate max-w-full text-center">
        {preset.name}
      </span>
    </button>
  );
};
