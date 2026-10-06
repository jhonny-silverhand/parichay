import React from 'react';

/**
 * LiquidAmbientBackground — The Archipelago Spatial Atmosphere
 * 
 * Transforms the viewport into the "Parichay Archipelago" (परिचय द्वीपसमूह):
 * - Bathymetric / Topographic contour elevation isolines drifting in deep ocean space.
 * - Volcanic terracotta magma ember vents and abyssal bioluminescent cyan currents.
 * - Micro-topographic coordinates HUD (air-gapped sovereignty coordinates).
 * - Tactile optical grain and fluid light refractions.
 */
export const LiquidAmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* 1. Deep Oceanic Basalt Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-60" />

      {/* 2. Topographic Archipelago Elevation Isolines (SVG Vector Topography) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.14] dark:opacity-[0.22] stroke-current text-[var(--color-accent)] animate-ambient-drift-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        strokeWidth="1.2"
        strokeDasharray="4 8"
      >
        {/* Archipelago Island 01 - Northern Atoll Contours */}
        <path d="M 120 180 C 220 110, 380 140, 480 260 C 560 360, 440 520, 310 540 C 180 560, 80 420, 70 300 Z" />
        <path d="M 160 210 C 240 160, 360 180, 430 280 C 490 350, 400 470, 290 490 C 180 500, 110 390, 110 290 Z" strokeWidth="0.8" strokeDasharray="none" />
        <path d="M 210 250 C 270 210, 340 230, 380 300 C 420 350, 360 430, 280 440 C 200 450, 150 380, 160 300 Z" strokeWidth="1.5" />
        <circle cx="280" cy="340" r="18" strokeWidth="1.8" />
        <circle cx="280" cy="340" r="4" fill="currentColor" />

        {/* Archipelago Island 02 - Southern Deep Trench & Ridge */}
        <path d="M 520 620 C 660 510, 840 560, 920 680 C 990 790, 890 920, 740 940 C 600 960, 480 840, 460 740 Z" />
        <path d="M 560 660 C 670 570, 810 610, 870 700 C 920 780, 840 880, 720 900 C 610 910, 520 810, 510 740 Z" strokeWidth="0.8" strokeDasharray="none" />
        <path d="M 620 710 C 700 640, 790 670, 820 740 C 850 800, 780 860, 700 870 C 620 880, 570 810, 580 750 Z" strokeWidth="1.5" />
        <circle cx="700" cy="780" r="14" strokeWidth="1.8" />
        <circle cx="700" cy="780" r="3" fill="currentColor" />

        {/* Bathymetric Grid Crosshairs */}
        <g strokeWidth="0.8" opacity="0.6">
          <line x1="280" y1="40" x2="280" y2="960" strokeDasharray="2 12" />
          <line x1="700" y1="40" x2="700" y2="960" strokeDasharray="2 12" />
          <line x1="40" y1="340" x2="960" y2="340" strokeDasharray="2 12" />
          <line x1="40" y1="780" x2="960" y2="780" strokeDasharray="2 12" />
        </g>
      </svg>

      {/* 3. Floating Spatial Archipelago Coordinate Watermarks */}
      <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.25em] text-[var(--color-text-tertiary)] opacity-40 select-none uppercase pointer-events-none">
        <div>SYS // ARCHIPELAGO_V4</div>
        <div className="text-[var(--color-accent)] font-semibold">LOC // 18°58′N · 72°50′E</div>
      </div>

      <div className="absolute bottom-20 right-6 font-mono text-[9px] tracking-[0.25em] text-[var(--color-text-tertiary)] opacity-40 select-none uppercase pointer-events-none text-right">
        <div>ELEV // +142M_MSL</div>
        <div className="text-emerald-500 font-semibold">AIRGAP // PURE_OFFLINE</div>
      </div>

      {/* 4. Bioluminescent Magma Fluid Orbs (Fluid Optical Caustics) */}
      <div className="absolute inset-0 opacity-75 dark:opacity-65 transition-opacity duration-700">
        {/* Volcanic Terracotta Magma Core (Upper Island Glow) */}
        <div
          className="absolute -top-[12%] -right-[12%] w-[460px] h-[460px] sm:w-[600px] sm:h-[600px] rounded-full mix-blend-screen dark:mix-blend-lighten filter blur-[95px] animate-ambient-drift-1"
          style={{
            background: 'radial-gradient(circle at 45% 45%, rgba(255, 107, 53, 0.42) 0%, rgba(226, 115, 68, 0.22) 45%, transparent 75%)',
          }}
        />

        {/* Bioluminescent Abyssal Cyan Vent (Southwest Oceanic Current) */}
        <div
          className="absolute top-[40%] -left-[18%] w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full mix-blend-screen dark:mix-blend-lighten filter blur-[90px] animate-ambient-drift-2"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(6, 214, 160, 0.3) 0%, rgba(0, 245, 212, 0.15) 50%, transparent 75%)',
          }}
        />

        {/* Deep Celestial Obsidian Purple Trench (Lower Substratum) */}
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] rounded-full mix-blend-screen dark:mix-blend-lighten filter blur-[105px] animate-ambient-drift-3"
          style={{
            background: 'radial-gradient(circle at 55% 55%, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* 5. Micro-Tactile Specular Surface Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
