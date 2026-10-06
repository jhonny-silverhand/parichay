# Parichay Mobile App & Web Engineering Guidelines (APP_GUIDELINES.md)

This document establishes the architectural rules, coding standards, and quality boundaries enforced across Parichay.

---

## 1. Layout & Viewport Rules

1. **No Raw `100vh`**:
   - Never use `height: 100vh`. Standard `100vh` fails on iOS Safari and mobile browsers with collapsible address bars, causing content jumping and scroll glitches.
   - Use `100dvh` with `100svh` and `-webkit-fill-available` fallbacks (`var(--app-height)`).
2. **Zero Body Scrolling**:
   - The `html`, `body`, and `#root` elements are `position: fixed; inset: 0; overflow: hidden; overscroll-behavior: none;`.
   - The window never scrolls. Scrolling is restricted exclusively to designated inner container elements (`ScreenScroll` or `.app-scroll-view`) configured with `overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain`.
3. **Safe Areas Everywhere**:
   - All screens, headers, bottom sheets, navigation bars, and floating controls must respect `--safe-top`, `--safe-bottom`, `--safe-left`, and `--safe-right` derived from `env(safe-area-inset-*)`.
4. **No Fixed Pixel Widths on Main Containers**:
   - Screen layouts must never specify fixed pixel page widths (e.g. `width: 375px`). Use fluid flex/grid layouts with `@container` queries, `clamp()`, and `FillContainer` primitives.
   - On wide viewports (tablets, foldables, desktop), content must center in an art-directed column or two-pane layout, never a stretched mobile layout.

---

## 2. Native-Safe Coding Invariants

1. **No Direct `window.alert`, `window.confirm`, or `window.prompt`**:
   - Native WebViews can freeze or look broken when native browser dialogs are triggered.
   - Always invoke the dialog facade (`dialog.alert`, `dialog.confirm`, `dialog.prompt` from `@/platform`).
2. **No Direct Capacitor Plugin Imports in Product UI**:
   - UI feature components (`src/web/features/*`, `src/web/components/*`) must never import directly from `@capacitor/*`.
   - All native capabilities must route through the typed platform abstraction facade (`@/platform`).
3. **External Links Must Open via the Browser Facade**:
   - Never use `<a target="_blank">` without handling the click on native devices.
   - External URLs must open via `browser.openUrl({ url })` from `@/platform` so iOS Safari View Controller or Android Custom Tabs handle the link safely outside the app sandbox.
4. **Minimum 16px Font Size on Form Inputs**:
   - Every `input`, `select`, and `textarea` must specify a computed font size of at least `16px` (`font-size: max(16px, 1rem)`) to prevent iOS Safari from automatically zooming the page upon focus.
5. **Minimum 44px Touch Targets**:
   - Every interactive element (buttons, tabs, action rows, switches) must meet WCAG 2.5.5 touch target size (minimum 44x44px bounding box).

---

## 3. Privacy & Zero-Network Enforcement

1. **Zero External Network Endpoints**:
   - No HTTP calls to remote servers. No analytics (no GA, PostHog, Mixpanel, Segment), no crash trackers (no Sentry, Datadog), and no third-party CDNs.
   - The codebase must pass `npm run check:privacy` before every commit.
2. **Local Storage Sovereignty**:
   - Contact cards and custom styles reside exclusively on the device in IndexedDB (`idb-keyval`) or native `@capacitor/preferences`.
   - `android:allowBackup="false"` is set to prevent Google Drive auto-backups from leaking contact profiles.
3. **Image Metadata Sanitization**:
   - All user avatars must be redrawn onto an in-memory canvas to completely strip binary EXIF, GPS, camera serial numbers, and timestamps prior to storage.

---

## 4. Accessibility & Polish Standards

1. **Reduced Motion**:
   - CSS animations and Framer Motion transitions must honor `@media (prefers-reduced-motion: reduce)`.
2. **High Contrast**:
   - All text colors must meet WCAG AA contrast (≥ 4.5:1 for body copy, ≥ 3.0:1 for large display headers) in both light and dark themes.
3. **Keyboard & Screen Reader Support**:
   - Every modal sheet, dialog, and action sheet must manage focus trapping, emit `aria-modal="true"`, support Escape key dismiss, and announce status changes via `aria-live`.

---

## 5. Quality Gates & CI Commands

| Command | Invariant Enforced |
| :--- | :--- |
| `npm run lint` | TypeScript strict mode compilation (`tsc --noEmit`) |
| `npm run check:privacy` | Static scanning ensuring zero network invocations and zero tracking SDKs |
| `npm run docs:check` | Verifies required docs exist, relative links resolve, and changelog matches package.json |
| `npm run test` | Vitest automated suite (RFC vCard compliance, QR matrix roundtrips, normalizers) |
| `npm run build` | Vite production build with Service Worker precaching |
| `npm run verify:all` | Executes all 5 checks in sequence |

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
