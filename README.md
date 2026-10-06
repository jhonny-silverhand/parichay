# Parichay (परिचय)
> **One card. One scan. Nothing leaves your phone.**

[![CI](https://github.com/omkarkardile/parichay/actions/workflows/ci.yml/badge.svg)](https://github.com/omkarkardile/parichay)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Network](https://img.shields.io/badge/Privacy-Zero%20Network-emerald.svg)](docs/PRIVACY.md)

Parichay is an offline-first, private digital business card application built for mobile web (PWA), Android, and iOS. It generates ultra-compact vCard 3.0 QR codes that contain your complete contact details directly inside the QR matrix.

Anyone can scan your card with their standard iPhone or Android camera app or Google Lens to instantly get "Add to Contacts"—with **no app required, no web page, no server lookup, and zero internet connection**.

---

## Architecture & Privacy Model

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          USER DEVICE (SANDBOX)                         │
│                                                                        │
│   ┌─────────────────────┐                  ┌──────────────────────┐    │
│   │   Identity Form     │ ──(in-memory)──> │  Compact vCard 3.0   │    │
│   │   (Zod Validation)  │                  │  (< 250-450 bytes)   │    │
│   └─────────────────────┘                  └──────────────────────┘    │
│              │                                         │               │
│              ▼                                         ▼               │
│   ┌─────────────────────┐                  ┌──────────────────────┐    │
│   │  In-Memory Canvas   │                  │   QR Style Studio    │    │
│   │  EXIF Strip & Crop  │                  │  (17 Presets, jsQR)  │    │
│   └─────────────────────┘                  └──────────────────────┘    │
│              │                                         │               │
│              ▼                                         ▼               │
│   ┌─────────────────────┐                  ┌──────────────────────┐    │
│   │ Dual Storage Layer  │                  │ High-Res Exports     │    │
│   │ IndexedDB / Native  │                  │ PNG, SVG, Print, VCF │    │
│   │ allowBackup = false │                  │ Wallet & Wallpaper   │    │
│   └─────────────────────┘                  └──────────────────────┘    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                 SCAN VIA
                           STOCK PHONE CAMERA
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │    Recipient's Phone      │
                      │    "Add to Contacts"      │
                      │   (Zero Network Needed)   │
                      └───────────────────────────┘
```

---

## Architectural Decisions & Trade-offs

1. **Pure Offline vCard QR vs URL-Based Redirects**:
   Traditional digital business cards encode a web URL into the QR. When scanned, the recipient must have cell reception, loads a tracking page with cookies, and downloads a `.vcf` through an intermediary server. Parichay embeds the raw vCard string directly into the QR matrix. It scans in basements, subways, and airplanes with 100% privacy.
2. **The Static QR Limitation**:
   Because the data lives physically in the QR matrix, previously printed physical cards cannot be updated if you change your phone number later. Parichay computes a deterministic `qrFingerprint` and calmly informs you whenever your changes alter the QR payload.
3. **Wallet Pass via High-Resolution Barcode Image**:
   Official Apple Wallet (`.pkpass`) and Google Wallet REST APIs require a centralized server with private cryptographic signing keys, violating the "nothing leaves your phone" rule. Parichay generates 1080x1350 barcode-optimized pass images that Google Wallet ("Add from photo") and iOS Photos natively import directly on the device.
4. **No External CDNs or Cloud Fonts**:
   External web fonts leak the user's IP address and break when offline. Parichay bundles 45+ open-source font families locally using Fontsource.
5. **Android Auto-Backup Protection**:
   Configured with `android:allowBackup="false"` and backup extraction rules to prevent Google Account auto-backup from syncing contact cards to Google Drive.

---

## Tech Stack & Pinned Majors

- **Framework**: Vite 8 + React 19 + React Router 7 (Single Page Application)
- **TypeScript**: TypeScript 7 (Strict mode, ES2022)
- **Styling**: Tailwind CSS 4 with custom Design Tokens single source of truth (`tokens.json` &rarr; `tokens.css`)
- **QR Core**: `qrcode` (Matrix generation) + `jsqr` (Live optical scan verification)
- **Data & Normalization**: `zod` 4 + `libphonenumber-js` 1 + `idb-keyval` 6
- **Native Runtime**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/status-bar`, `@capacitor/local-notifications`, `@capacitor/haptics`, `@capacitor/app`)
- **Native Plugin**: In-repo `DeviceTools` (Kotlin on Android, Swift on iOS) for wallpaper setting, screen metrics, and gallery storage.
- **Testing**: Vitest 5 (45 automated unit tests)

---

## Quickstart & Local Development

### Prerequisites
- Node.js >= 20.0.0 (or v22+)
- npm >= 10.0.0

```bash
# 1. Clone repository
git clone https://github.com/omkarkardile/parichay.git
cd parichay

# 2. Install dependencies
npm install

# 3. Compile design tokens and brand assets
npm run tokens:build
npm run brand:build

# 4. Launch local dev server (port 3000)
npm run dev
```

---

## Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:3000` |
| `npm run build` | Builds production PWA with service worker and asset precache |
| `npm run preview` | Previews the production static build locally |
| `npm run lint` | Runs TypeScript static typecheck (`tsc --noEmit`) |
| `npm run test` | Runs the Vitest automated test suite (45 unit tests) |
| `npm run check:privacy` | Runs privacy audit enforcing zero external network calls |
| `npm run docs:check` | Verifies documentation completeness, relative links, and routes |
| `npm run tokens:build` | Compiles `design/tokens/tokens.json` to `src/web/styles/tokens.css` |
| `npm run brand:build` | Generates brand SVGs, master logo, and PWA icons |
| `npm run cap:sync` | Builds web app and synchronizes Android & iOS native projects |
| `npm run verify:all` | Executes lint + privacy check + unit tests + docs check + build |

---

## In-Product Offline Routes

| Route | Description |
| :--- | :--- |
| `/` | Primary card home screen with hero QR and quick actions |
| `/onboarding` | 4-step offline setup wizard with vCard generation |
| `/editor` | Complete card details editor (phone, email, socials, address, photo) |
| `/studio` | Style Studio (presets, fonts, dot shapes, eye geometry, palette) |
| `/qr/fullscreen` | Pure white high-contrast fullscreen QR view with screen keep-awake |
| `/share` | High-res PNG, vector SVG, printable badge, and `.vcf` export |
| `/wallet` | Google Wallet & Apple Photos 1080x1350 pass photo generator |
| `/wallpaper` | Lock-screen wallpaper generator with clock & shortcut safe zones |
| `/settings` | Appearance, backup/restore, privacy architecture, notifications |
| `/showcase` | Public interactive product demo and style pack preview |
| `/index-help` | In-app offline help centre with search across all guides |

---

## Documentation Library

Complete documentation is maintained in the [`docs/`](docs/README.md) directory:

| Document | Purpose |
| :--- | :--- |
| [`docs/README.md`](docs/README.md) | Index of all documentation files |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Numbered Architecture Decision Records (ADRs) |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Deep architectural layers, storage adapters, and data flow |
| [`docs/TECHNICAL.md`](docs/TECHNICAL.md) | Module-by-module reference, vCard 3.0 spec, and API details |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) | Schemas for card, style, settings, and backups |
| [`docs/TESTING.md`](docs/TESTING.md) | Unit testing strategy, coverage, and how to write tests |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Threat model, Content Security Policy, and report guidelines |
| [`docs/PRIVACY.md`](docs/PRIVACY.md) | Verifiable plain-language zero-network privacy policy |
| [`docs/BUSINESS.md`](docs/BUSINESS.md) | Business positioning, competitor matrix, and pricing models |
| [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) | Step-by-step user manual with platform caveats |
| [`docs/FAQ.md`](docs/FAQ.md) | Frequently asked questions |
| [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Camera scanning, vendor wallpapers, and wallet fixes |
| [`docs/RELEASE.md`](docs/RELEASE.md) | Release process, signing keys, and store submissions |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design philosophy, tokens, typography, and contrast rules |
| [`docs/BRAND.md`](docs/BRAND.md) | Brand identity, color palette, and vector logo spec |
| [`docs/FIGMA_GUIDE.md`](docs/FIGMA_GUIDE.md) | Figma component structure and design token handoff |
| [`docs/STORE.md`](docs/STORE.md) | App Store & Google Play metadata, copy, and keywords |
| [`docs/AUTOMATION.md`](docs/AUTOMATION.md) | Scheduled tasks, smoke verification, and background jobs |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Feature roadmap and backlog |
| [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) | Documented platform quirks and active workarounds |
| [`docs/PROGRESS.md`](docs/PROGRESS.md) | Engineering milestones and implementation status |

---

## Native Android & iOS Build Instructions

### Android Build & Signing
```bash
# Sync web build to native android project
npm run cap:sync

# Open Android Studio
npx cap open android
```
- Minimum SDK: `24` (Android 7.0)
- Target SDK: `36`
- Release APK/AAB generation:
  1. Generate keystore: `keytool -genkey -v -keystore release.keystore -alias parichay -keyalg RSA -keysize 2048 -validity 10000`
  2. Configure signing in `android/app/build.gradle`.
  3. Build release bundle: `cd android && ./gradlew bundleRelease`.

### iOS Build & Signing
```bash
# Sync web build to native iOS project
npm run cap:sync

# Open Xcode
npx cap open ios
```
- Deployment Target: `iOS 15.0+`
- Swift Package Manager enabled by default.
- In Xcode, select your Apple Developer Team under **Signing & Capabilities**.

---

## Author & Craftsman Credit

Designed & developed by **[Omkar Kardile](https://omkardile.is-a.dev/)**.

---

## License

MIT License. Copyright (c) 2026 Omkar Kardile. See [LICENSE](LICENSE) for details.  
All bundled fonts are licensed under the SIL Open Font License (OFL) or Apache 2.0. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
