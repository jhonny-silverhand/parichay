# System & Architecture Audit (audit.md)

**Audit Date**: October 2026  
**Auditor**: Senior Mobile & Web Application Engineer  
**Project**: Parichay (परिचय) — Store-Ready Capacitor 8 Mobile & Offline PWA  
**Branch**: `app-hardening`

---

## 1. Environment & Tooling Verification

| Component | Target Requirement | Detected Environment | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Node.js** | `>= 22.22.0` (Capacitor 8) | `v22.23.2` | **PASS** | Meets Capacitor 8 runtime requirement |
| **npm** | `>= 10.0.0` | `10.9.8` | **PASS** | Stable package manager |
| **Java / JDK** | Java 17 or 21 | Not installed in container | **HOST LIMITATION** | Native `./gradlew` execution requires external JDK or CI runner |
| **Android SDK** | SDK 36, build-tools 36.0.0 | Not configured in container | **HOST LIMITATION** | Android project files generated and synced; compiles via CI/Android Studio |
| **Xcode** | Xcode 26+, iOS 15+ SDK | macOS only (Linux kernel) | **HOST LIMITATION** | iOS SPM workspace generated; compiles via macOS runner |
| **Framework** | Static SPA (Vite 8 + React 19) | Vite 8 + React 19 + TS 7 | **PASS** | Static client compilation ideal for Capacitor |

---

## 2. Codebase Baseline & Inventory

### What We Keep
1. **Core Domain & Normalizers**:
   - RFC 6350 vCard 3.0 compact and full generation (`src/shared/vcard.ts`).
   - Phone and URI normalization via `libphonenumber-js` (`src/shared/normalizers.ts`).
   - Offline QR canvas rendering with eye shapes and center avatars (`src/web/lib/qr-renderer.ts`).
   - In-memory optical scan verification via `jsQR` (`src/web/lib/scan-check.ts`).
2. **Typography & Styling**:
   - 45+ self-hosted Fontsource families (`fonts.css`).
   - Single source of truth design tokens (`design/tokens/tokens.json` &rarr; `tokens.css`).
3. **Privacy Architecture**:
   - Zero external network dependencies, strict CSP (`connect-src 'self'`).
   - Static privacy audit script (`scripts/check-privacy.mjs`).
4. **Developer Attribution**:
   - "Designed & developed by Omkar Kardile" with author link `https://omkardile.is-a.dev/`.

### What We Change
1. **App Shell & Layout**:
   - Upgrade root viewport to `interactive-widget=resizes-content` with `touch-action: manipulation`.
   - Replace any lingering flex/grid gaps with fixed-screen, fit-to-container layout primitives (`AppShell`, `Screen`, `ScreenHeader`, `ScreenScroll`, `BottomBar`, `Stack`, `Inline`, `Grid`, `FillContainer`).
   - Strictly ban page-level scrolling; only designated inner containers scroll (`overflow-y: auto; overscroll-behavior: contain`).
   - Use `100dvh` with `100svh` and `-webkit-fill-available` fallbacks.
   - Expand safe-area variable handling (`--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left`).
2. **Navigation & Gestures**:
   - Refactor navigation into a tab navigator with preserved scroll/form state per tab.
   - Smooth animated transitions honoring `prefers-reduced-motion`.
   - Android hardware/gesture back handling (`@capacitor/app`) with confirmation on exit.
   - iOS interactive edge swipe back.

### What We Add
1. **Platform Facade (`src/platform/`)**:
   - A unified, typed abstraction layer covering all native capabilities:
     - `haptics`, `share`, `clipboard`, `network`, `storage`, `files`, `notifications`, `browser`, `lifecycle`, `orientation`, `keyboard`, `statusBar`, `deviceInfo`, `permissions`.
   - Complete Web implementation for every method (with graceful fallbacks) so product code never directly imports Capacitor plugins.
2. **Capacitor 8 Plugins**:
   - Added: `@capacitor/keyboard`, `@capacitor/network`, `@capacitor/device`, `@capacitor/screen-orientation`, `@capacitor/browser`, `@capacitor/clipboard`, `@capacitor/dialog`, `@capacitor/toast`, `@capacitor/action-sheet`.
3. **Layout Lab (`/dev/layout-lab`)**:
   - Dev-only interactive viewport test harness verifying layout at 320px, 360px, 390px, 430px, 768px, 1024px, and landscape orientations.
4. **Containerization & CI**:
   - Multi-stage `Dockerfile`, `docker-compose.yml`, `.devcontainer/devcontainer.json`, and GitHub Actions workflow (`.github/workflows/ci.yml`).
5. **App Guidelines**:
   - Comprehensive `docs/APP_GUIDELINES.md` detailing native coding rules, bundle budgets, accessibility, and architectural constraints.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
