import React, { useState, useRef, useCallback } from 'react';
import { haptics } from '@/platform';

interface Flippable3DCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onFlipToggle?: (flipped: boolean) => void;
  className?: string;
}

/**
 * Flippable3DCard — Minimalist Tactile Business Card
 * 
 * Provides an organic, tactile physical card interaction:
 * - Subtle 3D perspective tilt reacting to cursor / touch movement.
 * - Smooth 180° flip animation with spring physics.
 * - Refined, clean, minimalist design with zero visual clutter.
 */
export const Flippable3DCard: React.FC<Flippable3DCardProps> = ({
  front,
  back,
  isFlipped,
  onFlipToggle,
  className = '',
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

    // Subtle 8-degree physical tilt
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.25 });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.2 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handleCardClick = () => {
    haptics.impact('light');
    if (onFlipToggle) {
      onFlipToggle(!isFlipped);
    }
  };

  return (
    <div
      className={`relative w-full select-none cursor-pointer [perspective:1200px] ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Flip card to front' : 'Flip card to QR code'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 3D Card Shell */}
      <div
        ref={cardRef}
        className="w-full relative transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
        }}
      >
        {/* Subtle Specular Sheen */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 pointer-events-none rounded-[32px] transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`,
          }}
        />

        {/* FRONT FACE */}
        <div className="w-full [backface-visibility:hidden] [transform:rotateY(0deg)]">
          {front}
        </div>

        {/* BACK FACE */}
        <div className="w-full absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
};
