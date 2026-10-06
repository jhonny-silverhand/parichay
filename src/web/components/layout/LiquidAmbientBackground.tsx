import React from 'react';

/**
 * LiquidAmbientBackground — Minimalist Calm Atmosphere
 * 
 * Provides a quiet, serene, low-contrast ambient background:
 * - Subtle organic gradient mesh with natural warmth.
 * - Soft tactile grain overlay for craftsman depth.
 * - Minimalist, unobtrusive, perfectly legible under all cards.
 */
export const LiquidAmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* 1. Subtle Radial Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-accent)]/5 via-transparent to-transparent opacity-50" />

      {/* 2. Soft Organic Light Pools */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 transition-opacity duration-700">
        <div
          className="absolute -top-[15%] -right-[15%] w-[450px] h-[450px] rounded-full filter blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(184, 82, 38, 0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[45%] -left-[15%] w-[400px] h-[400px] rounded-full filter blur-[90px]"
          style={{
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* 3. Micro-Tactile Surface Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
