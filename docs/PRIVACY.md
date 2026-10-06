# Privacy Policy & Architecture (PRIVACY.md)

**Effective Date**: October 2026  
**Product**: Parichay (परिचय)  
**Brand Promise**: *One card. One scan. Nothing leaves your phone.*

---

## 1. Core Commitment: Zero Network Architecture

Parichay is built with an absolute privacy model. It does not connect to any server, database, or analytics platform.

- **No User Accounts**: You do not need to register, log in, or provide an email to use the app.
- **No Remote Servers**: Parichay has no backend. All code runs 100% locally on your device.
- **No Analytics or Telemetry**: No crash reporters (no Sentry, Firebase, Mixpanel, Datadog), no session recordings, and no device fingerprinting.
- **No External CDNs**: All fonts, style sheets, and vector brand marks are bundled directly within the app binary.

---

## 2. What Data Is Stored and Where

When you create a digital business card, your data is stored strictly in your device's isolated storage:

| Data Type | Storage Location (Web / PWA) | Storage Location (Android / iOS Native) | Leaves Phone? |
| :--- | :--- | :--- | :--- |
| **Name, Title, Company** | IndexedDB (`idb-keyval`) | `@capacitor/preferences` (Key-Value) | **Never** |
| **Phone, Email, Website** | IndexedDB (`idb-keyval`) | `@capacitor/preferences` (Key-Value) | **Never** |
| **Social Handles** | IndexedDB (`idb-keyval`) | `@capacitor/preferences` (Key-Value) | **Never** |
| **Profile Photo** | IndexedDB (`idb-keyval`) | `@capacitor/filesystem` (`Directory.Data`) | **Never** |
| **Custom QR Styles** | IndexedDB (`idb-keyval`) | `@capacitor/preferences` (Key-Value) | **Never** |
| **App Preferences** | IndexedDB (`idb-keyval`) | `@capacitor/preferences` (Key-Value) | **Never** |

### Protection Against Cloud Auto-Backup
On Android, Parichay declares `android:allowBackup="false"` and implements `data_extraction_rules.xml` to prevent Google Cloud Backup from copying your contact cards to a Google account without your explicit intent.

---

## 3. What Leaves Your Device and When

Data **only** leaves your device when **you explicitly initiate a Share action**:
1. When you tap **Share** or **Save to Gallery**, the app invokes your device's native system share sheet.
2. When someone scans your QR code with their camera, their phone reads the contact text embedded directly inside the QR matrix. There is no web redirect and no tracking cookie.

---

## 4. The Static QR Reality

Because your contact information is encoded directly into the QR matrix itself (pure offline vCard 3.0), previously printed physical cards or saved screenshots cannot be modified if you update your card later. When you alter any details that change the QR matrix, Parichay displays an in-app notice:
> *"Your QR changed. Anything printed or saved earlier still shows the old details."*

---

## 5. How to Back Up and Erase Data

- **Exporting a Backup**: Navigate to **Settings &rarr; Export Card Backup** to save a `.json` backup file directly to your files or offline storage.
- **Erasing Everything**: Navigate to **Settings &rarr; Erase All Data**. Confirming this will permanently delete all records, photos, and preferences from device memory.

---

## 6. How to Verify This Architecture

You can audit the zero-network guarantee yourself:
1. Clone the repository and run `npm run check:privacy`. The automated security scanner inspects all source code and dependencies for network calls (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `EventSource`) and tracking SDKs.
2. Turn on Airplane Mode on your phone or computer. Launch Parichay. All features (generating cards, styling QRs, exporting PNGs, creating wallpapers, and saving wallet passes) work seamlessly with zero connectivity.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
