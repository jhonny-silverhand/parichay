# Parichay Testing Strategy

Because Parichay operates without external network services, automated verification focuses on **contact format compliance, cryptographic payload invariants, visual contrast, and offline optical decodability**.

---

## 1. Test Architecture Overview

All tests are implemented in **Vitest 5** running in Node environment with JSDOM support where required:

| Test File | Focus Area | Tests |
| :--- | :--- | :--- |
| `tests/vcard.test.ts` | RFC 6350 compliance, escaping special characters, 75-octet folding | 11 |
| `tests/normalizers.test.ts` | International phone formatting, email hygiene, URL sanitization | 17 |
| `tests/qr-matrix.test.ts` | QR error correction levels, payload byte limits, matrix generation | 2 |
| `tests/scan-check.test.ts` | Optical decode loopback (`qrcode` &rarr; `canvas` &rarr; `jsQR`) | 4 |
| `tests/wallpaper-geometry.test.ts`| Clock safe-zone ratio (32%) and shortcut bottom safe-zone ratio (14%) | 4 |
| `tests/fonts-fallback.test.ts` | Font catalogue integrity, script coverage (Latin & Devanagari) | 4 |
| `tests/tokens.test.ts` | Design token synchronization between `tokens.json` and CSS | 3 |
| **Total** | | **45 Tests** |

---

## 2. Running Test Suites

```bash
# Run all Vitest unit tests once
npm run test

# Run tests in watch mode during development
npx vitest

# Run privacy audit (enforces 0 network APIs)
npm run check:privacy

# Run documentation consistency check
npm run docs:check

# Run full release pipeline verification
npm run verify:all
```

---

## 3. How to Add New Tests

1. Create or open the test file in `tests/<domain>.test.ts`.
2. Import `describe`, `it`, and `expect` from `vitest`.
3. Follow the pure offline rule: do not mock network calls with fake HTTP adapters; tests must execute in-memory with real data.
4. Run `npm run test` to verify.

---

## 4. Known Testing Gaps

1. **Hardware Camera Sensor Emulation**: Vitest tests optical decodability using `jsQR` on synthetic canvas buffers; real-world camera autofocus and lens distortion must be verified on physical iOS and Android hardware before release.
2. **OEM Theming Engine Overrides**: Direct lock-screen wallpaper behavior on vendor skins (Samsung One UI, Xiaomi HyperOS) requires physical device smoke testing.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
