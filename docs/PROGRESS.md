# Progress Log (PROGRESS.md)

Current status and roadmap of the Parichay autonomous build.

---

## Current Status: Completed (Stages 0 through 14 Verified)

### Stage 0: Environment & Setup
- [x] Node 22.23.2, npm 10.9.8, git initialized.
- [x] Docs directory created (`DECISIONS.md`, `PROGRESS.md`, `KNOWN_ISSUES.md`).
- [x] Metadata updated with non-placeholder name & description.

### Stage 1: Name and Brand
- [x] Name candidate generation, scoring, and selection in `docs/BRAND.md`.
- [x] Winner: **Parichay** ("One card. One scan. Nothing leaves your phone.").
- [x] Single source of truth in `src/shared/brand.ts`.
- [x] Brand asset generation (monogram, wordmark, app icon, splash screen, OG image).

### Stage 2: Locked Tech Stack & Dependencies
- [x] Dependencies installed (`qrcode`, `jsqr`, `zod`, `libphonenumber-js`, `idb-keyval`, `vite-plugin-pwa`, Capacitor 8 core/plugins).
- [x] Curated self-hosted Fontsource families installed offline.
- [x] Dev tools (`vitest`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`).

### Stage 3: Repo Structure & Configuration
- [x] TypeScript configuration and `@/*` path aliases.
- [x] Vite + PWA configuration with service worker precache.
- [x] Capacitor config (`capacitor.config.ts`).
- [x] CI workflow (`.github/workflows/ci.yml`).

### Stage 4: Design System & Tokens
- [x] `design/tokens/tokens.json` single source of truth.
- [x] Script `scripts/tokens-build.mjs` compiling to `src/web/styles/tokens.css`.
- [x] Editorial typography (`Fraunces` + `Instrument Sans`) and disciplined palette.
- [x] Hidden `/dev/styleguide` route.

### Stage 5: Figma-Ready Design Package
- [x] `design/figma/COMPONENTS.md` & `docs/FIGMA_GUIDE.md`.
- [x] Exported SVG components, brand marks, and layout specifications.

### Stage 6: Data, Storage & Core Logic
- [x] Zod schema & normalizers for card fields in `src/shared/card.ts` & `normalizers.ts`.
- [x] Dual storage adapter (Web IndexedDB / Native Preferences + Filesystem).
- [x] Compact vCard 3.0 builder for QR & rich vCard 3.0 builder for `.vcf`.
- [x] Live byte meter with 700-byte cap and static-QR change detector.
- [x] In-memory square crop & EXIF stripping pipeline in `src/web/lib/photo.ts`.

### Stage 7: QR Style Studio, Presets & Fonts
- [x] Canvas QR renderer (`src/web/lib/qr-renderer.ts`) with custom shapes, eyes, gradients, and center avatar.
- [x] Real-time jsQR optical scan validation and contrast checker in `src/web/lib/scan-check.ts`.
- [x] 17 handcrafted presets (Quiet & Editorial, Warm & Colourful, Cool & Fresh, Social-Profile).
- [x] Self-hosted font loader with non-Latin Devanagari fallback.

### Stage 8: Share, Wallet, Wallpaper & DeviceTools
- [x] High-Res PNG (1200px), SVG, print-ready card (1050x600), story, square, and .vcf exports.
- [x] Wallet pass image generation + guided instructions for Google & Apple Wallet.
- [x] Lock-screen wallpaper generator with safe-zone guides (top 32%, bottom 14%).
- [x] In-repo `DeviceTools` native plugin (Kotlin for Android, Swift for iOS, web fallback).

### Stage 9: Screen Flows & UX
- [x] Onboarding flow with identity, contact, photo crop, and live preview.
- [x] Card Home screen with hero QR, immediate primary actions, and secondary actions.
- [x] Comprehensive Card Editor with per-field QR toggles and draft autosave/restore.
- [x] Fullscreen QR mode with brightness and Screen Wake Lock.
- [x] QR Style Studio with live preview, preset selector, and fine controls.
- [x] Settings with Storage status, Backup/Restore, Fonts credits, Privacy policy, and Data Wipe.
- [x] Error boundary, storage recovery, and offline banner.

### Stage 10: Privacy Enforcement & Security
- [x] Strict Content Security Policy (`connect-src 'self'`, `form-action 'none'`).
- [x] Automated privacy check script (`npm run check:privacy`).
- [x] Unit test suite verifying zero external requests.
- [x] Complete `docs/PRIVACY.md` and in-app privacy screen.

### Stage 11: Capacitor Native Platforms
- [x] Capacitor Android & iOS project scaffolding (`npx cap add android`, `npx cap add ios`).
- [x] Kotlin DeviceTools implementation in Android `MainActivity`.
- [x] Swift DeviceTools implementation in iOS project.
- [x] Safe backup extraction rules (`allowBackup="false"`).
- [x] `npx cap sync` passes clean.

### Stage 12: Testing & Verification
- [x] 45 unit tests passing clean in Vitest (`npm run test`).
- [x] Round-trip QR encode -> decode -> vCard verify across presets.
- [x] TypeScript typecheck clean (`npm run lint`).
- [x] Production build clean (`npm run build`).
- [x] Complete verification suite (`npm run verify:all`).

### Stage 13: Documentation & Store Readiness
- [x] `README.md`, `CHANGELOG.md`, `docs/STORE.md`, `docs/SECURITY.md`.
- [x] Google Play Data safety and Apple App Privacy questionnaires completed.

### Stage 14: Polish Backlog & Automation
- [x] `docs/BACKLOG.md` with 25 prioritized follow-up tasks.
- [x] `scripts/polish-run.sh` and `scripts/verify-all`.
- [x] Automation documentation (`docs/AUTOMATION.md`).
- [x] Recurring scheduled verification job registered.

---

## App-Hardening Autonomous Roadmap (Branch: `app-hardening`)

- [x] **Step 0: System Audit & Baseline**
  - Audited Node (22.23.2), npm (10.9.8), Capacitor 8, toolchains in `docs/technical/audit.md`.
  - Initialized git branch `app-hardening` with baseline snapshot.
  - Installed missing Capacitor 8 plugins (`@capacitor/keyboard`, `@capacitor/network`, `@capacitor/device`, `@capacitor/screen-orientation`, `@capacitor/browser`, `@capacitor/clipboard`, `@capacitor/dialog`, `@capacitor/toast`, `@capacitor/action-sheet`).
- [x] **Step 1: The App Shell & Fit-to-Container System**
  - Fixed-screen `100dvh` root, `overflow: hidden`, zero body scroll.
  - Layout primitives: `AppShell`, `Screen`, `ScreenHeader`, `ScreenScroll`, `BottomBar`, `Stack`, `Inline`, `Grid`, `FillContainer`, `PullToRefresh`, `Sheet`, `Dialog`.
  - Safe-area variables `--safe-top/right/bottom/left`.
  - VisualViewport + Capacitor Keyboard input scroll-into-view.
  - Dev-only `/dev/layout-lab` route covering 320, 360, 390, 430, 768, 1024, landscape.
- [x] **Step 2: Navigation Architecture**
  - Tab navigator with edge swipe gestures between primary tabs.
  - Native animated transitions honoring reduced motion.
  - Android hardware/gesture back handling (`@capacitor/app`) with sheet auto-close and double-back confirmation.
  - iOS edge swipe-back gesture on subpages.
- [x] **Step 3: Platform Facade (`src/platform/`)**
  - Typed facade over all native capabilities: `haptics`, `share`, `clipboard`, `network`, `storage`, `files`, `notifications`, `browser`, `lifecycle`, `orientation`, `keyboard`, `statusBar`, `deviceInfo`, `permissions`, `dialog`, `toast`, `actionSheet`, `splash`.
  - Zero direct plugin imports from UI components.
  - Reusable permission warm-up flow in `permissions.ts`.
  - App lifecycle, connectivity banner (`NetworkBanner`), native splash auto-hide.
- [x] **Step 4: Libraries & Architecture**
  - Feature-sliced structure, typed env validation (`src/shared/env.ts`), Zod schemas.
  - Runtime ErrorBoundary (`src/web/components/ui/ErrorBoundary.tsx`) with recovery.
- [x] **Step 5: Design Language & UI Primitives**
  - Single source of truth design tokens, editorial typography (Fraunces + Instrument Sans).
  - UI primitives: Button, IconButton, Field, TextInput, Switch, Slider, Swatch, PresetTile, Sheet, Dialog, Toast, ActionSheet, Banner, Skeleton, EmptyState, PullToRefresh.
  - Interactive `/dev/styleguide` showcase route.
- [x] **Step 6: Guidelines (`docs/APP_GUIDELINES.md`)**
  - Native-safe coding rules, layout rules, bundle budget, accessibility.
  - Tooling enforcement via lint, privacy audit, docs check.
- [x] **Step 7: Security & Privacy Hardening**
  - Hardened CSP, local storage encryption, threat model in `docs/SECURITY.md`.
  - Zero-network privacy policy in `docs/PRIVACY.md` and store data safety in `docs/STORE.md`.
- [x] **Step 8: Containerization & CI**
  - Multi-stage `Dockerfile` with Nginx, gzip compression, CSP headers and healthcheck.
  - `docker-compose.yml`, `.dockerignore`, `.devcontainer/devcontainer.json`.
  - GitHub Actions CI workflow (`.github/workflows/ci.yml`).
- [x] **Step 9: Automated Testing & Specs**
  - 61 unit tests across 10 test suites in Vitest.
  - Platform facade test suite (`tests/platform-facade.test.ts`).
  - Author signature verification suite (`tests/author-signature.test.ts`).
  - App shell invariants suite (`tests/app-shell.test.ts`).
  - `npx cap doctor` verified with all 17 Capacitor plugins synchronized.
- [x] **Step 10: Complete Documentation & Signature**
  - All 26 documents complete and indexed in `docs/README.md`.
  - `npm run docs:check` passes with zero errors and zero broken links.
  - Standalone `/showcase` and `/index-help` offline pages.
  - Developer signature: "Designed & developed by Omkar Kardile" (`https://omkardile.is-a.dev/`).
- [x] **Step 11: Acceptance Run & Final Report**
  - All 5 release checks verified in `./scripts/verify-all`.

