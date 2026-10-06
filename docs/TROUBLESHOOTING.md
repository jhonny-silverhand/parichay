# Troubleshooting Guide (TROUBLESHOOTING.md)

This guide provides tested solutions for common hardware, browser, and OEM quirks encountered when using Parichay.

---

## 1. QR Code Won't Scan on Recipient's Camera

### Causes & Fixes:
1. **Low Optical Contrast**:
   - If using custom dark-on-dark or light-on-light colors in the Style Studio, switch to the **Minimalist Black & White** or **Terracotta Ember** preset.
   - Tap **"Fullscreen QR"** from the card screen. This switches to a pure white background plate and forces high contrast.
2. **Camera Distance & Focus**:
   - Hold the camera approximately 15 cm to 25 cm (6–10 inches) from the screen.
   - Wipe the camera lens clean of smudges or oil.
3. **Screen Glare or Low Brightness**:
   - Fullscreen QR mode automatically sets maximum brightness; avoid direct sunlight reflection on your glass display.

---

## 2. Lock-Screen Wallpaper Not Applying (Android OEMs)

### Causes & Fixes:
1. **Samsung One UI & Xiaomi HyperOS/MIUI Theme Locks**:
   - Certain Android skins prevent third-party applications from directly replacing the lock-screen wallpaper if an active theme is locked.
   - **Solution**: In Parichay, tap **"System Picker"** or **"Save Wallpaper Image"**. Open your phone's built-in **Gallery**, select the Parichay wallpaper image, tap the menu (three dots), and select **Set as Wallpaper &rarr; Lock screen**.
2. **Clock Overlap**:
   - The Parichay wallpaper generator strictly reserves the top 32% of the screen as a clock safe zone. If your lock-screen clock has large custom widgets, use the Android Lock Screen customizer to adjust clock placement.

---

## 3. Google Wallet "Photo" Option Missing

### Causes & Fixes:
1. **Google Wallet Version**:
   - The "Photo" pass feature is available in Google Wallet version `24.26+` and above.
   - Ensure the Google Wallet app is updated from the Google Play Store.
2. **Direct Gallery Save**:
   - In Parichay, tap **"Add to Google Wallet"** (or **"Save Pass Image"**).
   - In Google Wallet, tap **Add to Wallet &rarr; Photo**, select the pass from your recent images album.

---

## 4. Fonts Not Rendering for Special Characters or Names

### Causes & Fixes:
1. **Devanagari & Indic Scripts**:
   - Some Latin-only fonts (e.g. *Bodoni Moda*, *Playfair Display*) do not include glyphs for Hindi/Marathi/Sanskrit script.
   - If entering names in Devanagari, select **Kalam**, **Noto Sans Devanagari**, or **Noto Serif Devanagari** in the Style Studio for native glyph rendering.

---

## 5. Web Browser Cleared My Card Data

### Causes & Fixes:
1. **Safari 7-Day Storage Eviction**:
   - iOS Safari automatically evicts IndexedDB data for web apps that haven't been visited in 7 days if opened as a generic tab.
   - **Solution**: Install Parichay to your home screen via **Share &rarr; Add to Home Screen (PWA)**, or use the native Android/iOS app.
2. **Private Browsing / Incognito Mode**:
   - Browsers destroy IndexedDB when an incognito tab is closed. Use normal browsing or install as a PWA.
3. **Restoring Your Data**:
   - If storage is cleared, go to **Settings &rarr; Import Card Backup** and select your previously exported `.json` file to restore your card and styles in seconds.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
