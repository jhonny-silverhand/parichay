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
import {
  ArrowLeft,
  Smartphone,
  Download,
  Info,
  Layers,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

export const WallpaperScreen: React.FC = () => {
  const { card, style } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('minimal-charcoal');
  const [deviceMockStyle, setDeviceMockStyle] = useState<'ios' | 'android'>('ios');
  const [showSafeZoneOverlay, setShowSafeZoneOverlay] = useState<boolean>(true);
  const [wallpaperResult, setWallpaperResult] = useState<WallpaperResult | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!card) return;

    generateLockScreenWallpaper(card, style, null, {
      presetId: selectedPresetId,
    })
      .then((res) => setWallpaperResult(res))
      .catch((e) => console.error('Wallpaper generation failed:', e));
  }, [card, style, selectedPresetId]);

  if (!card) {
    navigate('/');
    return null;
  }

  const handlePresetSelect = (preset: WallpaperPreset) => {
    haptics.impact('light');
    setSelectedPresetId(preset.id);
  };

  const handleApplyDirect = async (alsoHome = false) => {
    if (!wallpaperResult) return;
    try {
      setIsApplying(true);
      haptics.impact('medium');
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
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-sm font-bold font-serif text-[var(--color-text-primary)]">
          Lock-Screen Wallpaper
        </h1>
        <button
          type="button"
          onClick={() => setShowSafeZoneOverlay((prev) => !prev)}
          className="p-2 rounded-xl liquid-glass text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          title={showSafeZoneOverlay ? 'Hide safe zones' : 'Show safe zones'}
        >
          {showSafeZoneOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
        </button>
      </div>

      {/* Phone Mockup with Faux Clock Safe-Zone Overlay */}
      <div className="flex flex-col items-center">
        <div className="w-60 h-[480px] rounded-[40px] border-4 border-zinc-800 bg-black relative overflow-hidden shadow-xl flex flex-col justify-between p-3 select-none">
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
                  MON, OCT 5
                </span>
              </>
            )}

            {showSafeZoneOverlay && (
              <div className="pt-2">
                <div className="w-full border-b border-dashed border-white/20" />
                <span className="text-[8px] tracking-wider text-white/50 uppercase block pt-0.5">
                  Clock Safe Zone (32%)
                </span>
              </div>
            )}
          </div>

          {/* Faux Bottom Shortcuts (Safe Zone: Bottom 14%) */}
          <div className="relative z-10 pb-1 flex flex-col gap-1">
            {showSafeZoneOverlay && (
              <div className="w-full border-t border-dashed border-white/20 pt-0.5">
                <span className="text-[8px] tracking-wider text-white/50 uppercase block text-center">
                  Gesture Safe Zone (14%)
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
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setDeviceMockStyle('ios')}
            className={`px-3 py-1 rounded-xl text-2xs transition-all ${
              deviceMockStyle === 'ios'
                ? 'bg-black/10 dark:bg-white/15 font-semibold text-[var(--color-text-primary)] shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            iOS Clock
          </button>
          <span className="text-xs opacity-30">·</span>
          <button
            type="button"
            onClick={() => setDeviceMockStyle('android')}
            className={`px-3 py-1 rounded-xl text-2xs transition-all ${
              deviceMockStyle === 'android'
                ? 'bg-black/10 dark:bg-white/15 font-semibold text-[var(--color-text-primary)] shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Android Clock
          </button>
        </div>
      </div>

      {/* Minimalist Wallpaper Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block px-1">
          Wallpaper Palette
        </span>

        <div className="grid grid-cols-2 gap-2">
          {WALLPAPER_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[78px] border ${
                  isSelected
                    ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 shadow-md'
                    : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 liquid-glass'
                }`}
                style={{
                  background: `linear-gradient(${preset.gradientAngle}deg, ${preset.gradientStops[0]}, ${preset.gradientStops[1]})`,
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-white truncate">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-white/70 truncate leading-tight pt-1">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Actions Stack */}
      <div className="space-y-2 pt-1">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={() => handleApplyDirect(false)}
          disabled={isApplying || !wallpaperResult}
          icon={<Smartphone className="w-4 h-4 text-white" />}
          className="shadow-sm font-medium"
        >
          {isApplying ? 'Applying Wallpaper...' : 'Set Lock Screen (Android Native)'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleApplyDirect(true)}
            disabled={isApplying || !wallpaperResult}
            icon={<Layers className="w-4 h-4 text-[var(--color-accent)]" />}
            className="font-medium"
          >
            Lock + Home
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleOpenPicker}
            disabled={!wallpaperResult}
            icon={<SlidersHorizontal className="w-4 h-4 text-[var(--color-accent)]" />}
            className="font-medium"
          >
            System Picker
          </Button>
        </div>

        <Button
          fullWidth
          size="md"
          variant="outline"
          onClick={handleSaveImage}
          disabled={!wallpaperResult}
          icon={<Download className="w-4 h-4 text-[var(--color-accent)]" />}
          className="font-medium"
        >
          Save Wallpaper Image (iOS &amp; Gallery)
        </Button>
      </div>

      {/* Platform Instructions */}
      <div className="p-4 rounded-2xl liquid-glass border border-black/5 dark:border-white/10 space-y-2 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
          <Info className="w-4 h-4 text-[var(--color-accent)]" />
          <span>Device Instructions</span>
        </div>
        <p className="text-2xs leading-relaxed">
          <strong>iPhone / iOS:</strong> Tap <strong>Save Wallpaper Image</strong> &rarr; open <strong>Settings &rarr; Wallpaper &rarr; Add New Wallpaper</strong> &rarr; select Photos &rarr; tap <strong>Set as Wallpaper Pair</strong>.
        </p>
        <p className="text-2xs leading-relaxed opacity-75">
          <strong>Android:</strong> Tap <strong>Set Lock Screen</strong> for direct 1-tap installation.
        </p>
      </div>
    </div>
  );
};
