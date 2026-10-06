# Changelog

All notable changes to **Parichay** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] - 2026-10-05

### Added
- **iOS 27 Liquid Glass Design Architecture**:
  - Implemented high-class visionary liquid glass materials with dynamic optical refraction (`backdrop-filter: blur(28px-34px) saturate(180%-200%)`).
  - Double-rim specular edge highlights (`border-t border-white/95` and `border-b border-white/35`) and inner bevel catchlights (`inset 0 1.5px 1px rgba(255,255,255,0.95)`).
  - Floating iOS liquid glass dock navigation (`TabBar`) with active translucent glass pill indicator and spring haptics.
  - Sculpted liquid glass hero cards, buttons, and bottom modal sheets (`Sheet.tsx`).
- **Liquid Ambient Fluid Lighting Mesh (`LiquidAmbientBackground.tsx`)**:
  - Multi-chromatic organic ambient fluid orbs (terracotta ember, warm solar amber, twilight sapphire violet, aurora cyan) behind the entire app shell.
  - Soft Gaussian diffusion (85px-100px) and buttery 22s-28s drift keyframes with `prefers-reduced-motion` compliance.
  - Provides the essential refractive light gradients necessary for liquid glass to catch, bend, and refract light visibly with deep optical dimension.
  - Micro-tactile optical glass surface grain texture.
- **Master Next-Gen Liquid Glass Logo**:
  - Redesigned `public/logo.svg` and `public/icon.svg` as a 3D sculpted liquid glass squircle with refractive bevels and caustics.
  - Suspended molten amber-terracotta monogram fusing Latin **'P'**, Devanagari **'प'**, and the optical QR aperture ring.
  - Prismatic dispersion rim, specular lens glint, and realistic depth drop shadows.

---

## [1.0.1] - 2026-10-05

### Added
- **Developer Signature & Craftsman Credit**:
  - Main craftsman footer on Settings and standalone showcase/help pages credited to Omkar Kardile (`https://omkardile.is-a.dev/`).
  - Author metadata in `<head>` (`<meta name="author">`, `<link rel="author">`) and `package.json`.
  - Documentation and license credits updated to reflect the creator.
- **Native Gesture System**:
  - Smooth horizontal swipe gesture navigation between primary tabs (Card &harr; Studio &harr; Settings) with haptic feedback.
  - Pull-down swipe gesture to dismiss the Fullscreen QR code.
- **Native Capacitor Plugins**:
  - `@capacitor/status-bar`: Dynamic status bar style and color adapting between linen light theme, obsidian dark theme, and high-contrast fullscreen QR view.
  - `@capacitor/local-notifications`: 100% offline local push notifications for card creation alert, weekly/monthly backup reminders, and settings test trigger.
  - `@capacitor/app`: Hardware back-button handling on Android to dismiss open sheets and navigate back before minimizing.
  - Native splash screen auto-hide on app readiness.
- **In-Product Standalone Offline Pages**:
  - `/showcase`: Public product demonstration page featuring an interactive live sandbox that renders styled QR codes on-the-fly without saving data, style pack previews, 45+ font showcases, and privacy architecture proofs.
  - `/index-help`: Comprehensive offline help centre with instant client-side search across categorized guides, platform tabs (Android, iPhone, Web), and related topics.
- **Documentation Suite & Quality Gate**:
  - Complete `docs/` directory with `docs/README.md`, `ARCHITECTURE.md`, `TECHNICAL.md`, `DATA_MODEL.md`, `TESTING.md`, `SECURITY.md`, `PRIVACY.md`, `BUSINESS.md`, `USER_GUIDE.md`, `FAQ.md`, `TROUBLESHOOTING.md`, and `RELEASE.md`.
  - Added `npm run docs:check` to verify doc completeness, link integrity, and route alignment in the CI pipeline.
  - `THIRD_PARTY_LICENSES.md` and `CONTRIBUTING.md`.

---

## [1.0.0] - 2026-10-04

### Added
- **Core Identity & Engine**:
  - Name selection: Parichay ("One card. One scan. Nothing leaves your phone.").
  - Compact vCard 3.0 builder with RFC 6350 escaping and 75-octet multibyte UTF-8 folding.
  - Full vCard 3.0 exporter with sequential social labels and folded base64 photo.
  - Real-time QR payload density meter (green/amber/red status with 700-byte cap).
  - Deterministic `qrFingerprint` change detection with calm notification banner.
- **Privacy Architecture**:
  - Zero-network architecture with automated audit script (`npm run check:privacy`).
  - Strict Content Security Policy (`connect-src 'self'`, `form-action 'none'`).
  - `android:allowBackup="false"` and backup extraction rules excluding all storage from Google Cloud Auto-Backup.
- **Design System & Branding**:
  - Design tokens single source of truth (`design/tokens/tokens.json` &rarr; `tokens.css`).
  - Editorial typography pairing variable serif `Fraunces` with `Instrument Sans`.
  - Brand assets: wordmark, monogram, adaptive Android icons, splash screens, and OG image.
  - Figma-ready design package (`COMPONENTS.md`, `FIGMA_GUIDE.md`).
- **QR Style Studio**:
  - 17 handcrafted presets spanning Quiet & Editorial, Warm & Colourful, Cool & Fresh, and Social Profile styles.
  - Customizer with module shapes, finder eye shapes, colors, gradients, and center avatars.
  - Live optical scan reliability checker powered by `jsQR` and contrast analysis.
  - Self-hosted Fontsource library with Latin and Devanagari script support.
- **Exports & Integrations**:
  - High-resolution 1200px PNG and SVG QR exports.
  - 300 DPI print-ready standard business card generator (1050x600).
  - Story format (9:16) and Square format (1:1) card generators.
  - Dedicated 1080x1350 Wallet Pass image generator for Google Wallet ("Add from photo") and Apple Photos.
  - Lock-screen wallpaper generator with safe-zone alignment for clock and shortcuts.
- **Native Platform Projects**:
  - Capacitor 8 native Android and iOS scaffolding.
  - Custom in-repo native plugin `DeviceTools` (Kotlin for Android, Swift for iOS).
  - Direct lock-screen wallpaper application via Android `WallpaperManager`.
  - Scoped storage saves via Android MediaStore.
- **Testing Suite**:
  - 45 automated unit tests across normalizers, vCard compliance, QR matrix round-trips, font fallbacks, and layout geometry.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
