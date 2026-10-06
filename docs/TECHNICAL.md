# Parichay Technical Reference

This document provides a comprehensive technical reference for the codebase, schemas, formats, and native interfaces.

---

## 1. Module-by-Module Codebase Reference (`src/`)

### Core Shared Domain (`src/shared/`)

#### `src/shared/card.ts`
- **Purpose**: Defines contact card types, limits, and Zod validation schemas.
- **Key Types**: `Card`, `PhoneEntry`, `EmailEntry`, `WebsiteEntry`, `SocialEntry`, `CardBackup`.
- **Validation**: Enforces max length limits (Name: 60 chars, Notes: 160 chars, Max 4 phones/emails).

#### `src/shared/vcard.ts`
- **Purpose**: RFC 6350 compliant vCard 3.0 string builder.
- **Key Functions**:
  - `buildCompactVCard(card: Card): string`: Emits a streamlined payload (< 300 bytes) omitting redundant empty fields to optimize QR optical density.
  - `buildFullVCard(card: Card, photoBase64?: string): string`: Emits a comprehensive vCard payload including notes, multiple phones, and folded base64 photo.
  - `foldVCardLine(line: string, maxOctets = 75): string`: Strict multibyte UTF-8 octet counter folding lines with standard CRLF and leading space.

#### `src/shared/normalizers.ts`
- **Purpose**: Sanitizes raw user input into canonical RFC formats.
- **Key Functions**:
  - `normalizePhone(raw: string, defaultCountry = 'IN')`: Parses via `libphonenumber-js` to output valid E.164 (`+919876543210`).
  - `normalizeEmail(raw: string)`: Trims and lowercases email strings.
  - `normalizeWebsite(raw: string)`: Ensures valid `https://` prefix.

#### `src/shared/style.ts` & `src/shared/presets.ts`
- **Purpose**: Defines QR styling parameters and provides 17 handcrafted presets.
- **Key Types**: `CardStyle`, `CenterElement`, `StylePreset`.

---

## 2. vCard Format Specification

### Compact vCard (Used for Hero QR)
```text
BEGIN:VCARD
VERSION:3.0
N:Sharma;Ananya;;;
FN:Ananya Sharma
ORG:Atelier Studio
TITLE:Product Designer
TEL;TYPE=CELL,VOICE:+919876543210
EMAIL;TYPE=WORK:hello@example.com
END:VCARD
```

### Full vCard (Used for File Export)
Includes address, multiple phone numbers, social URLs, notes, and base64 avatar folded at 75 octets:
```text
BEGIN:VCARD
VERSION:3.0
N:Sharma;Ananya;;;
FN:Ananya Sharma
ORG:Atelier Studio
TITLE:Product Designer
TEL;TYPE=CELL,PREF:+919876543210
EMAIL;TYPE=WORK,PREF:hello@example.com
URL;TYPE=WORK:https://atelier.example.com
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/ananya
NOTE:Generated offline via Parichay
PHOTO;ENCODING=b;TYPE=JPEG:/9j/4AAQSkZJRgABAQ...
END:VCARD
```

---

## 3. Style Schema & JSON Representation

```json
{
  "dotColor": "#B85226",
  "dotType": "rounded",
  "cornerSquareColor": "#111317",
  "cornerSquareType": "extra-rounded",
  "cornerDotColor": "#B85226",
  "cornerDotType": "dot",
  "backgroundColor": "#F7F5F0",
  "plateColor": "#FFFFFF",
  "plateRadius": 24,
  "quietZone": 4,
  "fontFamily": "Instrument Sans",
  "centerElement": {
    "type": "none"
  }
}
```

---

## 4. Backup File Format (`.json`)

Exported backups are deterministic, plain JSON files that can be audited by the user before offline storage:

```json
{
  "version": 1,
  "exportedAt": "2026-10-05T00:00:00.000Z",
  "card": {
    "id": "c-1728000000000",
    "firstName": "Ananya",
    "lastName": "Sharma",
    "jobTitle": "Product Designer",
    "company": "Atelier Studio",
    "phones": [
      {
        "id": "p-1",
        "number": "+919876543210",
        "label": "Work",
        "isPrimary": true
      }
    ],
    "emails": [
      {
        "id": "e-1",
        "address": "hello@example.com",
        "label": "Work",
        "isPrimary": true
      }
    ],
    "websites": [],
    "socials": [],
    "notes": "",
    "updatedAt": "2026-10-05T00:00:00.000Z",
    "qrFingerprint": "8f4a1c..."
  },
  "style": { ... },
  "photoBase64": "data:image/jpeg;base64,..."
}
```

---

## 5. Storage Keys & Migrations

All keys stored in IndexedDB (`idb-keyval`) or native `@capacitor/preferences`:

| Key | Type | Description |
| :--- | :--- | :--- |
| `parichay_card` | `Card` | Active card profile. |
| `parichay_style` | `CardStyle` | User customized QR visual style. |
| `parichay_settings`| `UserSettings` | App theme, haptics, and backup preferences. |
| `parichay_photo` | `string` | Base64 JPEG data URL of avatar. |

---

## 6. Native Plugin Reference: `DeviceTools`

### Android Implementation (`DeviceToolsPlugin.kt`)
- `setLockScreenWallpaper({ dataUrl: string, alsoHome?: boolean })`: Converts Base64 to `Bitmap` and calls `WallpaperManager.FLAG_LOCK`.
- `openWallpaperPicker()`: Fires `Intent(Intent.ACTION_SET_WALLPAPER)`.
- `openGoogleWallet()`: Launches package `com.google.android.apps.walletnfcrel`.
- `saveImageToGallery({ dataUrl: string, filename: string })`: Writes to `MediaStore.Images.Media` in `Pictures/Parichay`.
- `keepScreenOn({ enabled: boolean })`: Toggles `FLAG_KEEP_SCREEN_ON` on the current `Window`.

### iOS Implementation (`DeviceToolsPlugin.swift`)
- `saveImageToGallery`: Requests `PHPhotoLibrary.shared().performChanges` and saves image.
- `keepScreenOn`: Sets `UIApplication.shared.isIdleTimerDisabled = enabled`.

---

## 7. Performance & Bundle Metrics

- **First Contentful Paint (FCP)**: < 0.6s on mid-tier mobile hardware.
- **Service Worker Precaching**: 246 self-hosted font chunks and assets preloaded for instantaneous offline availability.
- **QR Render Time**: Canvas redraw completes in < 12ms for a 600px matrix.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
