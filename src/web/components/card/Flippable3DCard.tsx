import React, { useState, useRef, useCallback } from 'react';
import { haptics } from '@/platform';
import { archipelagoAudio } from '@/web/lib/archipelagoAudio';

interface Flippable3DCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onFlipToggle?: (flipped: boolean) => void;
  className?: string;
  enableOverdrive?: boolean;
}

/**
 * Flippable3DCard — The Archipelago Identity Monolith
 * 
 * An avant-garde physical talisman component:
 * - Magnetic 3D tilt tracking with spring decay.
 * - Dynamic caustics & prismatic RGB chromatic aberration flare.
 * - Specular rim highlights with laser-etched crosshairs.
 * - 180° spatial axis flip with 3D depth layering.
 * - Synthesizer audio feedback.
 */
export const Flippable3DCard: React.FC<Flippable3DCardProps> = ({
  front,
  back,
  isFlipped,
  onFlipToggle,
  className = '',
  enableOverdrive = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Up to 15 degrees of dramatic 3D perspective tilt
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.55 });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.5 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handleCardClick = () => {
    haptics.impact('medium');
    archipelagoAudio.playFlip();
    if (onFlipToggle) {
      onFlipToggle(!isFlipped);
    }
  };

  return (
    <div
      className={`relative w-full select-none cursor-pointer [perspective:1400px] ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Flip talisman to front face' : 'Flip talisman to photonic QR core'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Outer Archipelago Orbit Crosshairs */}
      <div className="absolute -top-3 -left-3 font-mono text-[9px] text-[var(--color-accent)] opacity-60 pointer-events-none select-none">
        ⌜ 01
      </div>
      <div className="absolute -top-3 -right-3 font-mono text-[9px] text-[var(--color-accent)] opacity-60 pointer-events-none select-none">
        ⌝
      </div>
      <div className="absolute -bottom-3 -left-3 font-mono text-[9px] text-[var(--color-accent)] opacity-60 pointer-events-none select-none">
        ⌞
      </div>
      <div className="absolute -bottom-3 -right-3 font-mono text-[9px] text-[var(--color-accent)] opacity-60 pointer-events-none select-none">
        ⌟
      </div>

      {/* Holographic Overdrive Beam effect */}
      {enableOverdrive && (
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-[42px] pointer-events-none opacity-60 bg-gradient-to-r from-cyan-500/20 via-[var(--color-accent)]/30 to-purple-500/20 blur-xl animate-pulse -z-10"
        />
      )}

      {/* 3D Rotating Monolith Shell */}
      <div
        ref={cardRef}
        className="w-full relative transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
        }}
      >
        {/* Dynamic Holographic Specular Glare & Prismatic Sheen */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 pointer-events-none rounded-[36px] transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.6) 0%, rgba(245, 158, 11, 0.25) 25%, rgba(56, 189, 248, 0.2) 50%, rgba(168, 85, 247, 0.15) 70%, transparent 85%)`,
          }}
        />

        {/* FRONT FACE (The Sovereign Identity Glyph) */}
        <div className="w-full [backface-visibility:hidden] [transform:rotateY(0deg)]">
          {front}
        </div>

        {/* BACK FACE (The Photonic QR Singularity) */}
        <div className="w-full absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
};

