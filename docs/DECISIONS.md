# Architectural & Product Decisions Log (DECISIONS.md)

This log records every key product, architectural, and design decision made during the development of Parichay.

---

## Decision 001: Product Identity & Name
- **Decision**: Selected the name **Parichay** (Hindi & Marathi for "introduction", "identity", or "acquaintance").
- **Context**: Explored 17 names spanning Sanskrit, Hindi, Marathi, and English. Evaluated phonetics, memorability, typography, cultural resonance, and domain friendliness.
- **Alternatives Considered**: *Sparsh* (touch/contact), *Kith* (relations), *Milap* (meeting), *Pehchan* (identity).
- **Rationale**: Parichay (8 letters) evokes the deliberate, respectful social ritual of introducing oneself. It rolls naturally off the tongue in English, Hindi, and Marathi. It fits within iOS/Android app launcher limits (≤ 12 characters).
- **Tagline**: "One card. One scan. Nothing leaves your phone."
- **App ID**: `com.example.parichay` (placeholder reverse-domain).

## Decision 002: Zero-Network & Pure Offline Privacy Model
- **Decision**: No backend, no telemetry, no analytics, no external CDN calls, no URL-based QR codes.
- **Context**: Standard digital business cards force recipients through proprietary web landing pages or cloud redirects, creating tracking cookies and requiring network connectivity.
- **Rationale**: Storing raw vCard 3.0 directly inside the QR allows stock iOS and Android camera apps to parse and create the contact locally in flight mode without internet. Privacy is absolute and cryptographically verifiable.
- **Non-Goals Accepted**: No public profile URLs, no cloud sync, no scan counters.

## Decision 003: Compact vCard 3.0 Standard
- **Decision**: Use a strictly minimized vCard 3.0 format for the QR payload while maintaining rich vCard 3.0 (with photo base64 and social labels) for the `.vcf` file export.
- **Rationale**: QR payload sizes directly determine QR matrix density and scan reliability. Limiting fields and stripping non-essential tags keeps the QR under 250-450 bytes (Version 4-7 QR), easily readable across all phone cameras in low light.
- **Hard Cap**: 700 bytes maximum payload for QR codes.

## Decision 004: Dual-Storage Strategy
- **Decision**: Implement a uniform `StorageAdapter` interface with two platform backends:
  1. Native (Capacitor): `@capacitor/preferences` for JSON data and `@capacitor/filesystem` (`Directory.Data`) for photos.
  2. Web (PWA): IndexedDB via `idb-keyval` with `navigator.storage.persist()` request.
- **Data Protection**: `android:allowBackup="false"` and backup extraction rules to prevent Google Account auto-backup from exfiltrating contact records.

## Decision 005: Self-Hosted Font Bundle
- **Decision**: Bundle ~45 curated open-source font families via `@fontsource` / `@fontsource-variable`.
- **Rationale**: Zero external network requests to Google Fonts or CDNs. Ensures 100% offline functionality, preserves user privacy (zero IP leakage), and guarantees consistent text rendering in exports and wallpapers.

## Decision 006: Local Wallet Approach
- **Decision**: Generate high-fidelity Apple and Google Wallet pass images rather than requiring signed server JWT tokens.
- **Rationale**: Official Google Wallet issuance requires a Google Cloud project with private service account keys on a backend server, which fundamentally violates the "nothing leaves your phone" brand promise. Both Android (Google Wallet "Photo" pass) and iOS (Photos "Add Pass to Wallet") natively support extracting contact passes from photos locally.

## Decision 007: DeviceTools In-Repo Native Plugin
- **Decision**: Implement a native plugin in Kotlin (Android) and Swift (iOS) with typed web fallbacks for screen metrics, lock-screen wallpaper management via `WallpaperManager`, MediaStore gallery saves, and keep-screen-on toggles.

## Decision 008: Capacitor 8 App Hardening & Platform Facade Architecture
- **Decision**: Pinned Capacitor 8 core and standard plugins with a unified platform facade in `src/platform/`. Product code never directly imports Capacitor plugins.
- **Context**: Different platforms (Web, Android, iOS) provide different native capabilities (e.g. `Haptics`, `Network`, `ScreenOrientation`, `Share`, `Dialog`). Direct imports in feature components introduce fragile runtime checks and mock friction in tests.
- **Rationale**: Creating a strongly typed platform facade (`src/platform/`) with web implementations guarantees 100% offline web functionality, simplified unit testing with zero mocks, and clean native bridge calls.
- **Consequences**: Strict architectural isolation; all native features (dialogs, clipboard, share, toast, status bar, keyboard) route through `src/platform/`.

## Decision 009: Craftsman Developer Attribution Architecture
- **Decision**: Implemented restrained developer credit to Omkar Kardile (`https://omkardile.is-a.dev/`) in footer, standalone pages, `<head>` metadata, and docs.
- **Rationale**: Honors craftsmen attribution without invasive banners or third-party trackers.

## Decision 010: iOS 27 Liquid Glass Design & Fluid Ambient Background Architecture
- **Decision**: Adopted futuristic iOS "Liquid Glass" materials with multi-chromatic fluid ambient backdrops and optical glass iconography.
- **Context**: Standard flat glassmorphism looks washed out and invisible on monotone backgrounds because semi-transparent blur has no light variation to refract.
- **Rationale**: Liquid glass requires ambient chromatic fluid light underneath to catch, scatter, and specularly reflect. Introduced `LiquidAmbientBackground.tsx` with organic terracotta, amber, sapphire, and aurora fluid orbs with 22s-28s keyframe drifting and `prefers-reduced-motion` compliance. Upgraded `TabBar` into an iOS floating liquid dock, cards into double-rim frosted quartz surfaces (`backdrop-filter: blur(28px-34px) saturate(180%-200%)`), and created a 3D optical liquid glass logo for `public/logo.svg` and `public/icon.svg`.
- **Consequences**: Elevated tactile luxury, physical depth, and unmistakable modern iOS aesthetic while keeping all 61 tests and zero-network audits 100% green.

---
