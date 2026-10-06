import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CraftsmanFooter } from '@/web/components/ui/CraftsmanFooter';
import {
  ArrowLeft,
  Search,
  BookOpen,
  QrCode,
  Share2,
  Wallet,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  Apple,
  Globe,
} from 'lucide-react';

interface HelpGuide {
  id: string;
  category: string;
  title: string;
  summary: string;
  steps: {
    general?: string[];
    android?: string[];
    ios?: string[];
    web?: string[];
  };
  related: string[];
}

const HELP_GUIDES: HelpGuide[] = [
  {
    id: 'create-card',
    category: 'Getting Started',
    title: 'Creating and Editing Your Card',
    summary: 'How to enter your name, contact numbers, and photo to generate your first vCard.',
    steps: {
      android: [
        'Open the Card tab and tap "Edit Card".',
        'Enter your First Name, Last Name, Job Title, and Organization.',
        'Add primary phone and email. Optional: upload an avatar photo.',
        'Tap "Save Card" — your offline QR updates instantly.',
      ],
      ios: [
        'Open the Card tab and tap "Edit Card".',
        'Fill in your contact information and select an avatar photo from your library.',
        'Tap "Save Card" — local storage updates in place.',
      ],
      web: [
        'Fill in your details during onboarding or via Edit Card.',
        'Changes are stored in your browser IndexedDB.',
      ],
    },
    related: ['style-qr', 'share-qr'],
  },
  {
    id: 'style-qr',
    category: 'QR & Styling',
    title: 'Customizing QR Geometry, Fonts & Colors',
    summary: 'Pick from 45+ self-hosted typography fonts, dot shapes, and eye styles.',
    steps: {
      android: [
        'Navigate to the Studio tab in the bottom bar.',
        'Tap any Style Preset (e.g. Terracotta Ember, Obsidian Gold, Editorial).',
        'Customize font family, dot shape (dots, rounded, squares), and center icon.',
        'All preview renders update live at 60 FPS without network downloads.',
      ],
      ios: [
        'Open the Studio tab.',
        'Select your preferred color palette and typography.',
        'Verify contrast ratio in preview — pure white plates ensure maximum readability.',
      ],
      web: [
        'Select from 45+ Google & Devanagari open source typography families.',
        'Styles are saved immediately to local storage.',
      ],
    },
    related: ['create-card', 'wallpaper'],
  },
  {
    id: 'wallet',
    category: 'Wallet Integration',
    title: 'Adding Pass to Google Wallet or Apple Wallet',
    summary: 'How to create a photo pass and launch Google Wallet or Apple Photos directly.',
    steps: {
      android: [
        'Open Card &rarr; Save to Wallet.',
        'Tap "Add to Google Wallet" — this saves the 1080x1350 pass photo to your gallery and launches Google Wallet.',
        'In Google Wallet, choose "Add to Wallet &rarr; Photo" and pick the card.',
        'The card is now permanently stored in your Google Wallet carousel.',
      ],
      ios: [
        'Open Card &rarr; Save to Wallet.',
        'Tap "Save Pass Image" to store in Apple Photos.',
        'Open Apple Photos, view the pass image, and tap "Add to Apple Wallet" or save to Favorites.',
      ],
      web: [
        'Download the wallet pass image.',
        'Import or sync with your mobile device or print as a physical badge.',
      ],
    },
    related: ['wallpaper', 'share-qr'],
  },
  {
    id: 'wallpaper',
    category: 'Lock-Screen Wallpaper',
    title: 'Setting a Lock-Screen QR Wallpaper',
    summary: 'Generate an aspect-ratio-matched wallpaper with clock and notch safe zones.',
    steps: {
      android: [
        'From the Card screen, tap "Lock Screen Wallpaper".',
        'Choose a backdrop theme (Card Style, Charcoal, Navy, or Warm).',
        'Tap "Set Lock Screen (Android Native)" to apply directly.',
        'Alternatively, tap "Lock + Home" or "System Picker" if your phone manufacturer uses custom themes.',
      ],
      ios: [
        'Tap "Save Wallpaper Image (iOS & Gallery)".',
        'Open iOS Settings &rarr; Wallpaper &rarr; Add New Wallpaper &rarr; Photos.',
        'Select the wallpaper image and tap "Set as Wallpaper Pair".',
      ],
      web: [
        'Download the wallpaper PNG to transfer to your mobile device.',
      ],
    },
    related: ['style-qr', 'wallet'],
  },
  {
    id: 'backup-privacy',
    category: 'Backup & Privacy',
    title: 'Exporting & Restoring Offline Backups',
    summary: 'Save an encrypted JSON copy of your business card or migrate between devices.',
    steps: {
      android: [
        'Go to Settings &rarr; Export Card Backup (.json).',
        'Save the file securely to your device or offline drive.',
        'To restore on another device, use "Import Card Backup" and select the file.',
      ],
      ios: [
        'Tap "Export Card Backup (.json)" in Settings and save to iCloud Drive or Files.',
        'Use "Import Card Backup" anytime to restore your data.',
      ],
      web: [
        'Export backup downloads the JSON file directly.',
        'To restore, select the JSON file via the import button.',
      ],
    },
    related: ['create-card', 'troubleshooting'],
  },
  {
    id: 'troubleshooting',
    category: 'Troubleshooting',
    title: 'QR Scanning & Platform Quirks',
    summary: 'Fixes for scan distance, contrast, and vendor lock-screen overrides.',
    steps: {
      general: [
        'If cameras struggle to read: tap "Fullscreen QR" on the Card tab to maximize contrast and brightness.',
        'Avoid low-contrast color combinations (light dots on light background).',
        'Ensure the phone camera lens is clean and hold the scanner ~15cm (6 inches) away.',
        'On Samsung One UI / Xiaomi MIUI: if programmatic wallpaper fails, use the "System Picker" button.',
      ],
    },
    related: ['wallpaper', 'style-qr'],
  },
];

export const HelpScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<'android' | 'ios' | 'web'>('android');

  const selectedGuide = HELP_GUIDES.find((g) => g.id === selectedGuideId);

  const filteredGuides = HELP_GUIDES.filter((guide) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      guide.title.toLowerCase().includes(q) ||
      guide.summary.toLowerCase().includes(q) ||
      guide.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24 animate-in fade-in">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[var(--color-border-hairline)] pb-4">
        <button
          onClick={() => {
            if (selectedGuideId) {
              setSelectedGuideId(null);
            } else {
              navigate('/settings');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{selectedGuideId ? 'All Help Guides' : 'Settings'}</span>
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
          <h1 className="text-xs font-bold font-serif text-[var(--color-text-primary)]">
            Help &amp; Offline Manual
          </h1>
        </div>
      </header>

      {/* Detail Guide View */}
      {selectedGuide ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {selectedGuide.category}
            </span>
            <h2 className="text-xl font-bold font-serif text-[var(--color-text-primary)] mt-1">
              {selectedGuide.title}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              {selectedGuide.summary}
            </p>
          </div>

          {/* Platform Switcher Tabs */}
          {selectedGuide.steps.android && (
            <div className="flex rounded-xl bg-[var(--color-bg-surface)] p-1 border border-[var(--color-border-hairline)]">
              <button
                onClick={() => setActivePlatformTab('android')}
                className={`flex-1 py-1.5 text-2xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activePlatformTab === 'android'
                    ? 'bg-[var(--color-accent)] text-white shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('ios')}
                className={`flex-1 py-1.5 text-2xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activePlatformTab === 'ios'
                    ? 'bg-[var(--color-accent)] text-white shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iOS</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('web')}
                className={`flex-1 py-1.5 text-2xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activePlatformTab === 'web'
                    ? 'bg-[var(--color-accent)] text-white shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web / PWA</span>
              </button>
            </div>
          )}

          {/* Guide Steps */}
          <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Step-by-Step Instructions
            </h3>
            <ol className="text-xs text-[var(--color-text-secondary)] space-y-2.5 list-decimal list-inside leading-relaxed">
              {(
                selectedGuide.steps[activePlatformTab] ||
                selectedGuide.steps.general ||
                []
              ).map((step, idx) => (
                <li key={idx} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Related Guides */}
          {selectedGuide.related.length > 0 && (
            <div className="space-y-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Related Topics
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedGuide.related.map((relId) => {
                  const relGuide = HELP_GUIDES.find((g) => g.id === relId);
                  if (!relGuide) return null;
                  return (
                    <button
                      key={relId}
                      onClick={() => setSelectedGuideId(relId)}
                      className="p-3 text-left rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] hover:border-[var(--color-accent)] text-xs text-[var(--color-text-primary)] font-semibold transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{relGuide.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Guides List View with Search */
        <div className="space-y-5">
          {/* Offline Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--color-text-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, Wallet, QR, offline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-hidden focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Categorized List */}
          <div className="space-y-2.5">
            {filteredGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className="w-full p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] hover:border-[var(--color-accent)] text-left transition-all space-y-1 block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                    {guide.category}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                </div>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {guide.title}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                  {guide.summary}
                </p>
              </button>
            ))}

            {filteredGuides.length === 0 && (
              <div className="p-8 text-center text-xs text-[var(--color-text-tertiary)]">
                No offline guides matched "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtle Craftsman Footer */}
      <CraftsmanFooter showVersion className="border-t border-[var(--color-border-hairline)] pt-6" />
    </div>
  );
};
