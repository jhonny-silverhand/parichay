# Frequently Asked Questions (FAQ.md)

---

### 1. Does the recipient need to have Parichay installed to scan my card?
**No.** Anyone with a standard modern smartphone (iPhone Camera app, Android Google Lens, or Samsung Camera) can point their camera at your QR code. The operating system natively detects the contact format and displays an "Add to Contacts" prompt with your name, phone number, organization, and email prefilled.

---

### 2. Can I use Parichay if I have no internet connection?
**Yes, 100%.** Parichay is built with an offline-first architecture. All vCard formatting, QR matrix calculations, style rendering, image cropping, and wallpaper generation happen on your device using local JavaScript and native APIs.

---

### 3. How does this protect my privacy compared to Blinq, HiHello, or Popl?
Cloud-based digital business cards store your contacts on remote servers and encode a tracking URL into the QR code. When someone scans their card, the server records the scan time, IP address, device model, and location. Parichay encodes your complete contact data directly into the QR pattern itself. There is no server, no tracking link, and no database.

---

### 4. What is the "Static QR" limitation?
Because your information lives inside the physical QR matrix rather than on a remote web server, previously printed physical cards cannot be modified remotely if your phone number changes. If you update your card details, Parichay alerts you that the QR matrix has changed and recommends re-exporting or updating your lock-screen wallpaper.

---

### 5. Why are there so many fonts in Parichay?
Parichay bundles 45+ open-source typography fonts locally via Fontsource. We bundle them directly into the app so you have high-end editorial and Devanagari typography without ever making a network request to Google Fonts or leaking your IP address.

---

### 6. Where is my profile photo stored?
Your photo is stored exclusively on your device: in IndexedDB for the Web/PWA build, and in the app's sandboxed data directory on Android and iOS. It is never uploaded to any cloud storage.

---

### 7. How do I transfer my card to a new phone?
1. On your old phone, go to **Settings &rarr; Export Card Backup (.json)**.
2. Transfer the `.json` file to your new device (via AirDrop, Local USB, or offline file share).
3. On your new phone, install Parichay and tap **Settings &rarr; Import Card Backup**.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
