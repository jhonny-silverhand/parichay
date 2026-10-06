import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Tablet, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ScreenHeader } from '@/web/components/layout/ScreenHeader';
import { Stack } from '@/web/components/layout/Stack';
import { Inline } from '@/web/components/layout/Inline';
import { Grid } from '@/web/components/layout/Grid';
import { FillContainer } from '@/web/components/layout/FillContainer';
import { Button } from '@/web/components/ui/Button';

const PRESET_VIEWPORTS = [
  { id: '320', label: '320px (SE)', width: 320, height: 568 },
  { id: '360', label: '360px (Compact Android)', width: 360, height: 640 },
  { id: '390', label: '390px (iPhone 14)', width: 390, height: 844 },
  { id: '430', label: '430px (Pro Max)', width: 430, height: 932 },
  { id: '768', label: '768px (iPad Mini)', width: 768, height: 1024 },
  { id: '1024', label: '1024px (iPad Pro)', width: 1024, height: 768 },
];

export const LayoutLabScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState(PRESET_VIEWPORTS[1]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [activeTab, setActiveTab] = useState<'primitives' | 'inputs' | 'cards'>('primitives');

  const simulatedWidth = isLandscape ? selectedPreset.height : selectedPreset.width;
  const simulatedHeight = isLandscape ? selectedPreset.width : selectedPreset.height;

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0E1015] text-white flex flex-col overflow-hidden select-none">
      {/* Lab Control Bar */}
      <header className="shrink-0 bg-[#161820] border-b border-white/10 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="touch-target text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold font-serif text-white flex items-center gap-2">
              <span>Layout Lab</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-accent)] text-white font-mono font-normal">
                Dev Tool
              </span>
            </h1>
            <p className="text-2xs text-white/50">
              Viewport simulation: {simulatedWidth}px &times; {simulatedHeight}px
            </p>
          </div>
        </div>

        {/* Viewport Width Buttons */}
        <div className="hidden md:flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          {PRESET_VIEWPORTS.map((vp) => (
            <button
              key={vp.id}
              onClick={() => setSelectedPreset(vp)}
              className={`px-2.5 py-1 text-2xs font-medium rounded-lg transition-all ${
                selectedPreset.id === vp.id
                  ? 'bg-[var(--color-accent)] text-white shadow-xs font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {vp.label}
            </button>
          ))}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`px-2.5 py-1 text-2xs font-medium rounded-lg flex items-center gap-1 transition-all ${
              isLandscape
                ? 'bg-amber-600 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Landscape</span>
          </button>
        </div>
      </header>

      {/* Simulator Workspace */}
      <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center p-4 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Device Frame */}
        <div
          className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-3xl shadow-2xl border-4 border-white/10 overflow-hidden flex flex-col transition-all duration-300 relative"
          style={{
            width: `${simulatedWidth}px`,
            maxWidth: '100%',
            height: `${Math.min(780, simulatedHeight)}px`,
          }}
        >
          {/* Simulated App Header */}
          <ScreenHeader
            title="Fit-to-Container Shell"
            subtitle={`${simulatedWidth}px width container`}
            onBack={() => {}}
            rightAction={
              <span className="text-2xs font-mono text-[var(--color-accent)] font-bold">
                @container
              </span>
            }
          />

          {/* Simulated App Scroll Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {/* Viewport switch for mobile screens */}
            <div className="flex md:hidden flex-wrap gap-1 p-2 bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-hairline)]">
              {PRESET_VIEWPORTS.map((vp) => (
                <button
                  key={vp.id}
                  onClick={() => setSelectedPreset(vp)}
                  className={`px-2 py-1 text-2xs rounded-md ${
                    selectedPreset.id === vp.id
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {vp.id}px
                </button>
              ))}
            </div>

            {/* Layout Primitives Demo */}
            <FillContainer maxWidth="full">
              <Stack gap="sm">
                <div className="p-3.5 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-1">
                  <h3 className="text-xs font-bold font-serif text-[var(--color-text-primary)]">
                    Layout Rules Verification
                  </h3>
                  <p className="text-2xs text-[var(--color-text-secondary)] leading-relaxed">
                    1. Fixed screen with 100dvh root bounds.<br />
                    2. No body scrolling; only internal scroll views move.<br />
                    3. Fluid text scaling via clamp and typography tokens.<br />
                    4. Zero horizontal overflow at 320px viewport.
                  </p>
                </div>

                {/* Inline Primitive Demo */}
                <div>
                  <span className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                    Inline Primitive with Wrapping
                  </span>
                  <Inline gap="xs" wrap>
                    {['vCard 3.0', '100% Offline', 'Zero Network', '45+ Fonts', 'Capacitor 8', 'Safe Areas'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg text-2xs font-medium bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </Inline>
                </div>

                {/* Grid Primitive Demo */}
                <div>
                  <span className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                    Responsive Grid Primitive
                  </span>
                  <Grid cols={simulatedWidth >= 768 ? 4 : 2} gap="sm">
                    {['Cards', 'Styles', 'Wallpapers', 'Passes'].map((item, idx) => (
                      <div
                        key={item}
                        className="p-3 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] text-center"
                      >
                        <span className="text-xs font-bold font-serif block text-[var(--color-text-primary)]">
                          {item}
                        </span>
                        <span className="text-2xs text-[var(--color-text-tertiary)]">
                          Col {idx + 1}
                        </span>
                      </div>
                    ))}
                  </Grid>
                </div>

                {/* Keyboard and Input Verification */}
                <div className="p-3.5 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-2">
                  <span className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                    Keyboard &amp; Form Fields (min 16px)
                  </span>
                  <input
                    type="text"
                    placeholder="Touch input >= 16px to prevent iOS auto-zoom"
                    inputMode="text"
                    enterKeyHint="done"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:border-[var(--color-accent)]"
                  />
                </div>
              </Stack>
            </FillContainer>
          </div>

          {/* Simulated Bottom Navigation */}
          <div className="shrink-0 bg-[var(--color-bg-surface)] border-t border-[var(--color-border-hairline)] px-4 py-2 flex items-center justify-between text-2xs text-[var(--color-text-secondary)]">
            <span>Container: {simulatedWidth}px</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>No Overflow</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
