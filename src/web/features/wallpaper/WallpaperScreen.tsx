import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import {
  generateLockScreenWallpaper,
  WALLPAPER_PRESETS,
  type WallpaperResult,
  type WallpaperPreset,
} from '@/web/lib/wallpaper';
import { shareOrDownloadFile } from '@/web/lib/export';
import { DeviceTools } from '@/native/device-tools';
import { Button } from '@/web/components/ui/Button';
import { useToast } from '@/web/components/ui/Toast';
import { haptics } from '@/platform';
import { archipelagoAudio } from '@/web/lib/archipelagoAudio';
import {
  ArrowLeft,
  Smartphone,
  Download,
  Info,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Flame,
  Check,
  Share2,
} from 'lucide-react';

export const WallpaperScreen: React.FC = () => {
  const { card, style } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('amoled-obsidian');
  const [frameStyle, setFrameStyle] = useState<'glass' | 'cyber' | 'minimal' | 'neon'>('glass');
  const [deviceMockStyle, setDeviceMockStyle] = useState<'ios' | 'android'>('ios');
  const [showSafeZoneOverlay, setShowSafeZoneOverlay] = useState<boolean>(true);
  const [targetResolution, setTargetResolution] = useState<'native' | 'iphone' | 'android_qhd'>('native');
  const [wallpaperResult, setWallpaperResult] = useState<WallpaperResult | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!card) return;

    let width: number | undefined;
    let height: number | undefined;

    if (targetResolution === 'iphone') {
      width = 1290;
      height = 2796;
    } else if (targetResolution === 'android_qhd') {
      width = 1440;
      height = 3120;
    }

    generateLockScreenWallpaper(card, style, null, {
      presetId: selectedPresetId,
      frameStyle,
      width,
      height,
    })
      .then((res) => setWallpaperResult(res))
      .catch((e) => console.error('Wallpaper generation failed:', e));
  }, [card, style, selectedPresetId, frameStyle, targetResolution]);

  if (!card) {
    navigate('/');
    return null;
  }

  const handlePresetSelect = (preset: WallpaperPreset) => {
    haptics.impact('light');
    archipelagoAudio.playClick();
    setSelectedPresetId(preset.id);
    setFrameStyle(preset.frameStyle);
  };

  const handleFrameStyleSelect = (f: 'glass' | 'cyber' | 'minimal' | 'neon') => {
    haptics.impact('light');
    archipelagoAudio.playClick();
    setFrameStyle(f);
  };

  const handleApplyDirect = async (alsoHome = false) => {
    if (!wallpaperResult) return;
    try {
      setIsApplying(true);
      haptics.impact('medium');
      archipelagoAudio.playResonance();
      const res = await DeviceTools.setLockScreenWallpaper({
        dataUrl: wallpaperResult.dataUrl,
        alsoHome,
      });

      if (res.success) {
        toast(
          alsoHome
            ? 'Lock and home screen wallpapers set successfully!'
            : 'Lock screen wallpaper set successfully!',
          'success'
        );
      } else {
        await handleSaveImage();
        toast('Direct set not supported on this device. Wallpaper saved to gallery.', 'info');
      }
    } catch {
      await handleSaveImage();
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveImage = async () => {
    if (!wallpaperResult) return;
    try {
      haptics.impact('light');
      archipelagoAudio.playScanSweep();
      await shareOrDownloadFile(
        wallpaperResult.dataUrl,
        `${card.firstName}-lockscreen-wallpaper.png`,
        'image/png'
      );
      toast('Wallpaper saved to gallery', 'success');
    } catch (e: any) {
      toast(e.message || 'Save failed', 'warning');
    }
  };

  const handleOpenPicker = async () => {
    haptics.impact('light');
    archipelagoAudio.playClick();
    if (wallpaperResult) {
      shareOrDownloadFile(
        wallpaperResult.dataUrl,
        `${card.firstName}-lockscreen-wallpaper.png`,
        'image/png'
      ).catch(() => {});
    }
    const res = await DeviceTools.openWallpaperPicker({
      dataUrl: wallpaperResult?.dataUrl,
    });
    if (res.success) {
      toast('Opening wallpaper picker...', 'info');
    } else {
      toast('Saved wallpaper to gallery. Set via system settings.', 'info');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 pb-28 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
        <button
          onClick={() => {
            archipelagoAudio.playClick();
            navigate('/');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-center">
          <span className="text-[9px] font-mono tracking-widest text-[var(--color-accent)] uppercase block font-semibold">
            ARCHIPELAGO // HUD
          </span>
          <h1 className="text-sm font-bold font-serif text-[var(--color-text-primary)]">
            Lockscreen Monolith
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            haptics.impact('light');
            setShowSafeZoneOverlay((prev) => !prev);
          }}
          className="p-2 rounded-xl liquid-glass text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          title={showSafeZoneOverlay ? 'Hide safe zones' : 'Show safe zones'}
        >
          {showSafeZoneOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
        </button>
      </div>

      {/* Phone Mockup with Faux Clock Safe-Zone Overlay */}
      <div className="flex flex-col items-center">
        <div className="w-60 h-[490px] rounded-[42px] border-4 border-zinc-800 bg-black relative overflow-hidden shadow-2xl flex flex-col justify-between p-3 select-none">
          {/* Wallpaper Image Background */}
          {wallpaperResult && (
            <img
              src={wallpaperResult.dataUrl}
              alt="Wallpaper Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Faux Lock Screen Clock (Safe Zone: Top 32%) */}
          <div className="relative z-10 text-center pt-7 space-y-0.5">
            {deviceMockStyle === 'ios' ? (
              <>
                <span className="text-2xs font-semibold text-white/80 tracking-wide block drop-shadow-sm font-sans">
                  Monday, October 5
                </span>
                <div className="text-4xl font-extralight text-white tracking-tight drop-shadow-md font-sans">
                  09:41
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-white tracking-tighter drop-shadow-md font-sans leading-none pt-1">
                  09<span className="text-[var(--color-accent)]">:</span>41
                </div>
                <span className="text-2xs font-medium text-white/75 tracking-wider block font-mono">
                  MON, OCT 5 · 24°C
                </span>
              </>
            )}

            {showSafeZoneOverlay && (
              <div className="pt-2">
                <div className="w-full border-b border-dashed border-cyan-400/50" />
                <span className="text-[8px] font-mono tracking-widest text-cyan-300/80 uppercase block pt-0.5">
                  CLOCK SAFE ZONE (32%)
                </span>
              </div>
            )}
          </div>

          {/* Faux Bottom Shortcuts (Safe Zone: Bottom 14%) */}
          <div className="relative z-10 pb-1 flex flex-col gap-1">
            {showSafeZoneOverlay && (
              <div className="w-full border-t border-dashed border-cyan-400/50 pt-0.5">
                <span className="text-[8px] font-mono tracking-widest text-cyan-300/80 uppercase block text-center">
                  GESTURE SAFE ZONE (14%)
                </span>
              </div>
            )}
            <div className="flex items-center justify-between px-3 text-white/75">
              <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-xs shadow-xs border border-white/20">
                🔦
              </div>
              <div className="w-20 h-1 bg-white/50 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-xs shadow-xs border border-white/20">
                📷
              </div>
            </div>
          </div>
        </div>

        {/* Mockup Clock Style Switcher */}
        <div className="flex items-center gap-2 pt-2.5">
          <button
            type="button"
            onClick={() => setDeviceMockStyle('ios')}
            className={`px-3 py-1 rounded-xl text-2xs font-mono transition-all ${
              deviceMockStyle === 'ios'
                ? 'bg-white/20 font-bold text-[var(--color-text-primary)] shadow-xs border border-white/30'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            iOS Clock
          </button>
          <span className="text-xs opacity-30">·</span>
          <button
            type="button"
            onClick={() => setDeviceMockStyle('android')}
            className={`px-3 py-1 rounded-xl text-2xs font-mono transition-all ${
              deviceMockStyle === 'android'
                ? 'bg-white/20 font-bold text-[var(--color-text-primary)] shadow-xs border border-white/30'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Android Clock
          </button>
        </div>
      </div>

      {/* 1. Curated Wallpaper Presets Gallery */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span className="text-2xs font-mono font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
              CURATED_WALLPAPER_PRESETS // GALLERY
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--color-accent)] font-semibold">
            {WALLPAPER_PRESETS.length} PRESETS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {WALLPAPER_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[92px] border ${
                  isSelected
                    ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30 shadow-md scale-[1.01]'
                    : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/25 liquid-glass'
                }`}
                style={{
                  background: `linear-gradient(${preset.gradientAngle}deg, ${preset.gradientStops[0]}, ${preset.gradientStops[1]})`,
                }}
              >
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between w-full">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs font-semibold tracking-wider uppercase">
                    {preset.category}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="relative z-10 pt-2">
                  <p className="text-xs font-bold text-white tracking-tight drop-shadow-xs truncate">
                    {preset.name}
                  </p>
                  <p className="text-[9px] text-white/75 truncate leading-tight">
                    {preset.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. QR Frame & Pedestal Style Selector */}
      <div className="space-y-2">
        <span className="text-2xs font-mono font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block px-1">
          QR_PEDESTAL // FRAME_STYLE
        </span>
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl liquid-glass border border-black/5 dark:border-white/10">
          {(
            [
              { id: 'glass', label: 'Liquid Glass' },
              { id: 'cyber', label: 'Cyber Brackets' },
              { id: 'minimal', label: 'Minimalist' },
              { id: 'neon', label: 'Neon Aura' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFrameStyleSelect(f.id)}
              className={`py-2 px-1 rounded-xl text-center text-2xs font-mono transition-all ${
                frameStyle === f.id
                  ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] font-bold shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Output Resolution Selector */}
      <div className="space-y-2">
        <span className="text-2xs font-mono font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block px-1">
          TARGET_RESOLUTION // CANVAS_DENSITY
        </span>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl liquid-glass border border-black/5 dark:border-white/10">
          {(
            [
              { id: 'native', label: 'Device Screen' },
              { id: 'iphone', label: 'iPhone Pro Max' },
              { id: 'android_qhd', label: 'Quad HD 1440p' },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                haptics.impact('light');
                archipelagoAudio.playClick();
                setTargetResolution(r.id);
              }}
              className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-mono transition-all ${
                targetResolution === r.id
                  ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] font-bold shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Primary Actions Stack */}
      <div className="space-y-2.5 pt-1">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={() => handleApplyDirect(false)}
          disabled={isApplying || !wallpaperResult}
          icon={<Smartphone className="w-4 h-4 text-white" />}
          className="shadow-md font-mono text-xs tracking-wider"
        >
          {isApplying ? 'ENGRAVING WALLPAPER...' : 'SET LOCK SCREEN (ANDROID NATIVE)'}
        </Button>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleApplyDirect(true)}
            disabled={isApplying || !wallpaperResult}
            icon={<Layers className="w-4 h-4 text-[var(--color-accent)]" />}
            className="font-mono text-xs tracking-wider"
          >
            LOCK + HOME
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleOpenPicker}
            disabled={!wallpaperResult}
            icon={<SlidersHorizontal className="w-4 h-4 text-[var(--color-accent)]" />}
            className="font-mono text-xs tracking-wider"
          >
            SYSTEM PICKER
          </Button>
        </div>

        <Button
          fullWidth
          size="md"
          variant="outline"
          onClick={handleSaveImage}
          disabled={!wallpaperResult}
          icon={<Download className="w-4 h-4 text-[var(--color-accent)]" />}
          className="font-mono text-xs tracking-wider"
        >
          SAVE 4K WALLPAPER (IOS & GALLERY)
        </Button>
      </div>

      {/* Platform Instructions */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/60 dark:border-white/10 space-y-2.5 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
          <Info className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-mono text-2xs uppercase tracking-wider">PLATFORM INSTRUCTIONS // AIRGAP</span>
        </div>
        <p className="text-2xs leading-relaxed">
          <strong>iPhone / iOS users:</strong> Tap <strong>Save 4K Wallpaper</strong> &rarr; open <strong>Settings &rarr; Wallpaper &rarr; Add New Wallpaper</strong> &rarr; select Photos &rarr; tap <strong>Set as Wallpaper Pair</strong>.
        </p>
        <p className="text-2xs leading-relaxed opacity-75">
          <strong>Android users:</strong> Tap <strong>Set Lock Screen</strong> for instant 1-tap setup, or use <strong>System Picker</strong> if your OEM theme requires gallery authorization.
        </p>
      </div>
    </div>
  );
};
