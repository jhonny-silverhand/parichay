import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/web/components/ui/Button';
import { IconButton } from '@/web/components/ui/IconButton';
import { Field } from '@/web/components/ui/Field';
import { Switch } from '@/web/components/ui/Switch';
import { Skeleton } from '@/web/components/ui/Skeleton';
import { Slider } from '@/web/components/ui/Slider';
import { Swatch } from '@/web/components/ui/Swatch';
import { PresetTile } from '@/web/components/ui/PresetTile';
import { Avatar } from '@/web/components/ui/Avatar';
import { EmptyState } from '@/web/components/ui/EmptyState';
import { BUILTIN_PRESETS } from '@/web/lib/qr-style-presets';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Heart,
  Share2,
  Trash2,
  CreditCard,
  WifiOff,
} from 'lucide-react';

export const StyleguideScreen: React.FC = () => {
  const navigate = useNavigate();
  const [sliderVal, setSliderVal] = useState(20);
  const [selectedColor, setSelectedColor] = useState('#B85226');
  const [switchState, setSwitchState] = useState(true);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-8 pb-32 animate-in fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border-hairline)] pb-4">
        <button
          onClick={() => navigate('/settings')}
          className="touch-target p-2 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-2xs font-mono uppercase text-[var(--color-accent)] font-bold">
            Design QA
          </span>
          <h1 className="text-xl font-bold font-serif text-[var(--color-text-primary)]">
            Design System Styleguide
          </h1>
        </div>
      </div>

      {/* Typography Scale */}
      <section className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Typography Hierarchy
        </h2>
        <div className="space-y-2">
          <p className="text-3xl font-bold font-serif">Display Serif 3xl (Fraunces)</p>
          <p className="text-2xl font-bold font-serif">Headline Serif 2xl</p>
          <p className="text-xl font-semibold font-serif">Title Serif xl</p>
          <p className="text-base font-medium">Body Base (Instrument Sans)</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Secondary UI Copy sm</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">Caption &amp; Metadata xs</p>
          <p className="text-2xs font-mono tracking-widest uppercase">Monospace Kicker 2xs</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Buttons &amp; IconButtons
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            With Icon
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <IconButton icon={<Share2 className="w-4 h-4" />} label="Share" variant="primary" />
          <IconButton icon={<Heart className="w-4 h-4" />} label="Favorite" variant="secondary" />
          <IconButton icon={<Trash2 className="w-4 h-4" />} label="Delete" variant="danger" />
          <IconButton icon={<Sparkles className="w-4 h-4" />} label="Magic" variant="ghost" />
        </div>
      </section>

      {/* Form Fields & Switches */}
      <section className="space-y-4 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Inputs &amp; Toggles
        </h2>
        <Field label="Standard Input" placeholder="Type here..." />
        <Field label="Input with Hint" placeholder="Enter value" hint="Helpful secondary context" />
        <Field label="Input with Error" placeholder="Invalid input" error="This field is required" />

        <div className="border-t border-[var(--color-border-hairline)] pt-2">
          <Switch
            checked={switchState}
            onChange={setSwitchState}
            label="Haptic Feedback"
            description="Provide subtle physical feedback on button presses"
          />
        </div>
      </section>

      {/* Skeletons & Loading States */}
      <section className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Skeletons &amp; Placeholders
        </h2>
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="90%" />
          </div>
        </div>
        <Skeleton variant="rounded" height={80} className="w-full mt-2" />
      </section>

      {/* Sliders & Controls */}
      <section className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Interactive Sliders
        </h2>
        <Slider
          label="Radius Value"
          value={sliderVal}
          min={0}
          max={50}
          unit="px"
          onChange={setSliderVal}
        />
      </section>

      {/* Swatches */}
      <section className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Color Swatches
        </h2>
        <div className="flex gap-2">
          {['#111317', '#B85226', '#1738A8', '#40916C', '#C8A24A', '#F7F5F0'].map((c) => (
            <Swatch
              key={c}
              color={c}
              isSelected={selectedColor === c}
              onClick={setSelectedColor}
            />
          ))}
        </div>
      </section>

      {/* Preset Tiles */}
      <section className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Preset Tiles (Sample)
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {BUILTIN_PRESETS.slice(0, 4).map((p) => (
            <PresetTile
              key={p.id}
              preset={p}
              isSelected={p.id === 'ink'}
              onSelect={() => {}}
            />
          ))}
        </div>
      </section>

      {/* Empty State */}
      <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)]">
        <EmptyState
          icon={<CreditCard className="w-8 h-8 text-[var(--color-text-tertiary)]" />}
          title="No Cards Found"
          description="Empty state component for when a list has zero items."
          actionLabel="Create Card"
          onAction={() => {}}
        />
      </section>
    </div>
  );
};
