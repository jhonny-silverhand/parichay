# Polish & Enhancement Backlog (BACKLOG.md)

This backlog contains prioritized, scoped engineering and design enhancements for Parichay. Each item is sized (S: &lt; 2 hrs, M: 2–6 hrs) with concrete acceptance criteria.

---

## Open Tasks

### Tier 1: Micro-Copy & Visual Refinement
- [ ] **POLISH-001**: Micro-copy audit on Onboarding skip cues.
  - *Size*: S
  - *Acceptance Criteria*: Ensure each optional field in onboarding has subtle "Optional" indicator in placeholder or label.
- [ ] **POLISH-002**: Empty state illustration alignment on newly cleared cards.
  - *Size*: S
  - *Acceptance Criteria*: EmptyState component matches the warm paper motif with custom SVG card outline.
- [ ] **POLISH-003**: Haptic feedback triggers on preset tap in Style Studio.
  - *Size*: S
  - *Acceptance Criteria*: When haptics is enabled in settings, tapping a PresetTile invokes `Haptics.impact({ style: ImpactStyle.Light })`.
- [ ] **POLISH-004**: Active tab indicator elevation micro-transition.
  - *Size*: S
  - *Acceptance Criteria*: Tabs transition smoothly across segmented options with spring easing.
- [ ] **POLISH-005**: Contrast ratio decimal formatting consistency in scan indicator.
  - *Size*: S
  - *Acceptance Criteria*: Format contrast ratio to 1 decimal place with `:1` suffix.

### Tier 2: QR & Styling Precision
- [ ] **POLISH-006**: Diamond module shape edge smoothing.
  - *Size*: S
  - *Acceptance Criteria*: Diamond path uses subtle quadratic bezier curves for softer corners.
- [ ] **POLISH-007**: Preset "Sunday Linen" eye accent tuning.
  - *Size*: S
  - *Acceptance Criteria*: Ensure inner eye of Sunday Linen maintains minimum 6.5:1 optical contrast against plate.
- [ ] **POLISH-008**: Color picker hex code input with auto-uppercase.
  - *Size*: S
  - *Acceptance Criteria*: Hex code text field automatically capitalizes and formats `#` prefix.
- [ ] **POLISH-009**: Double-tap on fullscreen QR to toggle dark background surround.
  - *Size*: M
  - *Acceptance Criteria*: User can tap a small surround toggle to test scanning in dark environments.
- [ ] **POLISH-010**: Monogram center element automatic initials generator.
  - *Size*: S
  - *Acceptance Criteria*: Center element uses first and last initials when "monogram" is chosen.

### Tier 3: Exports & Formats
- [ ] **POLISH-011**: Print business card crop marks toggle.
  - *Size*: M
  - *Acceptance Criteria*: Optional toggle to render traditional 3mm offset print crop marks on the 1050x600 canvas.
- [ ] **POLISH-012**: Story format background pattern opacity slider.
  - *Size*: S
  - *Acceptance Criteria*: Allow subtle texture overlay behind story card exports.
- [ ] **POLISH-013**: vCard UID stable urn generation.
  - *Size*: S
  - *Acceptance Criteria*: Ensure card ID is preserved consistently across backup exports and imports.
- [ ] **POLISH-014**: Wallet pass subtitle truncation handling for very long company names.
  - *Size*: S
  - *Acceptance Criteria*: Subtitles exceeding 42 characters truncate gracefully with ellipsis.
- [ ] **POLISH-015**: Lock-screen wallpaper tablet aspect ratio support (3:4 and 4:3).
  - *Size*: M
  - *Acceptance Criteria*: Safe zone geometry centers QR cleanly on iPad and Android tablet aspect ratios.

### Tier 4: Accessibility & Localization
- [ ] **POLISH-016**: Screen reader announcement on QR style preset selection.
  - *Size*: S
  - *Acceptance Criteria*: Add `aria-live="polite"` notification when preset changes.
- [ ] **POLISH-017**: Keyboard navigation focus rings on color swatch buttons.
  - *Size*: S
  - *Acceptance Criteria*: Swatch buttons display visible 2px offset focus ring on Tab navigation.
- [ ] **POLISH-018**: Devanagari numerals option for Hindi/Marathi cards.
  - *Size*: M
  - *Acceptance Criteria*: Allow formatting phone and address numbers in Devanagari script (०-९).
- [ ] **POLISH-019**: Screen reader alternative text describing card owner and contact summary.
  - *Size*: S
  - *Acceptance Criteria*: Canvas elements provide descriptive `aria-label` stating "QR code for [Name], [Title]".
- [ ] **POLISH-020**: High contrast mode token overrides.
  - *Size*: S
  - *Acceptance Criteria*: When `forced-colors: active` is detected, borders become solid 2px.

### Tier 5: Engineering & Automation
- [ ] **POLISH-021**: Vite bundle analyzer build script.
  - *Size*: S
  - *Acceptance Criteria*: Script `npm run analyze` to visualize asset sizes and tree-shaking efficiency.
- [ ] **POLISH-022**: Unit test coverage for corrupted JSON import resilience.
  - *Size*: S
  - *Acceptance Criteria*: Vitest test verifying malformed backup files return user-friendly error without crash.
- [ ] **POLISH-023**: Web Share API file capability detection fallback test.
  - *Size*: S
  - *Acceptance Criteria*: Unit test asserting anchor download fallback when `navigator.canShare` is false.
- [ ] **POLISH-024**: Weekly dependency freshness audit report automation.
  - *Size*: S
  - *Acceptance Criteria*: Script writing `npm outdated` and `npm audit` summaries to `docs/DEPENDENCY_REPORT.md`.
- [ ] **POLISH-025**: Automated screenshot pipeline across standard viewports.
  - *Size*: M
  - *Acceptance Criteria*: Playwright script capturing light/dark mode PNGs at 390x844 and 360x640 into `design/screens/`.
