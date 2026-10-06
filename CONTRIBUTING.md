# Contributing to Parichay

Thank you for your interest in contributing to Parichay. Parichay is a private, offline-first digital business card application engineered with zero network dependencies, strict cryptography-grade local storage, and high-craft typography.

---

## 1. Core Principles

Before writing code, understand the non-negotiable architectural tenets:
1. **Zero External Network Calls:** No analytics, no error telemetry (no Sentry/Mixpanel), no remote CDNs, and no cloud databases.
2. **Standard vCard 3.0 Optical Compatibility:** QR codes must scan directly on default stock iOS Camera, Google Lens, and Samsung Camera apps without third-party readers.
3. **Local Sovereignty:** User data remains exclusively on-device in IndexedDB and Capacitor Preferences.
4. **Offline Reproducibility:** Every font, asset, and library must be bundled locally.

---

## 2. Environment Setup

### Prerequisites
- **Node.js**: v20+ or v22+
- **npm**: v10+

### Installation
```bash
git clone https://github.com/omkarkardile/parichay.git
cd parichay
npm install
```

### Running Locally
```bash
# Start Vite development server on port 3000
npm run dev

# Build production bundle and service worker
npm run build

# Preview production build locally
npm run preview
```

---

## 3. Verification & Quality Gates

Every pull request and commit must pass the full verification suite:

```bash
# Run all quality checks: TypeScript typecheck, privacy audit, unit tests, docs check, and build
npm run verify:all
```

Individual checks:
- `npm run lint` — Type checking via `tsc --noEmit`.
- `npm run check:privacy` — Static audit for forbidden network APIs (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `EventSource`) and tracking SDKs.
- `npm run docs:check` — Verification that documentation files are complete, unbroken, and match the latest codebase.
- `npm run test` — Vitest unit test suite (vCard 3.0 format, QR matrix round-trips, normalizers, wallpaper geometry, fallback typography).

---

## 4. Branch & Commit Conventions

### Branch Names
- `feat/feature-name` (e.g. `feat/contrast-checker`)
- `fix/bug-description` (e.g. `fix/vcard-photo-rfc-fold`)
- `docs/doc-update` (e.g. `docs/user-guide-steps`)

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>(<scope>): <short description in imperative present tense>

[optional body explaining why and consequences]

[optional footer(s)]
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

---

## 5. How-To Guides for Common Extensions

### Adding a New Style Preset
1. Open `src/shared/presets.ts`.
2. Add your preset object to `STYLE_PRESETS`:
   ```typescript
   {
     id: 'custom-preset-id',
     name: 'Preset Display Name',
     description: 'A brief description of the palette.',
     style: {
       dotColor: '#...',
       cornerSquareColor: '#...',
       cornerDotColor: '#...',
       backgroundColor: '#...',
       plateColor: '#...',
       dotType: 'dots' | 'rounded' | 'square',
       fontFamily: 'Instrument Sans',
       ...
     }
   }
   ```
3. Run `npm run test` to verify preset schema compliance and contrast rules.

### Adding a New Offline Font
1. Install the font via `@fontsource/<font-name>`:
   ```bash
   npm install @fontsource/<font-name>
   ```
2. Import font weights in `src/styles/fonts.css`.
3. Register the font family in `src/web/lib/fonts.ts` under `FONT_CATALOG` with its category and script support.
4. Add the font and its license entry to `THIRD_PARTY_LICENSES.md`.

### Adding a New Screen
1. Create your component in `src/web/features/<feature>/<FeatureScreen>.tsx`.
2. Wire the route in `src/web/app/App.tsx`.
3. If navigation bar or back button behavior is needed, ensure `AppShell` handles it.
4. Document the new screen route in `docs/ARCHITECTURE.md` and `docs/TECHNICAL.md`.

---

## 6. Documentation is a Deliverable

In Parichay, documentation is written alongside code. If you introduce or modify a feature, script, or configuration:
1. Update relevant files under `docs/`.
2. Add an entry to `CHANGELOG.md` under `[Unreleased]`.
3. If making a non-obvious engineering choice, add an entry to `docs/DECISIONS.md`.
4. Ensure `npm run docs:check` passes cleanly.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
