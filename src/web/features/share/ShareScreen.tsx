import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { useToast } from '@/web/components/ui/Toast';
import { ActionRow } from '@/web/components/ui/ActionRow';
import { Button } from '@/web/components/ui/Button';
import {
  generateHighResPNG,
  generatePrintCardPNG,
  generateStoryPNG,
  exportVCardFile,
  shareOrDownloadFile,
} from '@/web/lib/export';
import { clipboard, haptics } from '@/platform';
import {
  ArrowLeft,
  Image,
  CreditCard,
  Smartphone,
  Contact,
  Download,
  Loader2,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { BRAND } from '@/shared/brand';

export const ShareScreen: React.FC = () => {
  const { card, style, photoDataUrl } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeExport, setActiveExport] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!card) {
    navigate('/');
    return null;
  }

  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');

  const handleCopyDetails = async () => {
    haptics.impact('light');
    const details = [
      fullName,
      [card.jobTitle, card.company].filter(Boolean).join(' · '),
      card.phone ? `Phone: ${card.phone}` : null,
      card.email ? `Email: ${card.email}` : null,
      card.website ? `Website: ${card.website}` : null,
      card.location ? `Location: ${card.location}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    await clipboard.write(details);
    setCopiedText(true);
    toast('Contact details copied', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleExportPNG = async () => {
    try {
      setActiveExport('png');
      const pngUrl = await generateHighResPNG(card, style, null);
      await shareOrDownloadFile(pngUrl, `${card.firstName}-qr-1200px.png`, 'image/png');
      toast('PNG QR exported', 'success');
    } catch (e: any) {
      toast(e.message || 'Export failed', 'warning');
    } finally {
      setActiveExport(null);
    }
  };

  const handleExportPrintCard = async () => {
    try {
      setActiveExport('print');
      const printUrl = await generatePrintCardPNG(card, style, null);
      await shareOrDownloadFile(printUrl, `${card.firstName}-print-card-300dpi.png`, 'image/png');
      toast('Print card exported (300 DPI)', 'success');
    } catch (e: any) {
      toast(e.message || 'Export failed', 'warning');
    } finally {
      setActiveExport(null);
    }
  };

  const handleExportStory = async () => {
    try {
      setActiveExport('story');
      const storyUrl = await generateStoryPNG(card, style, null);
      await shareOrDownloadFile(storyUrl, `${card.firstName}-story-9x16.png`, 'image/png');
      toast('Story card exported', 'success');
    } catch (e: any) {
      toast(e.message || 'Export failed', 'warning');
    } finally {
      setActiveExport(null);
    }
  };

  const handleExportVCF = async () => {
    try {
      setActiveExport('vcf');
      await exportVCardFile(card, photoDataUrl);
      toast('.vcf contact file shared', 'success');
    } catch (e: any) {
      toast(e.message || 'Export failed', 'warning');
    } finally {
      setActiveExport(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] liquid-glass px-3 py-1.5 rounded-xl active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-base font-bold font-serif text-[var(--color-text-primary)]">
          Share &amp; Export
        </h1>
        <div className="w-12" />
      </div>

      {/* Hero Visual Share Card Mockup (Figma/Mobbin Pattern) */}
      <div className="p-5 rounded-3xl liquid-glass-card shadow-lg text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl liquid-glass mx-auto flex items-center justify-center text-[var(--color-accent)] shadow-xs">
          <Share2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-serif text-[var(--color-text-primary)]">
            Share Your Identity
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-xs mx-auto pt-0.5">
            Send an instant vCard, high-res graphic flyer, or direct plain-text snippet.
          </p>
        </div>

        {/* Primary Instant Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Button
            variant="primary"
            size="md"
            onClick={handleExportVCF}
            icon={
              activeExport === 'vcf' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Contact className="w-4 h-4 text-white" />
              )
            }
          >
            Send .vcf Card
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleCopyDetails}
            icon={copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[var(--color-accent)]" />}
          >
            {copiedText ? 'Copied!' : 'Copy Text'}
          </Button>
        </div>
      </div>

      {/* Export Formats Section */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] px-1">
          Graphics &amp; Document Formats
        </h3>

        <ActionRow
          icon={<Image className="w-5 h-5 text-[var(--color-accent)]" />}
          title="High-Res PNG QR"
          subtitle="1200 x 1200 px · Vector-crisp matrix in custom style"
          onClick={handleExportPNG}
          rightElement={
            activeExport === 'png' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-accent)]" />
            ) : (
              <Download className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            )
          }
        />

        <ActionRow
          icon={<CreditCard className="w-5 h-5 text-[var(--color-accent)]" />}
          title="Print-Ready Business Card"
          subtitle="1050 x 600 px · 300 DPI · Dual-panel typographic print"
          onClick={handleExportPrintCard}
          rightElement={
            activeExport === 'print' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-accent)]" />
            ) : (
              <Download className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            )
          }
        />

        <ActionRow
          icon={<Smartphone className="w-5 h-5 text-[var(--color-accent)]" />}
          title="Story Format (9:16)"
          subtitle="1080 x 1920 px · Fullscreen status & social story flyer"
          onClick={handleExportStory}
          rightElement={
            activeExport === 'story' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-accent)]" />
            ) : (
              <Download className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            )
          }
        />
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="p-4 rounded-2xl liquid-glass flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
        <ShieldCheck className="w-4 h-4 text-[var(--color-status-success)] shrink-0" />
        <span>Generated 100% on this phone. No upload, no cloud tracking.</span>
      </div>
    </div>
  );
};
