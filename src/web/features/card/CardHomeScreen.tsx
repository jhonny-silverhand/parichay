import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { renderQRToCanvas } from '@/web/lib/qr-renderer';
import { buildCompactVCard } from '@/shared/vcard';
import { exportVCardFile } from '@/web/lib/export';
import { Button } from '@/web/components/ui/Button';
import { PWAInstallButton } from '@/web/components/pwa/PWAInstallButton';
import { Avatar } from '@/web/components/ui/Avatar';
import { Flippable3DCard } from '@/web/components/card/Flippable3DCard';
import { CraftsmanFooter } from '@/web/components/ui/CraftsmanFooter';
import { useToast } from '@/web/components/ui/Toast';
import { clipboard, haptics } from '@/platform';
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
} from 'lucide-react';
import { BRAND } from '@/shared/brand';

export const CardHomeScreen: React.FC = () => {
  const { card, style, photoDataUrl, settings, saveSettings, qrHasChanged, acknowledgeQRChange } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
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

  // Render hero QR code
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
    return null;
  }

  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');

  const handleCopy = async (text: string, key: string, label: string) => {
    haptics.impact('light');
    await clipboard.write(text);
    setCopiedKey(key);
    toast(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveContact = async () => {
    haptics.impact('medium');
    try {
      await exportVCardFile(card, photoDataUrl);
      toast('Contact card saved (.vcf)', 'success');
    } catch {
      toast('Could not save contact card', 'warning');
    }
  };

  const toggleTheme = () => {
    haptics.impact('light');
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings({ theme: nextTheme });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Parichay Logo"
            className="w-9 h-9 rounded-xl shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold font-serif text-[var(--color-text-primary)] leading-tight">
                {BRAND.name}
              </h1>
              <span className="text-xs font-serif opacity-60 text-[var(--color-text-tertiary)]">
                · परिचय
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] font-sans">
              Private offline business card
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Celestial Diurnal Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2.5 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target active:scale-95 transition-all shadow-xs"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--color-accent)]" />
            )}
          </button>
          <PWAInstallButton />
        </div>
      </header>

      {/* QR Changed Notice Banner */}
      {qrHasChanged && (
        <div className="p-3.5 rounded-2xl liquid-glass border border-amber-500/40 flex items-start gap-3 text-xs text-[var(--color-text-primary)] animate-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Card details changed</p>
            <p className="text-amber-800/80 dark:text-amber-300/80 leading-relaxed text-2xs">
              Your QR code has been updated with your new details.
            </p>
            <button
              onClick={acknowledgeQRChange}
              className="text-2xs font-semibold text-amber-900 dark:text-amber-200 underline mt-0.5"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* 2. Card / QR Segmented Control */}
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex p-1 rounded-2xl liquid-glass border border-black/5 dark:border-white/10 shadow-xs">
          <button
            type="button"
            onClick={() => {
              haptics.impact('light');
              setIsFlipped(false);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all select-none ${
              !isFlipped
                ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] shadow-sm font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Card
          </button>
          <button
            type="button"
            onClick={() => {
              haptics.impact('light');
              setIsFlipped(true);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all select-none ${
              isFlipped
                ? 'bg-white dark:bg-white/15 text-[var(--color-text-primary)] shadow-sm font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            QR Code
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            haptics.impact('light');
            setIsFlipped((f) => !f);
          }}
          className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95 transition-all px-3 py-1.5 rounded-xl liquid-glass shadow-xs"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Flip Card</span>
        </button>
      </div>

      {/* 3. Minimalist 3D Business Card */}
      <Flippable3DCard
        isFlipped={isFlipped}
        onFlipToggle={setIsFlipped}
        front={
          <div
            className="w-full rounded-[32px] p-6 liquid-glass-card shadow-lg transition-all flex flex-col justify-between relative overflow-hidden min-h-[390px] border border-white/60 dark:border-white/10"
            style={{
              backgroundColor: style.backdropColor ? `${style.backdropColor}` : undefined,
              backgroundImage: style.backdropGradient
                ? `linear-gradient(${style.backdropGradient.angle}deg, ${style.backdropGradient.stops[0]}, ${style.backdropGradient.stops[1]})`
                : undefined,
            }}
          >
            {/* Top Monogram / Organization Bar */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg liquid-glass flex items-center justify-center text-[var(--color-accent)] font-bold text-xs shadow-xs font-serif">
                  {card.company ? card.company[0].toUpperCase() : 'P'}
                </div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] truncate max-w-[200px]">
                  {card.company || BRAND.name}
                </span>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--color-text-tertiary)]">
                Offline
              </span>
            </div>

            {/* Center Identity Section */}
            <div className="my-auto py-4 flex flex-col items-center text-center space-y-3">
              <Avatar
                src={photoDataUrl}
                name={fullName || 'User'}
                size="xl"
                className="w-20 h-20 text-2xl font-bold font-serif shadow-md border-2 border-white/80 dark:border-white/20"
              />

              <div className="space-y-1 w-full px-2">
                <h2
                  className="text-2xl font-bold font-serif tracking-tight truncate"
                  style={{ color: style.captionColor || 'var(--color-text-primary)' }}
                >
                  {fullName}
                </h2>

                {(card.jobTitle || card.company) && (
                  <p
                    className="text-xs font-medium text-[var(--color-text-secondary)]"
                    style={{ color: style.captionColor || 'var(--color-text-secondary)' }}
                  >
                    {[card.jobTitle, card.company].filter(Boolean).join(' · ')}
                  </p>
                )}

                {card.location && (
                  <p className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)] pt-0.5">
                    <MapPin className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
                    <span>{card.location}</span>
                  </p>
                )}
              </div>

              {/* Direct Communication Quick Links */}
              <div
                className="flex items-center justify-center gap-2 pt-1 flex-wrap"
                onClick={(e) => e.stopPropagation()}
              >
                {card.phone && (
                  <a
                    href={`tel:${card.phone}`}
                    aria-label="Call phone number"
                    className="px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] active:scale-95 shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>Call</span>
                  </a>
                )}
                {card.email && (
                  <a
                    href={`mailto:${card.email}`}
                    aria-label="Send email"
                    className="px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] active:scale-95 shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>Email</span>
                  </a>
                )}
                {card.website && (
                  <a
                    href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit website"
                    className="px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] active:scale-95 shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>Website</span>
                  </a>
                )}
                {card.whatsapp && (
                  <a
                    href={`https://wa.me/${card.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open WhatsApp chat"
                    className="px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-[var(--color-text-primary)] hover:text-emerald-500 active:scale-95 shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between w-full pt-3 border-t border-black/5 dark:border-white/10 text-xs text-[var(--color-text-tertiary)]">
              <span>Personal Business Card</span>
              <span className="text-[var(--color-accent)] font-medium flex items-center gap-1">
                <span>View QR</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>
        }
        back={
          <div
            className="w-full rounded-[32px] p-6 liquid-glass-card shadow-lg transition-all flex flex-col justify-between items-center relative overflow-hidden min-h-[390px] border border-white/60 dark:border-white/10"
            style={{
              backgroundColor: style.backdropColor ? `${style.backdropColor}` : undefined,
              backgroundImage: style.backdropGradient
                ? `linear-gradient(${style.backdropGradient.angle}deg, ${style.backdropGradient.stops[0]}, ${style.backdropGradient.stops[1]})`
                : undefined,
            }}
          >
            {/* Top QR Bar */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                Scan with any phone camera
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/qr/fullscreen');
                }}
                aria-label="View QR in fullscreen"
                className="p-1.5 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95 shadow-xs flex items-center gap-1 text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* High-Contrast QR Code Plate */}
            <div className="p-3.5 rounded-2xl bg-white shadow-md border border-black/5 my-auto">
              <canvas
                ref={canvasRef}
                className="w-52 h-52 sm:w-56 sm:h-56 rounded-xl"
              />
            </div>

            {/* Bottom QR Caption */}
            <div className="w-full text-center space-y-0.5 pt-1">
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                {fullName}
              </p>
              <p className="text-2xs text-[var(--color-accent)] font-medium">
                Tap card to flip back
              </p>
            </div>
          </div>
        }
      />

      {/* 4. Primary Actions */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveContact}
          icon={<Download className="w-4 h-4 text-white" />}
          className="shadow-sm font-medium"
        >
          Save Contact (.vcf)
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/share')}
          icon={<Share2 className="w-4 h-4 text-[var(--color-accent)]" />}
          className="font-medium"
        >
          Share Card
        </Button>
      </div>

      {/* 5. Utility Docks */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/wallet')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass active:scale-95 transition-all text-center gap-1.5 touch-target shadow-xs"
        >
          <Wallet className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-xs font-medium text-[var(--color-text-primary)]">Wallet Pass</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/wallpaper')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass active:scale-95 transition-all text-center gap-1.5 touch-target shadow-xs"
        >
          <Smartphone className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-xs font-medium text-[var(--color-text-primary)]">Wallpaper</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/studio')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass active:scale-95 transition-all text-center gap-1.5 touch-target shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-xs font-medium text-[var(--color-text-primary)]">Customize</span>
        </button>
      </div>

      {/* 6. Contact Details List */}
      <section className="p-4 rounded-3xl liquid-glass border border-black/5 dark:border-white/10 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
          <h3 className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Contact Information
          </h3>

          <button
            type="button"
            onClick={() => navigate('/editor')}
            className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:opacity-80 active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-2 text-xs divide-y divide-black/5 dark:divide-white/5">
          {card.phone && (
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Phone</p>
                  <p className="font-medium text-[var(--color-text-primary)] truncate">{card.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.phone!, 'phone', 'Phone number')}
                aria-label="Copy phone number"
                className="p-2 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.email && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Email</p>
                  <p className="font-medium text-[var(--color-text-primary)] truncate">{card.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.email!, 'email', 'Email address')}
                aria-label="Copy email address"
                className="p-2 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.company && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Company</p>
                  <p className="font-medium text-[var(--color-text-primary)] truncate">{card.company}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.company!, 'company', 'Company')}
                aria-label="Copy company"
                className="p-2 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'company' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.jobTitle && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Job Title</p>
                  <p className="font-medium text-[var(--color-text-primary)] truncate">{card.jobTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.jobTitle!, 'title', 'Job title')}
                aria-label="Copy job title"
                className="p-2 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.website && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Website</p>
                  <p className="font-medium text-[var(--color-text-primary)] truncate">{card.website}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.website!, 'website', 'Website URL')}
                aria-label="Copy website URL"
                className="p-2 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'website' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {card.location && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--color-accent)] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Location</p>
                  <p className="font-medium text-[var(--color-text-primary)] truncate">{card.location}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(card.location!, 'location', 'Location')}
                aria-label="Copy location"
                className="p-2 rounded-xl liquid-glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-95"
              >
                {copiedKey === 'location' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. Craftsman Signature Footer */}
      <CraftsmanFooter />
    </div>
  );
};
