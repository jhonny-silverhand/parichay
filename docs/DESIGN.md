# Design Architecture & Rationale (DESIGN.md)

## 1. Design Direction: Apple Polish + Editorial Typography + Cinematic Restraint

Parichay was designed with an anti-AI-slop philosophy. Most contemporary mobile card apps default to purple-cyan gradient cards, glowing neon buttons, rounded pill badges around metadata, and noisy telemetry stats. Parichay rejects decoration in favor of deliberate structure:

1. **Physical Card Metaphor**: The digital QR is treated like fine-art print paper resting on dark slate. Warm linen plates (`#F7F5F0`), deep obsidian chrome (`#111317`), and a single disciplined terracotta accent (`#B85226`) derived from Indian earthenware.
2. **Editorial Typographic Contrast**: Pairing the expressive character of variable serif `Fraunces` with the precision and legibility of `Instrument Sans`.
3. **Zero Pill Discipline**: Tags and metadata are presented as unboxed typographic lines with subtle separators (`·`), never floating candy capsules.
4. **Above-the-Fold Invariant**: On a compact 360x640 Android screen, the hero QR and primary action buttons sit cleanly above the fold without scrolling.

---

## 2. Reference Patterns & Influences

- **Instagram Android Profile QR Flow**:
  - *Pattern Adopted*: Instant live visual preview with a horizontal carousel of large, tappable presets directly below the QR code. Sharing is the natural final action.
- **Telegram iOS Profile Editor**:
  - *Pattern Adopted*: Calm, sectioned identity forms with quiet dividers and an in-memory square crop avatar.
- **Blinq Digital Business Card**:
  - *Pattern Adopted*: Card-first onboarding flow that demonstrates the value of the product before asking for permissions.
- **Apple & Material 3 Safe Zones**:
  - *Pattern Adopted*: Lock-screen wallpaper geometry keeping top 32% (clock, notifications) and bottom 14% (camera shortcuts, navigation gesture bar) completely clear.

---

## 3. Screen Inventory

| Screen | Route | Visual Focal Point | Primary Action | Secondary Actions |
|--------|-------|--------------------|----------------|-------------------|
| **Onboarding** | `/onboarding` | Live updating card preview bar | "Create My Card" / "Continue" | Back, Skip optional |
| **Card Home** | `/` | Hero styled QR plate | "Fullscreen" / "Share" | Style, Wallet, Wallpaper, Edit |
| **Card Editor** | `/editor` | Live QR size meter & photo avatar | "Save Changes" | Toggle In-QR per field, Remove Photo |
| **QR Fullscreen** | `/qr/fullscreen` | Ultra-high contrast QR with wake lock | Tap to dismiss | Close button |
| **Style Studio** | `/studio` | Live canvas with scan reliability pill | Apply preset / Tweak tabs | Reset to Plain, Surprise me |
| **Share & Export** | `/share` | Export format cards with file sizes | Download / Native Share | Back |
| **Wallet Guide** | `/wallet` | 1080x1350 clean pass image | "Save Pass Image" | "Open Google Wallet" |
| **Wallpaper** | `/wallpaper` | Phone frame with faux lock screen clock | "Set Lock Screen (Android)" | "Save Image (iOS)", Change Backdrop |
| **Settings** | `/settings` | Local storage status & persistence | "Export Backup" | Theme toggle, Privacy sheet, Erase |

---

## 4. Accessibility & Spatial Mathematics

- **Touch Targets**: All interactive elements maintain a minimum bounding box of `44 x 44 px`.
- **Contrast Ratios**: Body text on background exceeds `12:1`. Large titles exceed `15:1`. Secondary labels exceed `4.8:1`.
- **Motion**: Durations are restrained to `180ms`–`260ms` with physical ease-out curves (`cubic-bezier(0.2, 0, 0, 1)`).
- **Reduced Motion**: All transitions and animations collapse to `0.01ms` when `prefers-reduced-motion: reduce` is detected.
