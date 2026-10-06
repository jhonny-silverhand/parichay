import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { renderQRToCanvas } from '@/web/lib/qr-renderer';
import { checkQRCanvasScan, type ScanCheckResult } from '@/web/lib/scan-check';
import { buildCompactVCard } from '@/shared/vcard';
import { BUILTIN_PRESETS, COLOR_SWATCHES, generateSurpriseScannableStyle } from '@/web/lib/qr-style-presets';
import { PLAIN_DEFAULT_STYLE, type QRStyle, type ModuleShape, type EyeShape } from '@/web/lib/qr-style-types';
import { FONT_CATALOG } from '@/web/lib/fonts';
import { PresetTile } from '@/web/components/ui/PresetTile';
import { Tabs } from '@/web/components/ui/Tabs';
import { Slider } from '@/web/components/ui/Slider';
import { Swatch } from '@/web/components/ui/Swatch';
import { Button } from '@/web/components/ui/Button';
import { useToast } from '@/web/components/ui/Toast';
import {
  RotateCcw,
  Dices,
  CheckCircle2,
  AlertTriangle,
  Shapes,
  Palette,
  Image as ImageIcon,
  Type,
  Layout,
} from 'lucide-react';

type StudioTab = 'presets' | 'shapes' | 'colors' | 'plate' | 'center' | 'typography';

export const StyleStudioScreen: React.FC = () => {
  const { card, style, photoDataUrl, saveStyle } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<StudioTab>('presets');
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [scanResult, setScanResult] = useState<ScanCheckResult | null>(null);

  // Load photo element
  useEffect(() => {
    if (!photoDataUrl) {
      setPhotoImg(null);
      return;
    }
    const img = new Image();
    img.onload = () => setPhotoImg(img);
    img.src = photoDataUrl;
  }, [photoDataUrl]);

  // Live Canvas Rendering & Scan Validation
  const updateRenderAndScan = useCallback(() => {
    if (!card || !canvasRef.current) return;
    const payload = buildCompactVCard(card);

    renderQRToCanvas({
      canvas: canvasRef.current,
      payload,
      style,
      size: 560,
      photoImage: photoImg,
      forceEccH: style.centerElement.type !== 'none' || !!photoImg,
    });

    // Check optical scan reliability
    const check = checkQRCanvasScan(
      canvasRef.current,
      payload,
      style.moduleColor,
      style.plateColor
    );
    setScanResult(check);
  }, [card, style, photoImg]);

  useEffect(() => {
    updateRenderAndScan();
  }, [updateRenderAndScan]);

  const handleApplyPreset = (preset: QRStyle) => {
    saveStyle(preset);
    toast(`Applied "${preset.name}" style`, 'info');
  };

  const handleResetPlain = () => {
    saveStyle(PLAIN_DEFAULT_STYLE);
    toast('Reset to Plain QR', 'info');
  };

  const handleSurpriseMe = () => {
    const randomStyle = generateSurpriseScannableStyle();
    saveStyle(randomStyle);
    toast('Surprise style applied!', 'info');
  };

  const updateStyleProp = <K extends keyof QRStyle>(key: K, value: QRStyle[K]) => {
    saveStyle({ ...style, [key]: value });
  };

  if (!card) {
    navigate('/onboarding');
    return null;
  }

  const moduleShapes: { id: ModuleShape; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'dots', label: 'Dots' },
    { id: 'classy', label: 'Classy' },
    { id: 'extra-rounded', label: 'Extra' },
    { id: 'diamond', label: 'Diamond' },
  ];

  const eyeShapes: { id: EyeShape; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'circle', label: 'Circle' },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
            QR Studio
          </span>
          <h1 className="text-xl font-bold font-serif text-[var(--color-text-primary)]">
            Style &amp; Design
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleResetPlain} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Plain
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSurpriseMe} icon={<Dices className="w-3.5 h-3.5 text-[var(--color-accent)]" />}>
            Surprise
          </Button>
        </div>
      </div>

      {/* Hero Live Preview */}
      <div
        className="w-full rounded-[32px] p-6 liquid-glass-card transition-all flex flex-col items-center relative overflow-hidden"
        style={{
          backgroundColor: style.backdropColor ? `${style.backdropColor}` : undefined,
          backgroundImage: style.backdropGradient
            ? `linear-gradient(${style.backdropGradient.angle}deg, ${style.backdropGradient.stops[0]}, ${style.backdropGradient.stops[1]})`
            : undefined,
        }}
      >
        <div className="rounded-3xl p-3 bg-white/90 dark:bg-white/95 shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_1px_1.5px_rgba(255,255,255,1)] border border-white/70">
          <canvas ref={canvasRef} className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl shadow-xs" />
        </div>

        {style.showCaption && (
          <div className="mt-4 text-center space-y-0.5">
            <p
              className="text-base font-bold font-serif truncate max-w-xs"
              style={{ color: style.captionColor || 'var(--color-text-primary)', fontFamily: style.captionFont }}
            >
              {[card.firstName, card.lastName].filter(Boolean).join(' ')}
            </p>
            {card.jobTitle && (
              <p
                className="text-xs truncate opacity-80"
                style={{ color: style.captionColor || 'var(--color-text-secondary)' }}
              >
                {card.jobTitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Optical Scan Reliability Indicator */}
      {scanResult && (
        <div
          role="status"
          className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs transition-all ${
            scanResult.canScan && scanResult.isContrastSufficient && !scanResult.isInverted
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
          }`}
        >
          {scanResult.canScan && scanResult.isContrastSufficient && !scanResult.isInverted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Scans well</p>
                <p className="text-2xs opacity-80">
                  High optical contrast ratio ({scanResult.contrastRatio.toFixed(1)}:1). Tested with stock camera algorithms.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold">Scan Reliability Warning</p>
                {scanResult.warnings.map((w, idx) => (
                  <p key={idx} className="text-2xs leading-tight">
                    {w}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <Tabs<StudioTab>
        activeId={activeTab}
        onChange={setActiveTab}
        options={[
          { id: 'presets', label: 'Presets', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'shapes', label: 'Shapes', icon: <Shapes className="w-3.5 h-3.5" /> },
          { id: 'colors', label: 'Colors', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'plate', label: 'Plate' },
          { id: 'center', label: 'Centre', icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { id: 'typography', label: 'Fonts', icon: <Type className="w-3.5 h-3.5" /> },
        ]}
      />

      {/* Tab 1: Presets Carousel */}
      {activeTab === 'presets' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">Style Pack (17 Presets)</span>
            <span>Tap to apply</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 -mx-4 px-4 scrollbar-none">
            {BUILTIN_PRESETS.map((preset) => (
              <PresetTile
                key={preset.id}
                preset={preset}
                isSelected={style.id === preset.id}
                onSelect={handleApplyPreset}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: Shapes */}
      {activeTab === 'shapes' && (
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-5 animate-in fade-in">
          {/* Module Shapes */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Module Shape
            </span>
            <div className="grid grid-cols-3 gap-2">
              {moduleShapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateStyleProp('moduleShape', s.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    style.moduleShape === s.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                      : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eye Outer Shape */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Finder Eye Frame
            </span>
            <div className="grid grid-cols-3 gap-2">
              {eyeShapes.map((e) => (
                <button
                  key={e.id}
                  onClick={() => updateStyleProp('eyeOuterShape', e.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    style.eyeOuterShape === e.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                      : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eye Inner Shape */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Finder Eye Pupil
            </span>
            <div className="grid grid-cols-3 gap-2">
              {eyeShapes.map((e) => (
                <button
                  key={e.id}
                  onClick={() => updateStyleProp('eyeInnerShape', e.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    style.eyeInnerShape === e.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                      : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Colors */}
      {activeTab === 'colors' && (
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-5 animate-in fade-in">
          {/* Module Color Swatches */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Module Color
            </span>
            <div className="flex gap-2 overflow-x-auto py-1">
              {[...COLOR_SWATCHES.neutrals, ...COLOR_SWATCHES.earth, ...COLOR_SWATCHES.jewel].map((c) => (
                <Swatch
                  key={c}
                  color={c}
                  isSelected={style.moduleColor.toLowerCase() === c.toLowerCase()}
                  onClick={(color) => {
                    saveStyle({
                      ...style,
                      moduleColor: color,
                      eyeOuterColor: color,
                      eyeInnerColor: color,
                    });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Plate Background Color */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Plate Background
            </span>
            <div className="flex gap-2 overflow-x-auto py-1">
              {COLOR_SWATCHES.pastels.map((c) => (
                <Swatch
                  key={c}
                  color={c}
                  isSelected={style.plateColor.toLowerCase() === c.toLowerCase()}
                  onClick={(color) => updateStyleProp('plateColor', color)}
                />
              ))}
            </div>
          </div>

          {/* Backdrop Color */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Card Backdrop
            </span>
            <div className="flex gap-2 overflow-x-auto py-1">
              {[...COLOR_SWATCHES.neutrals, ...COLOR_SWATCHES.earth, ...COLOR_SWATCHES.brights].map((c) => (
                <Swatch
                  key={c}
                  color={c}
                  isSelected={style.backdropColor.toLowerCase() === c.toLowerCase()}
                  onClick={(color) => updateStyleProp('backdropColor', color)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Plate Geometry */}
      {activeTab === 'plate' && (
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-5 animate-in fade-in">
          <Slider
            label="Corner Radius"
            value={style.plateRadius}
            min={0}
            max={36}
            unit="px"
            onChange={(val) => updateStyleProp('plateRadius', val)}
          />

          <Slider
            label="Quiet Zone (Padding)"
            value={style.quietZone}
            min={4}
            max={8}
            unit=" modules"
            onChange={(val) => updateStyleProp('quietZone', val)}
          />

          <Slider
            label="Border Width"
            value={style.plateBorderWidth}
            min={0}
            max={4}
            unit="px"
            onChange={(val) => updateStyleProp('plateBorderWidth', val)}
          />
        </section>
      )}

      {/* Tab 5: Centre Element */}
      {activeTab === 'center' && (
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-5 animate-in fade-in">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Centre Content
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['none', 'photo', 'monogram'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    updateStyleProp('centerElement', {
                      ...style.centerElement,
                      type,
                    })
                  }
                  className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                    style.centerElement.type === type
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                      : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {type === 'none' ? 'None (Plain)' : type === 'photo' ? 'Photo' : 'Monogram'}
                </button>
              ))}
            </div>
          </div>

          {style.centerElement.type !== 'none' && (
            <>
              <Slider
                label="Centre Size"
                value={style.centerElement.sizePercent}
                min={16}
                max={26}
                unit="%"
                onChange={(val) =>
                  updateStyleProp('centerElement', {
                    ...style.centerElement,
                    sizePercent: val,
                  })
                }
              />

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Centre Shape
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['circle', 'rounded-square'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() =>
                        updateStyleProp('centerElement', {
                          ...style.centerElement,
                          shape,
                        })
                      }
                      className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                        style.centerElement.shape === shape
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold'
                          : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface-sunken)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {shape.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Tab 6: Typography */}
      {activeTab === 'typography' && (
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Font Family
            </span>
            <span className="text-2xs text-[var(--color-text-tertiary)]">Self-Hosted</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {FONT_CATALOG.map((f) => (
              <button
                key={f.family}
                onClick={() => updateStyleProp('captionFont', f.family)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  style.captionFont.toLowerCase() === f.family.toLowerCase()
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-sunken)]'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold truncate" style={{ fontFamily: f.family }}>
                    {f.family}
                  </p>
                  <p className="text-2xs text-[var(--color-text-tertiary)] capitalize">
                    {f.category} · {f.scripts.join(', ')}
                  </p>
                </div>
                {style.captionFont.toLowerCase() === f.family.toLowerCase() && (
                  <span className="text-xs font-bold text-[var(--color-accent)]">Active</span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
