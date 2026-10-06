# Figma Design Package Import Guide (FIGMA_GUIDE.md)

This step-by-step guide explains how to import Parichay's design system tokens, vector assets, and screen compositions into Figma in minutes.

---

## 1. Import Design Tokens & Variables

1. Open Figma and create a new project named **Parichay Design System**.
2. Install the **Tokens Studio for Figma** plugin (or use Figma's native Local Variables import).
3. In Tokens Studio:
   - Navigate to **Settings &rarr; Load from File**.
   - Select `design/tokens/tokens.json` from this repository.
   - Click **Apply to Document**.
4. All color scales (`light` and `dark`), spacing intervals (`4/8pt`), corner radii, and typography styles will be mapped automatically to Figma Variables and Text Styles.

---

## 2. Import Brand Marks & Vector Assets

1. From the `design/brand/` directory, drag and drop the following SVG assets into a new Figma page named **01 Brand & Identity**:
   - `logo.svg`: Full brand lockup.
   - `wordmark.svg`: Editorial wordmark.
   - `monogram.svg`: Minimalist capital 'P' icon with QR aperture.
   - `adaptive-fg.svg` & `adaptive-bg.svg`: Android adaptive icon layers.
   - `splash-light.svg` & `splash-dark.svg`: Native splash screens.
   - `og-image.svg`: OpenGraph share card (1200x630).
2. The fonts used in the brand marks (`Fraunces` and `Instrument Sans`) are freely available Google Fonts and are installed locally or available via Figma font picker.

---

## 3. Rebuild UI Components with Auto Layout

1. Follow the component specifications documented in `design/figma/COMPONENTS.md`.
2. Set up component variants for:
   - `Button`: Primary, Secondary, Outline, Ghost, Danger across `sm`, `md`, `lg`.
   - `Field`: Default, Focused, and Error validation states.
   - `PresetTile`: Inactive and Selected states with check badge.
   - `TabBar`: 3-column navigation bar matching iOS safe area guidelines.

---

## 4. Setting Up Light and Dark Mode Themes

1. In Figma's **Local Variables** modal, create two modes under the `Color` collection:
   - Mode 1: `Light` (Default)
   - Mode 2: `Dark`
2. Assign the hex and rgba values specified in `design/tokens/tokens.json`.
3. To preview any frame in Dark Mode, select the frame and set the variable mode to **Dark** in the right-hand design panel.

---

## 5. Prototyping Key User Journeys

### Flow A: First Card Creation (Onboarding &rarr; Home)
1. Frame 1: `01_Onboarding_Welcome` (Value proposition).
   - "Create My Card" button &rarr; Navigate to `02_Onboarding_Identity` (Smart Animate `250ms`).
2. Frame 2: `02_Onboarding_Identity` &rarr; "Continue" &rarr; `03_Onboarding_Contact`.
3. Frame 3: `03_Onboarding_Contact` &rarr; "Continue" &rarr; `04_Onboarding_Photo`.
4. Frame 4: `04_Onboarding_Photo` &rarr; "Done & View QR" &rarr; `05_Card_Home`.

### Flow B: Style Customization & Live Scanning
1. Frame: `05_Card_Home` &rarr; Click "Style" &rarr; Open `06_Style_Studio`.
2. In `06_Style_Studio`, link horizontal preset chips to swap variant styles (`Ink`, `Terracotta`, `Midnight Press`).
3. Note the live scan indicator banner (`Scans well` vs `Warning`).

### Flow C: Lock-Screen Wallpaper & Wallet
1. Frame: `05_Card_Home` &rarr; Click "Wallpaper" &rarr; `07_Wallpaper_Studio`.
2. Faux lock-screen safe zone shows clock overlay (top `32%`) and bottom gestures (bottom `14%`).
3. Click "Wallet" &rarr; `08_Wallet_Guide` showcasing the 1080x1350 photo pass layout.

---

## 6. Native File Note
As an automated CI/CD environment, proprietary binary `.fig` files cannot be generated without Figma's closed binary exporter. This package provides 100% compliant W3C/Tokens Studio JSON, pure SVG vectors, and exact Auto Layout component blueprints.
