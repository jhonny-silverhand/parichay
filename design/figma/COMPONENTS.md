# Figma Component Inventory & Variable Specification (COMPONENTS.md)

This specification mirrors the code architecture in `src/web/components/ui/` and `design/tokens/tokens.json`. A designer can copy these properties directly into Figma components using Auto Layout, Variants, and Variables.

---

## 1. Design Token Variables Mapping

| Token Name | Code Custom Property | Figma Variable Name | Light Value | Dark Value |
|------------|----------------------|---------------------|-------------|------------|
| `bg-primary` | `--color-bg-primary` | `Color/Background/Primary` | `#F7F5F0` | `#0F1115` |
| `bg-surface` | `--color-bg-surface` | `Color/Background/Surface` | `#FFFFFF` | `#181B21` |
| `bg-surface-sunken` | `--color-bg-surface-sunken` | `Color/Background/Sunken` | `#EFECE6` | `#13151A` |
| `bg-surface-elevated` | `--color-bg-surface-elevated` | `Color/Background/Elevated` | `#FFFFFF` | `#22262E` |
| `text-primary` | `--color-text-primary` | `Color/Text/Primary` | `#111317` | `#F3F1EC` |
| `text-secondary` | `--color-text-secondary` | `Color/Text/Secondary` | `#505663` | `#9EA4B1` |
| `text-tertiary` | `--color-text-tertiary` | `Color/Text/Tertiary` | `#7E8594` | `#6B7280` |
| `accent` | `--color-accent` | `Color/Brand/Accent` | `#B85226` | `#C85D2F` |
| `accent-hover` | `--color-accent-hover` | `Color/Brand/Accent Hover` | `#9E441D` | `#DF6E3D` |
| `accent-subtle` | `--color-accent-subtle` | `Color/Brand/Accent Subtle` | `#F6EAE4` | `#2D1D16` |
| `border-hairline` | `--color-border-hairline` | `Color/Border/Hairline` | `rgba(17,19,23,0.08)` | `rgba(255,255,255,0.09)` |
| `border-strong` | `--color-border-strong` | `Color/Border/Strong` | `rgba(17,19,23,0.16)` | `rgba(255,255,255,0.18)` |
| `status-success` | `--color-status-success` | `Color/Status/Success` | `#2D6A4F` | `#40916C` |
| `status-warning` | `--color-status-warning` | `Color/Status/Warning` | `#C05621` | `#DD6B20` |
| `status-error` | `--color-status-error` | `Color/Status/Error` | `#9B2226` | `#E53E3E` |

---

## 2. Core UI Components

### 1. Button (`src/web/components/ui/Button.tsx`)
- **Auto Layout**: Horizontal, Centered. Gap: `8px`.
- **Variants**:
  - `variant`: `primary`, `secondary`, `outline`, `ghost`, `danger`
  - `size`:
    - `sm`: Height `32px`, Padding `6px 12px`, Radius `8px`, Font `12px/600`
    - `md`: Height `44px` (touch target compliant), Padding `10px 16px`, Radius `12px`, Font `14px/600`
    - `lg`: Height `52px`, Padding `14px 24px`, Radius `12px`, Font `16px/600`
  - `state`: `default`, `hover`, `active`, `disabled` (Opacity `40%`)
  - `icon`: `none`, `left`, `right`

### 2. Input Field (`src/web/components/ui/Field.tsx`)
- **Auto Layout**: Vertical. Gap: `6px`. Width: `Fixed 100%`.
- **Label**: Font `Instrument Sans 12px/500`, Color `Color/Text/Secondary`.
- **Input Container**: Height `44px`, Padding `10px 14px`, Radius `12px`, Border `1px solid Color/Border/Strong`, Background `Color/Background/Surface`.
- **States**: `default`, `focus` (Border `Color/Brand/Accent`, Ring `1px`), `error` (Border `Color/Status/Error`).

### 3. Bottom Sheet Modal (`src/web/components/ui/Sheet.tsx`)
- **Auto Layout**: Vertical. Radius: Top `24px`, Bottom `0px`.
- **Background**: `Color/Background/Surface`. Elevation: `Elevation/Sheet`.
- **Drag Handle**: Width `48px`, Height `5px`, Radius `9999px`, Color `Color/Border/Strong`.
- **Header**: Title in `Fraunces 18px/700`, Subtitle in `Instrument Sans 12px/400`. Close icon button `40x40px`.

### 4. Segmented Control / Tabs (`src/web/components/ui/Tabs.tsx`)
- **Auto Layout**: Horizontal. Padding `4px`, Radius `12px`. Background `Color/Background/Sunken`.
- **Tab Item**: Height `32px`, Padding `6px 12px`, Radius `8px`.
  - Inactive: Text `Color/Text/Secondary 12px/600`.
  - Active: Background `Color/Background/Surface`, Shadow `Elevation/Subtle`, Text `Color/Text/Primary 12px/600`.

### 5. Swatch Color Picker (`src/web/components/ui/Swatch.tsx`)
- **Dimensions**: `32x32px` circle (`radius: 9999px`).
- **Border**: `1px solid rgba(0,0,0,0.1)`.
- **Active State**: Inset checkmark icon in contrasting white or obsidian.

### 6. Preset Tile (`src/web/components/ui/PresetTile.tsx`)
- **Card**: Width `96px`, Height `104px`, Radius `16px`. Auto Layout Vertical, Centered.
- **Preview Thumbnail**: Width `80px`, Height `64px`, Radius `12px`.
  - Miniature QR Plate: `40x40px` with 3 eye blocks.
- **Label**: `Instrument Sans 10px/500`, Centered.

### 7. Bottom Navigation Tab Bar (`src/web/components/ui/TabBar.tsx`)
- **Frame**: Width `390px` (or `100%`), Height `64px` + Safe Area Bottom (`34px`).
- **Surface**: `Color/Background/Surface` with `95%` opacity + background blur.
- **Border**: Top `1px solid Color/Border/Hairline`.
- **Items**: 3 equal columns (`Card`, `Studio`, `Settings`). Icon `20x20px`, Label `10px/600`.

---

## 3. Screen Layout Frames

1. **Mobile Baseline (iPhone 14 / 15)**: `390 x 844 px`
2. **Compact Android Baseline**: `360 x 640 px`
3. **Lock-Screen Wallpaper Canvas**: `1080 x 2400 px` (Safe zone top `32%`, bottom `14%`)
4. **Wallet Pass Canvas**: `1080 x 1350 px`
5. **Print Business Card Canvas**: `1050 x 600 px` (3.5" x 2" at 300 DPI)
