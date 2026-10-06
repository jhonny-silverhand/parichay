# App Store & Google Play Store Readiness (STORE.md)

This document contains copy, metadata, safety questionnaires, and compliance answers for publishing Parichay to Google Play and the Apple App Store.

---

## 1. Store Listing Metadata

### App Title
- **Full Title**: `Parichay - Offline Business Card`
- **Short Name (Launcher)**: `Parichay` (8 characters, under the 12-char limit)

### Short Description (Google Play - 80 chars max)
> A private digital business card on your phone. One scan. Zero tracking. (74 chars)

### Subtitle (Apple App Store - 30 chars max)
> Private Offline Business Card (29 chars)

### Long Description
```text
Parichay (परिचय) is a private digital business card that lives only on your phone.

Create your professional card in seconds. Parichay generates a compact, high-contrast vCard QR code containing your contact details directly inside the code matrix. Anyone can scan it with their standard iPhone or Android camera app to instantly tap "Add to Contacts"—with no special app, no web redirect, no server lookup, and no internet connection required.

OUR CORE PROMISE: NOTHING LEAVES YOUR PHONE
Parichay is engineered with an uncompromising privacy architecture:
• 100% Offline: Operates seamlessly in flight mode.
• No User Accounts: No signups, no logins, no email collection.
• Zero Cloud Servers: Your card, photo, and details are stored strictly in your device's isolated memory.
• Zero Analytics: No tracking SDKs, no telemetry, no cookies.
• Android Auto-Backup Protected: Excluded from Google account auto-backup so your personal cards never sync to external clouds without your knowledge.

KEY FEATURES
• Instant Offline Sharing: Scan directly with stock phone cameras or share as a standard .vcf contact card.
• QR Style Studio: Personalize your QR code with 17 handcrafted editorial presets (Ink, Terracotta, Midnight Press, Paper & Pine), custom dot shapes, finder frames, gradients, and brand backdrops.
• Real-Time Scan Validator: Optical contrast meter confirms your customized QR will scan reliably across all lighting conditions.
• Lock-Screen Wallpaper Generator: Transform your digital card into an elegant lock-screen wallpaper with automatic safe-zone alignment for clocks and notifications. Set directly on Android.
• Wallet Pass: Generate high-resolution, barcode-optimized passes for Google Wallet ("Add from photo") and Apple Photos.
• High-Resolution Exports: Export crisp 1200px PNGs, 300 DPI print-ready cards, and 9:16 social story cards.
• Curated Typography: Bundled with 45+ self-hosted open source font families (including full Devanagari script support for Hindi and Marathi names).
• Complete Backup & Erasure: Export encrypted local backups or permanently wipe all data in one tap.
```

### Keywords
`business card, digital business card, qr code, vcard, contact card, offline card, privacy, visiting card, identity, parichay, vcf, wallet card`

---

## 2. Google Play Data Safety Responses

| Question | Answer | Details |
|----------|--------|---------|
| Does your app collect or share any user data? | **No** | Parichay does not collect, transmit, or share any personal data with external servers. |
| Is data encrypted in transit? | **Not Applicable** | No data is ever transmitted over a network. |
| Can users request data deletion? | **Yes** | Users can permanently delete all stored data instantly in Settings &rarr; "Erase All Data". |
| Are any tracking SDKs present? | **No** | Verified via automated static analysis (`npm run check:privacy`). |

---

## 3. Apple App Privacy Questionnaire

- **Data Used to Track You**: `None` (0 items)
- **Data Linked to You**: `None` (0 items)
- **Data Not Linked to You**: `None` (0 items)
- **Category Summary**: "Data Not Collected" badge applies.

---

## 4. Permissions Rationale

| Permission | Platform | Status | User Prompt? | Technical Rationale |
|------------|----------|--------|--------------|---------------------|
| `android.permission.SET_WALLPAPER` | Android | Normal (Install-time) | **No** | Required by `WallpaperManager.setBitmap()` to allow the user to set their generated QR wallpaper directly to their lock screen. |
| `android.permission.WRITE_EXTERNAL_STORAGE` | Android (API &le; 28) | Declared with `maxSdkVersion=28` | Only on Android 9 or older | Required only on legacy Android versions to save exported card images to the gallery. (Android 10+ uses scoped MediaStore with zero permissions). |
| Camera | All | **Not Declared** | None | Parichay generates QR codes; it does not scan them. Profile photos use the system photo picker without camera capture. |
| Contacts | All | **Not Declared** | None | Recipients scan the QR with their own camera; Parichay does not read the user's address book. |

---

## 5. Pre-Submission Checklist

- [ ] **Change Application ID**: Update `com.example.parichay` in `capacitor.config.ts`, `android/app/build.gradle`, and iOS bundle identifier with your registered domain.
- [ ] **Release Keystore**: Create a production keystore using `keytool` and configure signing in `android/app/build.gradle`.
- [ ] **Apple Developer Team**: Select your Apple Developer Team in Xcode (`ios/App/App.xcodeproj`).
- [ ] **Privacy Policy URL**: Host `docs/PRIVACY.md` on your domain or GitHub Pages.
- [ ] **Trademark Clearance**: Conduct a formal trademark search for "Parichay" in target distribution jurisdictions.
