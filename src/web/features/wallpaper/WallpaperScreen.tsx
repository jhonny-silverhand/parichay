import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { generateLockScreenWallpaper, type WallpaperResult } from '@/web/lib/wallpaper';
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
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export const WallpaperScreen: React.FC = () => {
  const { card, style } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [backdropChoice, setBackdropChoice] = useState<'style' | 'charcoal' | 'navy' | 'warm'>('style');
  const [wallpaperResult, setWallpaperResult] = useState<WallpaperResult | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!card) return;
    generateLockScreenWallpaper(card, style, null, { backdropChoice })
      .then((res) => setWallpaperResult(res))
      .catch((e) => console.error('Wallpaper generation failed:', e));
  }, [card, style, backdropChoice]);

  if (!card) {
    navigate('/');
    return null;
  }

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
      // Auto save so it's in recent photos
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
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-base font-bold font-serif text-[var(--color-text-primary)]">
          Lock-Screen Wallpaper
        </h1>
        <div className="w-12" />
      </div>

      {/* Phone Mockup with Faux Clock Safe-Zone Overlay */}
      <div className="flex flex-col items-center">
        <div className="w-56 h-[460px] rounded-[38px] border-4 border-slate-800 bg-black relative overflow-hidden shadow-2xl flex flex-col justify-between p-3 select-none">
          {/* Wallpaper Image Background */}
          {wallpaperResult && (
            <img
              src={wallpaperResult.dataUrl}
              alt="Wallpaper Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Faux Lock Screen Clock (Safe Zone: Top 32%) */}
          <div className="relative z-10 text-center pt-8 space-y-1">
            <span className="text-2xs font-medium text-white/70 tracking-wider">Sunday, October 4</span>
            <div className="text-4xl font-extralight text-white tracking-tight drop-shadow-md">
              09:41
            </div>
            <div className="w-full border-b border-dashed border-white/20 pt-2" />
            <span className="text-[9px] uppercase tracking-widest text-white/40 block">Clock Safe Zone</span>
          </div>

          {/* Faux Bottom Shortcuts (Safe Zone: Bottom 14%) */}
          <div className="relative z-10 pb-2 flex items-center justify-between px-3 text-white/60">
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-xs">
              🔦
            </div>
            <div className="w-20 h-1 bg-white/40 rounded-full" />
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-xs">
              📷
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop Style Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Wallpaper Backdrop
        </span>
        <div className="grid grid-cols-4 gap-2">
          {(['style', 'charcoal', 'navy', 'warm'] as const).map((b) => (
            <button
              key={b}
              onClick={() => {
                haptics.impact('light');
                setBackdropChoice(b);
              }}
              className={`py-2 px-2.5 rounded-xl border text-xs font-medium capitalize transition-all ${
                backdropChoice === b
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                  : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              {b === 'style' ? 'Card Style' : b}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2.5">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={() => handleApplyDirect(false)}
          disabled={isApplying || !wallpaperResult}
          icon={<Smartphone className="w-4 h-4" />}
        >
          {isApplying ? 'Applying...' : 'Set Lock Screen (Android Native)'}
        </Button>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleApplyDirect(true)}
            disabled={isApplying || !wallpaperResult}
            icon={<Layers className="w-4 h-4 text-[var(--color-accent)]" />}
          >
            Lock + Home
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleOpenPicker}
            disabled={!wallpaperResult}
            icon={<SlidersHorizontal className="w-4 h-4 text-[var(--color-accent)]" />}
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
        >
          Save Wallpaper Image (iOS &amp; Gallery)
        </Button>
      </div>

      {/* Guidelines & OEM Caveats */}
      <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-2.5 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
          <Info className="w-4 h-4 text-[var(--color-accent)]" />
          <span>Platform &amp; Device Instructions</span>
        </div>
        <p className="text-2xs leading-relaxed">
          <strong>iPhone users:</strong> Tap <strong>Save Wallpaper Image</strong>, open <strong>Settings &rarr; Wallpaper &rarr; Add New Wallpaper</strong>, select <strong>Photos</strong>, choose the saved wallpaper, and tap <strong>Set as Wallpaper Pair</strong>.
        </p>
        <p className="text-2xs leading-relaxed opacity-75">
          <strong>Samsung / Xiaomi note:</strong> If your lock screen themes override programmatic wallpapers, tap <strong>System Picker</strong> or set it directly through your phone gallery app.
        </p>
      </div>
    </div>
  );
};
