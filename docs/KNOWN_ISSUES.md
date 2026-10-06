# Known Issues & Environment Nuances (KNOWN_ISSUES.md)

This document tracks environmental limitations, platform constraints, and temporary workarounds encountered during development.

---

## 1. Native Build Tooling in Web Sandbox
- **Status**: Documented as expected.
- **Detail**: The current AI Studio environment provides Node.js 22.23.2 and npm 10.9.8 in a Linux container without an installed Java/JDK runtime (`java: not found`) or macOS `xcodebuild`.
- **Impact**: Full Android `./gradlew assembleDebug` and iOS Xcode compilation cannot be executed directly inside this container environment.
- **Handling**:
  1. The complete Android and iOS Capacitor native projects, manifests, Gradle configurations, and Kotlin/Swift native plugin implementations (`DeviceTools`) are generated and verified syntactically.
  2. The web and PWA layer is 100% buildable, testable, and runnable (`npm run build`, `npm run preview`, Vitest unit tests, Playwright E2E).
  3. Clear, reproducible instructions for building and signing on local developer machines are provided in `README.md` and `docs/STORE.md`.

## 2. Google Wallet API Exclusion
- **Status**: Intentional architectural decision.
- **Detail**: Official Google Wallet REST API issuance requires a Google Cloud service account, cloud backend, and server-side JWT signing with private keys.
- **Impact**: Cannot push a native `.pkpass` or Google Wallet save link via API without a central server.
- **Handling**: Implemented high-resolution Wallet-optimised pass images (1080x1350) which stock Android Google Wallet ("Add from photo") and iOS Safari/Photos can import directly into the wallet offline.

## 3. iOS Lock-screen Wallpaper Limitations
- **Status**: Apple platform constraint.
- **Detail**: iOS does not expose any public API for third-party apps to set or change the lock-screen wallpaper programmatically.
- **Handling**: On Android, Parichay provides direct lock-screen setting via `WallpaperManager` and the system crop-and-set intent. On iOS and Web, Parichay generates the exact screen-dimensioned PNG with safe-zone guides and provides a guided saving and setting walkthrough.

## 4. Static QR vs Dynamic Update Limitation
- **Status**: Inherent to offline vCards.
- **Detail**: Because the contact payload is embedded directly into the QR matrix (zero server lookup), previously printed or captured QR codes cannot automatically update if the user edits their details later.
- **Handling**: Parichay computes a deterministic `qrFingerprint`. When a user saves changes that alter the QR matrix, a calm in-app banner notifies them: "Your QR changed. Anything printed or saved earlier still shows the old details."
