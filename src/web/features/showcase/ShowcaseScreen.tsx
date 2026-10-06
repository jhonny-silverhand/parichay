import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderQRToCanvas } from '@/web/lib/qr-renderer';
import { buildCompactVCard } from '@/shared/vcard';
import { BUILTIN_PRESETS } from '@/web/lib/qr-style-presets';
import type { QRStyle } from '@/web/lib/qr-style-types';
import { BRAND } from '@/shared/brand';
import { CraftsmanFooter } from '@/web/components/ui/CraftsmanFooter';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import type { Card } from '@/shared/card';

export const ShowcaseScreen: React.FC = () => {
  const navigate = useNavigate();

  // Demo interactive sandbox state (Pure memory, stores nothing)
  const [demoName, setDemoName] = useState('Ananya Sharma');
  const [demoRole, setDemoRole] = useState('Product Designer');
  const [demoOrg, setDemoOrg] = useState('Atelier Studio');
  const [demoPhone, setDemoPhone] = useState('+91 98765 43210');
  const [selectedPresetId, setSelectedPresetId] = useState('terracotta');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeStyle: QRStyle =
    BUILTIN_PRESETS.find((p) => p.id === selectedPresetId) || BUILTIN_PRESETS[0];

  useEffect(() => {
    if (!canvasRef.current) return;

    const [first, ...rest] = demoName.trim().split(' ');
    const last = rest.join(' ');

    const sampleCard: Card = {
      id: 'demo-card-id',
      schemaVersion: 1,
      firstName: first || 'Demo',
      lastName: last || null,
      jobTitle: demoRole || null,
      company: demoOrg || null,
      phone: demoPhone || null,
      email: 'hello@example.com',
      website: 'https://example.com',
      location: null,
      linkedin: null,
      instagram: null,
      xHandle: null,
      whatsapp: null,
      photoPresent: false,
      qrInclude: {
        name: true,
        jobTitle: true,
        company: true,
        phone: true,
        email: true,
        website: true,
        location: false,
        linkedin: false,
        instagram: false,
        xHandle: false,
        whatsapp: false,
      },
      createdAt: '2026-10-05T00:00:00.000Z',
      updatedAt: '2026-10-05T00:00:00.000Z',
      qrFingerprint: 'demo',
    };

    const payload = buildCompactVCard(sampleCard);
    renderQRToCanvas({
      canvas: canvasRef.current,
      payload,
      style: activeStyle,
      size: 400,
      forceEccH: false,
    });
  }, [demoName, demoRole, demoOrg, demoPhone, activeStyle]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-12 animate-in fade-in pb-20">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[var(--color-border-hairline)] pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Parichay Logo" className="w-6 h-6 rounded-lg" />
          <span className="text-xs font-bold font-serif text-[var(--color-text-primary)]">
            {BRAND.name} Showcase
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 text-xs font-semibold text-[var(--color-accent)]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Offline · Zero Telemetry · Local Only</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[var(--color-text-primary)] tracking-tight leading-tight">
          A private digital business card<br className="hidden sm:inline" /> that lives only on your phone.
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
          Standard business card apps route your contacts and connections through cloud servers and tracking databases. Parichay encodes everything into an instant, self-contained offline vCard 3.0 optical code.
        </p>
      </section>

      {/* Interactive Live Demo Sandbox */}
      <section className="p-6 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              Live Interactive Engine
            </span>
            <h2 className="text-lg font-bold font-serif text-[var(--color-text-primary)]">
              Test Real Optical Generation
            </h2>
          </div>
          <span className="text-2xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-surface-sunken)] px-2.5 py-1 rounded-full border border-[var(--color-border-hairline)]">
            No data saved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-3.5">
            <div>
              <label className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={demoRole}
                  onChange={(e) => setDemoRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={demoOrg}
                  onChange={(e) => setDemoOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={demoPhone}
                onChange={(e) => setDemoPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:border-[var(--color-accent)]"
              />
            </div>

            {/* Presets */}
            <div>
              <label className="text-2xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                Style Preset
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {BUILTIN_PRESETS.slice(0, 6).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`px-2 py-1.5 rounded-lg border text-2xs font-medium truncate transition-all ${
                      selectedPresetId === preset.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold'
                        : 'border-[var(--color-border-hairline)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QR Render Preview Plate */}
          <div className="flex flex-col items-center justify-center p-4 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-hairline)]">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-white p-2">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
            </div>
            <p className="text-2xs text-[var(--color-text-tertiary)] mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Scannable by iPhone Camera, Google Lens &amp; Samsung</span>
            </p>
          </div>
        </div>
      </section>

      {/* How it Works in 3 Steps */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          How It Works · 3 Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Enter Details Locally</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Your name, phone numbers, email, and links are parsed with RFC-compliant vCard normalizers right in your browser.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Design Your Card</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Choose from 45+ self-hosted open-source typography fonts, fine-tuned dot geometry, corner eyes, and bespoke palettes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Share Offline Everywhere</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Present high-contrast fullscreen QR, save lock-screen wallpapers with clock safe zones, or add to Google &amp; Apple Wallet.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Architecture Proof */}
      <section className="p-6 rounded-3xl bg-[var(--color-obsidian)] border border-white/10 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="text-lg font-bold font-serif">Verifiable Privacy Architecture</h2>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          Unlike ordinary digital card services that require accounts, monthly subscriptions, and cloud database tracking:
        </p>
        <ul className="text-xs space-y-2 text-white/90">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            <strong>Zero Network Calls:</strong> The app enforces a strict Content Security Policy (`connect-src 'self'`).
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            <strong>Zero Telemetry or Analytics:</strong> No tracking SDKs (no Sentry, PostHog, Segment, Mixpanel, GA).
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            <strong>Zero Server Storage:</strong> Your data exists exclusively in device IndexedDB / Capacitor Preferences.
          </li>
        </ul>
      </section>

      {/* Platform Availability */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Platform Availability &amp; Distribution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Web &amp; PWA</span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Live
              </span>
            </div>
            <p className="text-2xs text-[var(--color-text-secondary)] leading-relaxed">
              Installable via Chrome &amp; Safari as a progressive web app with full offline Service Worker caching.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Android App</span>
              <span className="text-[10px] uppercase font-bold text-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-2 py-0.5 rounded-md">
                Capacitor Ready
              </span>
            </div>
            <p className="text-2xs text-[var(--color-text-secondary)] leading-relaxed">
              Compiled via Capacitor with native status bar, local notifications, and wallpaper manager integration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">iOS App</span>
              <span className="text-[10px] uppercase font-bold text-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-2 py-0.5 rounded-md">
                Capacitor Ready
              </span>
            </div>
            <p className="text-2xs text-[var(--color-text-secondary)] leading-relaxed">
              Swift Package Manager and Xcode workspace with native gesture handling and safe-area insets.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Showcase FAQ
        </h2>
        <div className="space-y-2">
          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-1">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)]">
              Does the person scanning need to install Parichay?
            </h3>
            <p className="text-2xs text-[var(--color-text-secondary)] leading-relaxed">
              No. The native camera app on iOS (Camera app) and Android (Google Lens / Camera) directly scans the vCard payload and prompts: "Add to Contacts".
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-1">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)]">
              What happens if my phone has no internet connection?
            </h3>
            <p className="text-2xs text-[var(--color-text-secondary)] leading-relaxed">
              Everything works 100% offline. The QR code generator, font renderers, and contact parser operate entirely on-device with zero network requests.
            </p>
          </div>
        </div>
      </section>

      {/* Craftsman Footer */}
      <CraftsmanFooter showVersion className="border-t border-[var(--color-border-hairline)] pt-8" />
    </div>
  );
};
