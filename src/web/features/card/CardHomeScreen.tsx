import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { renderQRToCanvas } from '@/web/lib/qr-renderer';
import { buildCompactVCard, getQRPayloadMetrics } from '@/shared/vcard';
import { exportVCardFile } from '@/web/lib/export';
import { Button } from '@/web/components/ui/Button';
import { PWAInstallButton } from '@/web/components/pwa/PWAInstallButton';
import { Avatar } from '@/web/components/ui/Avatar';
import { Flippable3DCard } from '@/web/components/card/Flippable3DCard';
import { useToast } from '@/web/components/ui/Toast';
import { clipboard, haptics } from '@/platform';
import { archipelagoAudio } from '@/web/lib/archipelagoAudio';
import { DEVELOPER_NAME, DEVELOPER_LINK, DEVELOPER_SIGNATURE } from '@/shared/author';
import {
  Maximize2,
  Share2,
  Sparkles,
  Wallet,
  Smartphone,
  Edit3,
  AlertTriangle,
  Building2,
  Briefcase,
  Phone,
  Mail,
  Globe,
  MapPin,
  Download,
  Copy,
  Check,
  RotateCw,
  Sun,
  Moon,
  MessageCircle,
  Radio,
  Compass,
  Cpu,
  Layers,
  Terminal,
  Volume2,
  VolumeX,
  HelpCircle,
  Zap,
  Eye,
  Binary,
  ShieldCheck,
  ExternalLink,
  X,
  Flame,
} from 'lucide-react';
import { BRAND } from '@/shared/brand';

type ViewMode = 'talisman' | 'qr' | 'xray';
type DimensionMode = 'obsidian' | 'solaris' | 'abyss' | 'chromium';

export const CardHomeScreen: React.FC = () => {
  const { card, style, photoDataUrl, settings, saveSettings, qrHasChanged, acknowledgeQRChange } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  
  // Avant-Garde Archipelago Modes
  const [viewMode, setViewMode] = useState<ViewMode>('talisman');
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(archipelagoAudio.isMuted());
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [dimension, setDimension] = useState<DimensionMode>('obsidian');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load photo into HTMLImageElement if photoDataUrl is present
  useEffect(() => {
    if (!photoDataUrl) {
      setPhotoImg(null);
      return;
    }
    const img = new Image();
    img.onload = () => setPhotoImg(img);
    img.src = photoDataUrl;
  }, [photoDataUrl]);

  // Render hero QR
  useEffect(() => {
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
  }, [card, style, photoImg]);

  if (!card) {
    return null; // Route redirect handles this
  }

  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');
  const vCardPayload = buildCompactVCard(card);
  const metrics = getQRPayloadMetrics(vCardPayload);

  const handleCopy = async (text: string, key: string, label: string) => {
    haptics.impact('light');
    archipelagoAudio.playClick();
    await clipboard.write(text);
    setCopiedKey(key);
    toast(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveContact = async () => {
    haptics.impact('medium');
    archipelagoAudio.playResonance();
    try {
      await exportVCardFile(card, photoDataUrl);
      toast('Sovereign contact relic downloaded (.vcf)', 'success');
    } catch {
      toast('Could not save contact relic', 'warning');
    }
  };

  const toggleTheme = () => {
    haptics.impact('light');
    archipelagoAudio.playClick();
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings({ theme: nextTheme });
  };

  const toggleAudio = () => {
    haptics.impact('light');
    const muted = archipelagoAudio.toggleMute();
    setIsAudioMuted(muted);
    toast(muted ? 'Sound design muted' : 'Archipelago synthesizer active', 'info');
  };

  const handleDimensionChange = (dim: DimensionMode) => {
    haptics.impact('medium');
    archipelagoAudio.playScanSweep();
    setDimension(dim);
  };

  const isFlipped = viewMode === 'qr';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 animate-in fade-in duration-300">
      {/* 1. ARCHIPELAGO COMMAND HUD */}
      <header className="flex items-center justify-between pt-1 pb-1 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative p-1.5 rounded-2xl liquid-glass shadow-xs group cursor-pointer" onClick={() => setIsManifestoOpen(true)}>
            <img
              src="/logo.svg"
              alt="Parichay Emblem"
              className="w-10 h-10 rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--color-bg-primary)] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[var(--color-accent)] uppercase font-semibold">
                ARCHIPELAGO // {BRAND.name}
              </span>
              <span className="text-[9px] font-mono text-[var(--color-text-tertiary)] opacity-60">
                SOVEREIGN
              </span>
            </div>
            <h1 className="text-lg font-bold font-serif text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
              <span>परिचय</span>
              <span className="text-xs font-mono font-normal opacity-50">/ ATOLL_01</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isAudioMuted ? 'Unmute archipelago sound engine' : 'Mute archipelago sound engine'}
            className="p-2.5 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target active:scale-95 shadow-xs relative"
            title="Archipelago Sound Synthesizer"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 opacity-50" />
            ) : (
              <div className="flex items-center gap-0.5 text-[var(--color-accent)]">
                <Volume2 className="w-4 h-4" />
                <span className="w-1 h-2 bg-[var(--color-accent)] animate-pulse rounded-full" />
              </div>
            )}
          </button>

          {/* Celestial Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2.5 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target active:scale-95 shadow-xs"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--color-accent)]" />
            )}
          </button>

          {/* WTF Is This App / Manifesto Button */}
          <button
            type="button"
            onClick={() => {
              haptics.impact('light');
              archipelagoAudio.playResonance();
              setIsManifestoOpen(true);
            }}
            aria-label="Open Archipelago design manifesto"
            className="p-2.5 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] touch-target active:scale-95 shadow-xs"
            title="What is this app? / Archipelago Manifesto"
          >
            <HelpCircle className="w-4 h-4 text-[var(--color-accent)]" />
          </button>

          <PWAInstallButton />
        </div>
      </header>

      {/* Static QR Changed Notice Banner */}
      {qrHasChanged && (
        <div className="p-3.5 rounded-2xl liquid-glass border border-amber-500/40 flex items-start gap-3 text-xs text-[var(--color-text-primary)] animate-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Matrix Topology Altered</p>
            <p className="text-amber-800/80 dark:text-amber-300/80 leading-relaxed text-2xs">
              Previously broadcast physical QR tokens retain earlier cryptographic coordinates.
            </p>
            <button
              onClick={acknowledgeQRChange}
              className="text-2xs font-bold font-mono text-amber-900 dark:text-amber-200 underline mt-1"
            >
              [ ACKNOWLEDGE ]
            </button>
          </div>
        </div>
      )}

      {/* 2. SPATIAL ARCHIPELAGO SEGMENTED NAVIGATOR */}
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex p-1 rounded-2xl liquid-glass shadow-xs border border-black/5 dark:border-white/10 gap-1">
          <button
            type="button"
            onClick={() => {
              haptics.impact('light');
              archipelagoAudio.playClick();
              setViewMode('talisman');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 select-none flex items-center gap-1.5 ${
              viewMode === 'talisman'
                ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] shadow-sm font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <span>✦</span>
            <span>TALISMAN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.impact('light');
              archipelagoAudio.playScanSweep();
              setViewMode('qr');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 select-none flex items-center gap-1.5 ${
              viewMode === 'qr'
                ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] shadow-sm font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <span>⌖</span>
            <span>QR CORE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.impact('light');
              archipelagoAudio.playResonance();
              setViewMode('xray');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 select-none flex items-center gap-1.5 ${
              viewMode === 'xray'
                ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] shadow-sm font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <span>⟁</span>
            <span>X-RAY</span>
          </button>
        </div>

        {/* Dynamic Overdrive / Holo Beam Toggle */}
        <button
          type="button"
          onClick={() => {
            haptics.impact('medium');
            archipelagoAudio.playScanSweep();
            setIsOverdrive((v) => !v);
            toast(isOverdrive ? 'Photonic overdrive disengaged' : 'Photonic overdrive active', 'info');
          }}
          className={`flex items-center gap-1.5 text-2xs font-mono transition-all px-3 py-1.5 rounded-xl liquid-glass border shadow-xs ${
            isOverdrive
              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-500 font-bold animate-pulse'
              : 'border-[var(--color-accent)]/20 text-[var(--color-accent)] hover:opacity-80 active:scale-95'
          }`}
          title="Toggle Volumetric Holographic Overdrive"
        >
          <Zap className={`w-3 h-3 ${isOverdrive ? 'fill-current' : ''}`} />
          <span>{isOverdrive ? 'OVERDRIVE ON' : 'OVERDRIVE'}</span>
        </button>
      </div>

      {/* 3. THE MONOLITH TALISMAN (AVANT-GARDE 3D ARTIFACT) */}
      {viewMode === 'xray' ? (
        /* X-RAY / CRYPTOGRAPHIC BLUEPRINT MODE */
        <div className="w-full rounded-[36px] p-6 bg-black/90 dark:bg-black/95 text-cyan-400 font-mono shadow-2xl transition-all border border-cyan-500/40 relative overflow-hidden min-h-[410px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-2xs font-bold uppercase tracking-widest text-cyan-300">
                CRYPTOGRAPHIC_BLUEPRINT // X-RAY
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              100% AIRGAPPED
            </span>
          </div>

          <div className="space-y-4 my-auto py-2">
            <div className="grid grid-cols-2 gap-3 text-2xs">
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 space-y-1">
                <span className="opacity-60 block">BYTE DENSITY</span>
                <span className="text-sm font-bold text-white">{metrics.bytes} BYTES</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 space-y-1">
                <span className="opacity-60 block">SPEC / VERSION</span>
                <span className="text-sm font-bold text-white">vCard 3.0 / RFC2426</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 space-y-1">
                <span className="opacity-60 block">ERROR CORRECTION</span>
                <span className="text-sm font-bold text-white">LEVEL H (30%)</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 space-y-1">
                <span className="opacity-60 block">SOVEREIGNTY STATUS</span>
                <span className="text-sm font-bold text-emerald-400">ZERO CLOUD EXFIL</span>
              </div>
            </div>

            {/* Live Raw Payload Hex Stream Preview */}
            <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-1 text-[10px] max-h-28 overflow-y-auto font-mono text-cyan-200/90 scrollbar-none">
              <div className="text-[9px] text-cyan-400/60 uppercase tracking-wider mb-1">
                RAW_VCARD_STREAM:
              </div>
              <pre className="whitespace-pre-wrap break-all leading-tight">
                {vCardPayload}
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={() => handleCopy(vCardPayload, 'raw_vcard', 'Raw vCard payload')}
              className="text-2xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>COPY RAW VCARD STREAM</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('talisman')}
              className="text-2xs font-bold text-cyan-400 underline"
            >
              [ RETURN TO MONOLITH ]
            </button>
          </div>
        </div>
      ) : (
        <Flippable3DCard
          isFlipped={isFlipped}
          enableOverdrive={isOverdrive}
          onFlipToggle={(flipped) => setViewMode(flipped ? 'qr' : 'talisman')}
          front={
            <div
              className={`w-full rounded-[36px] p-6 liquid-glass-card shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden min-h-[410px] border border-white/70 dark:border-white/20 ${
                dimension === 'solaris'
                  ? 'ring-2 ring-lime-400/40 bg-zinc-950/90'
                  : dimension === 'abyss'
                  ? 'ring-2 ring-cyan-400/40 bg-slate-950/90'
                  : dimension === 'chromium'
                  ? 'ring-2 ring-purple-400/40 bg-zinc-900/90'
                  : ''
              }`}
              style={{
                backgroundColor: style.backdropColor ? `${style.backdropColor}` : undefined,
                backgroundImage: style.backdropGradient
                  ? `linear-gradient(${style.backdropGradient.angle}deg, ${style.backdropGradient.stops[0]}, ${style.backdropGradient.stops[1]})`
                  : undefined,
              }}
            >
              {/* Topographic Bathymetry Laser-Etched Watermark */}
              <div className="absolute top-3 right-4 font-mono text-[8px] tracking-[0.3em] text-[var(--color-text-tertiary)] opacity-40 uppercase select-none pointer-events-none">
                COORD // 18.9220°N · 72.8347°E
              </div>

              {/* Top Identity Atoll Bar */}
              <div className="flex items-center justify-between w-full z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl liquid-glass flex items-center justify-center text-[var(--color-accent)] font-bold text-xs shadow-xs border border-white/40 dark:border-white/10 font-mono">
                    {card.company ? card.company[0].toUpperCase() : 'P'}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] font-mono tracking-widest uppercase opacity-60 text-[var(--color-text-tertiary)]">
                      ENTERPRISE ATOLL
                    </span>
                    <span className="block text-xs font-bold tracking-tight uppercase truncate max-w-[150px] text-[var(--color-text-primary)]">
                      {card.company || BRAND.name}
                    </span>
                  </div>
                </div>

                {/* Verified Airgap Sovereign Chip */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-semibold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AIRGAP_SEALED</span>
                </div>
              </div>

              {/* Center Monolith Artifact */}
              <div className="my-auto py-4 flex flex-col items-center text-center space-y-3.5 z-10">
                {/* Biometric Avatar with Orbital Compass Rings */}
                <div className="relative p-1.5 rounded-full liquid-glass shadow-xl border border-white/60 dark:border-white/20">
                  <Avatar
                    src={photoDataUrl}
                    name={fullName || 'Sovereign'}
                    size="xl"
                    className="w-22 h-22 text-2xl font-bold font-serif"
                  />
                  {/* Orbital Crosshairs */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[var(--color-accent)] opacity-40 pointer-events-none animate-spin [animation-duration:35s]" />
                </div>

                <div className="space-y-1 w-full px-2">
                  <h2
                    className="text-2xl sm:text-3xl font-bold font-serif tracking-tight truncate drop-shadow-xs"
                    style={{ color: style.captionColor || 'var(--color-text-primary)' }}
                  >
                    {fullName}
                  </h2>

                  {(card.jobTitle || card.company) && (
                    <p
                      className="text-xs font-mono tracking-wider uppercase opacity-85"
                      style={{ color: style.captionColor || 'var(--color-text-secondary)' }}
                    >
                      {[card.jobTitle, card.company].filter(Boolean).join(' // ')}
                    </p>
                  )}

                  {card.location && (
                    <p className="inline-flex items-center gap-1 text-[11px] font-mono opacity-70 pt-0.5 text-[var(--color-text-tertiary)]">
                      <Compass className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
                      <span>{card.location}</span>
                    </p>
                  )}
                </div>

                {/* Direct Micro-Transceiver Port Links (Direct on Talisman) */}
                <div
                  className="flex items-center justify-center gap-2 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {card.phone && (
                    <a
                      href={`tel:${card.phone}`}
                      onClick={() => archipelagoAudio.playClick()}
                      aria-label="Direct voice call"
                      className="px-3 py-2 rounded-xl liquid-glass-button text-[var(--color-accent)] hover:scale-105 active:scale-95 shadow-xs transition-all flex items-center gap-1.5 text-2xs font-mono font-semibold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>VOICE</span>
                    </a>
                  )}
                  {card.email && (
                    <a
                      href={`mailto:${card.email}`}
                      onClick={() => archipelagoAudio.playClick()}
                      aria-label="Dispatch packet email"
                      className="px-3 py-2 rounded-xl liquid-glass-button text-[var(--color-accent)] hover:scale-105 active:scale-95 shadow-xs transition-all flex items-center gap-1.5 text-2xs font-mono font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>DISPATCH</span>
                    </a>
                  )}
                  {card.website && (
                    <a
                      href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                      onClick={() => archipelagoAudio.playClick()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open web portal"
                      className="px-3 py-2 rounded-xl liquid-glass-button text-[var(--color-accent)] hover:scale-105 active:scale-95 shadow-xs transition-all flex items-center gap-1.5 text-2xs font-mono font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>PORTAL</span>
                    </a>
                  )}
                  {card.whatsapp && (
                    <a
                      href={`https://wa.me/${card.whatsapp.replace(/\D/g, '')}`}
                      onClick={() => archipelagoAudio.playClick()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open secure wire"
                      className="px-3 py-2 rounded-xl liquid-glass-button text-emerald-600 dark:text-emerald-400 hover:scale-105 active:scale-95 shadow-xs transition-all flex items-center gap-1.5 text-2xs font-mono font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WIRE</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom Talisman Horizon */}
              <div className="flex items-center justify-between w-full pt-3 border-t border-black/5 dark:border-white/10 text-[10px] font-mono opacity-80 z-10">
                <span className="tracking-wider">ATOLL // IDENTITY_GLYPH</span>
                <span className="font-semibold text-[var(--color-accent)] tracking-wider flex items-center gap-1">
                  <span>FLIP TO QR</span>
                  <span>↻</span>
                </span>
              </div>
            </div>
          }
          back={
            <div
              className="w-full rounded-[36px] p-6 liquid-glass-card shadow-2xl transition-all flex flex-col justify-between items-center relative overflow-hidden min-h-[410px] border border-white/70 dark:border-white/20"
              style={{
                backgroundColor: style.backdropColor ? `${style.backdropColor}` : undefined,
                backgroundImage: style.backdropGradient
                  ? `linear-gradient(${style.backdropGradient.angle}deg, ${style.backdropGradient.stops[0]}, ${style.backdropGradient.stops[1]})`
                  : undefined,
              }}
            >
              {/* Top Singularity Header */}
              <div className="flex items-center justify-between w-full z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
                  <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    PHOTONIC_CORE // APERTURE
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    archipelagoAudio.playScanSweep();
                    navigate('/qr/fullscreen');
                  }}
                  aria-label="View QR in fullscreen"
                  className="p-2 rounded-xl liquid-glass-button text-[var(--color-accent)] active:scale-95 shadow-xs flex items-center gap-1 text-2xs font-mono font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>EXPAND</span>
                </button>
              </div>

              {/* Optical Prism Plate housing the QR Singularity */}
              <div className="relative p-4 rounded-3xl bg-white/95 dark:bg-white/95 shadow-[0_16px_40px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,1)] border border-white/80 my-auto group">
                <canvas
                  ref={canvasRef}
                  className="w-56 h-56 sm:w-60 sm:h-60 rounded-2xl shadow-xs"
                />
                {/* Laser Scan Line Sweep */}
                <div className="absolute inset-x-4 top-4 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              </div>

              {/* Bottom QR Caption & Reversal Cues */}
              <div className="w-full text-center space-y-0.5 pt-1 z-10">
                <p className="text-xs font-bold font-serif text-[var(--color-text-primary)] truncate">
                  {fullName}
                </p>
                <p className="text-[10px] font-mono font-semibold text-[var(--color-accent)] tracking-wider">
                  [ ↶ REVERSE TO TALISMAN ]
                </p>
              </div>
            </div>
          }
        />
      )}

      {/* 4. ARCHIPELAGO DIMENSION AURA SELECTOR */}
      <div className="flex items-center justify-between px-1 text-2xs font-mono text-[var(--color-text-secondary)]">
        <span className="tracking-widest uppercase opacity-70">AURA_DIMENSION:</span>
        <div className="flex items-center gap-1.5">
          {(['obsidian', 'solaris', 'abyss', 'chromium'] as DimensionMode[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDimensionChange(d)}
              className={`px-2 py-0.5 rounded-lg uppercase tracking-wider text-[9px] transition-all ${
                dimension === d
                  ? 'bg-[var(--color-accent)] text-white font-bold shadow-xs'
                  : 'liquid-glass text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {d === 'obsidian' ? 'VOID' : d === 'solaris' ? 'ACID' : d === 'abyss' ? 'ABYSS' : 'CHROME'}
            </button>
          ))}
        </div>
      </div>

      {/* 5. PRIMARY ARCHIPELAGO COMMAND STACK */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveContact}
          icon={<Download className="w-4 h-4 text-white" />}
          className="shadow-md font-mono text-xs tracking-wider"
        >
          INGEST .VCF RELIC
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            archipelagoAudio.playClick();
            navigate('/share');
          }}
          icon={<Share2 className="w-4 h-4 text-[var(--color-accent)]" />}
          className="font-mono text-xs tracking-wider"
        >
          BROADCAST ARTIFACT
        </Button>
      </div>

      {/* 6. SATELLITE ATOLLS (QUICK RELIC DOCK) */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => {
            archipelagoAudio.playClick();
            navigate('/wallet');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass-button active:scale-95 transition-all text-center gap-1.5 touch-target shadow-xs"
        >
          <Wallet className="w-5 h-5 text-[var(--color-accent)]" />
          <span className="text-[11px] font-mono font-semibold text-[var(--color-text-primary)] tracking-tight">Wallet Relic</span>
        </button>

        <button
          type="button"
          onClick={() => {
            archipelagoAudio.playClick();
            navigate('/wallpaper');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass-button active:scale-95 transition-all text-center gap-1.5 touch-target shadow-xs"
        >
          <Smartphone className="w-5 h-5 text-[var(--color-accent)]" />
          <span className="text-[11px] font-mono font-semibold text-[var(--color-text-primary)] tracking-tight">Lockscreen HUD</span>
        </button>

        <button
          type="button"
          onClick={() => {
            archipelagoAudio.playClick();
            navigate('/studio');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass-button active:scale-95 transition-all text-center gap-1.5 touch-target shadow-xs"
        >
          <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
          <span className="text-[11px] font-mono font-semibold text-[var(--color-text-primary)] tracking-tight">Matrix Alchemy</span>
        </button>
      </div>

      {/* 7. TELEMETRY MATRIX (INTERACTIVE CONTACT DIRECTORY) */}
      <section className="p-5 rounded-3xl liquid-glass-card space-y-3.5 border border-white/60 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[var(--color-accent)] animate-pulse" />
            <h3 className="text-2xs font-mono font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">
              TELEMETRY_DIRECTORY // NODES
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              archipelagoAudio.playClick();
              navigate('/editor');
            }}
            className="flex items-center gap-1.5 text-2xs font-mono font-bold text-[var(--color-accent)] hover:opacity-80 active:scale-95 liquid-glass px-2.5 py-1 rounded-lg"
          >
            <Edit3 className="w-3 h-3" />
            <span>RECONFIGURE</span>
          </button>
        </div>

        <div className="space-y-2 text-xs divide-y divide-black/5 dark:divide-white/5">
          {card.phone && (
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0 font-mono text-xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider">CHANNEL // VOICE</p>
                  <p className="font-semibold text-[var(--color-text-primary)] truncate font-mono">{card.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.phone!, 'phone', 'Phone')}
                aria-label="Copy phone number"
                className="p-2 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.email && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider">CHANNEL // PACKET_MAIL</p>
                  <p className="font-semibold text-[var(--color-text-primary)] truncate font-mono">{card.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.email!, 'email', 'Email')}
                aria-label="Copy email address"
                className="p-2 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.company && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider">ENTERPRISE // AFFILIATION</p>
                  <p className="font-semibold text-[var(--color-text-primary)] truncate">{card.company}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.company!, 'company', 'Company')}
                aria-label="Copy company name"
                className="p-2 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'company' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.jobTitle && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider">ROLE // DESIGNATION</p>
                  <p className="font-semibold text-[var(--color-text-primary)] truncate">{card.jobTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.jobTitle!, 'title', 'Title')}
                aria-label="Copy job title"
                className="p-2 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.website && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider">GATEWAY // WEB_PORTAL</p>
                  <p className="font-semibold text-[var(--color-text-primary)] truncate font-mono">{card.website}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.website!, 'website', 'Website')}
                aria-label="Copy website URL"
                className="p-2 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'website' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.location && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider">GEOGRAPHY // COORDINATES</p>
                  <p className="font-semibold text-[var(--color-text-primary)] truncate">{card.location}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.location!, 'location', 'Location')}
                aria-label="Copy location"
                className="p-2 rounded-xl liquid-glass-button text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'location' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. CRAZY ARCHIPELAGO MANIFESTO MODAL ("WTF IS THIS APP?") */}
      {isManifestoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsManifestoOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[32px] p-6 bg-zinc-950/95 text-white border border-white/20 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[var(--color-accent)] animate-bounce" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                  ARCHIPELAGO // MANIFESTO
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManifestoOpen(false)}
                className="p-1 rounded-full text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
              <p className="font-bold text-white text-sm font-serif">
                "WTF is this artifact? Who designed this Archipelago?"
              </p>
              <p>
                In an era where every digital business card is a tracking vector, a cloud subscription trap, and a battery drain, <span className="text-[var(--color-accent)] font-semibold">Parichay (परिचय)</span> was architected as an unyielding, air-gapped monolith.
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 font-mono text-2xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PURE SOVEREIGNTY PROTOCOL</span>
                </div>
                <p className="text-zinc-400">
                  • 0 Cloud Databases. Zero tracking SDKs.<br />
                  • 100% Client-side cryptography & vCard 3.0 compilation.<br />
                  • Laser-accurate 3D physical monolith with synthetic Web Audio haptics.<br />
                  • Works indefinitely at sea, on airplanes, and during network blackouts.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 text-center space-y-2">
                <p className="text-2xs font-mono text-zinc-400">
                  {DEVELOPER_SIGNATURE}
                </p>
                <a
                  href={DEVELOPER_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent)] hover:underline"
                >
                  <span>{DEVELOPER_LINK}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsManifestoOpen(false)}
              className="mt-2"
            >
              ACKNOWLEDGE ARTIFACT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
