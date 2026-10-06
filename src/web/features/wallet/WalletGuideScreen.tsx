import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { generateWalletPassImage, type WalletImageResult } from '@/web/lib/wallet';
import { shareOrDownloadFile } from '@/web/lib/export';
import { DeviceTools } from '@/native/device-tools';
import { Button } from '@/web/components/ui/Button';
import { useToast } from '@/web/components/ui/Toast';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Apple,
  Sparkles,
} from 'lucide-react';

export const WalletGuideScreen: React.FC = () => {
  const { card } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [walletResult, setWalletResult] = useState<WalletImageResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!card) return;
    setIsGenerating(true);
    generateWalletPassImage(card)
      .then((res) => setWalletResult(res))
      .catch((e) => console.error('Wallet generation error:', e))
      .finally(() => setIsGenerating(false));
  }, [card]);

  if (!card) {
    navigate('/');
    return null;
  }

  const handleSaveImage = async () => {
    if (!walletResult) return;
    try {
      setIsSaving(true);
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      await shareOrDownloadFile(
        walletResult.pngDataUrl,
        `${card.firstName}-wallet-pass.png`,
        'image/png'
      );
      toast('Wallet pass image saved to gallery', 'success');
    } catch (e: any) {
      toast(e.message || 'Save failed', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenGoogleWallet = async () => {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    // Auto-save pass first so it's readily accessible in gallery
    if (walletResult) {
      shareOrDownloadFile(
        walletResult.pngDataUrl,
        `${card.firstName}-wallet-pass.png`,
        'image/png'
      ).catch(() => {});
    }

    const res = await DeviceTools.openGoogleWallet();
    if (res.success) {
      toast('Launching Google Wallet... Select "Add to Wallet → Photo"', 'info');
    } else {
      toast('Google Wallet opened. In Wallet, tap "Add to Wallet → Photo"', 'info');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-6 pb-24 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-base font-bold font-serif text-[var(--color-text-primary)]">
          Google &amp; Apple Wallet
        </h1>
        <div className="w-12" />
      </div>

      {/* Live Pass Preview */}
      <div className="flex flex-col items-center">
        <div className="w-60 h-76 rounded-3xl overflow-hidden border border-[var(--color-border-hairline)] shadow-xl bg-white flex items-center justify-center p-1">
          {walletResult ? (
            <img
              src={walletResult.pngDataUrl}
              alt="Wallet Pass Preview"
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="text-xs text-[var(--color-text-tertiary)] flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)] animate-spin" />
              <span>Generating pass...</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Wallet Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          fullWidth
          variant="primary"
          onClick={handleOpenGoogleWallet}
          disabled={!walletResult}
          icon={<ExternalLink className="w-4 h-4 text-white" />}
        >
          Add to Google Wallet
        </Button>

        <Button
          fullWidth
          variant="secondary"
          onClick={handleSaveImage}
          disabled={!walletResult || isSaving}
          icon={<Download className="w-4 h-4 text-[var(--color-accent)]" />}
        >
          Save Pass Image
        </Button>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="space-y-4">
        {/* Android Steps */}
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Android · Google Wallet Integration
            </h2>
          </div>
          <ol className="text-xs text-[var(--color-text-secondary)] space-y-2 list-decimal list-inside leading-relaxed">
            <li>Tap <strong>Add to Google Wallet</strong> above (saves pass &amp; opens app).</li>
            <li>In Google Wallet, tap <strong>Add to Wallet &rarr; Photo</strong>.</li>
            <li>Choose the pass photo from your <strong>Parichay</strong> gallery album.</li>
            <li>Google Wallet permanently renders your offline card tile with quick barcode access!</li>
          </ol>
        </section>

        {/* iOS Steps */}
        <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-3">
          <div className="flex items-center gap-2">
            <Apple className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              iPhone · Apple Photos &amp; Wallet
            </h2>
          </div>
          <ol className="text-xs text-[var(--color-text-secondary)] space-y-2 list-decimal list-inside leading-relaxed">
            <li>Tap <strong>Save Pass Image</strong> to save to Apple Photos.</li>
            <li>Open the image in the <strong>Photos</strong> app.</li>
            <li>Use the iOS Live Text icon or tap <strong>Add to Apple Wallet</strong> (iOS 16+).</li>
            <li>You can also keep it as a Lock Screen widget or in your Favourites album.</li>
          </ol>
        </section>

        {/* Privacy Note */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-surface-sunken)] border border-[var(--color-border-hairline)] flex items-start gap-2.5 text-2xs text-[var(--color-text-secondary)] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[var(--color-status-success)] shrink-0 mt-0.5" />
          <span>
            <strong>100% On-Device Integration:</strong> Cloud REST API issuance passes your card metadata through remote third-party servers. Parichay’s on-device barcode pass preserves the zero-network privacy guarantee.
          </span>
        </div>
      </div>
    </div>
  );
};
