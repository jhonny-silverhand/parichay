# Parichay Data Model Specification

Parichay enforces strict local data modeling using TypeScript interfaces and Zod runtime schema validators.

---

## 1. Contact Card Schema (`Card`)

```typescript
export interface Card {
  id: string;              // UUID or timestamp-based ID
  firstName: string;       // Max 60 characters
  lastName: string;        // Max 60 characters
  jobTitle?: string;       // Max 60 characters
  company?: string;        // Max 60 characters
  phones: PhoneEntry[];    // Max 4 entries
  emails: EmailEntry[];    // Max 4 entries
  websites: WebsiteEntry[];// Max 3 entries
  socials: SocialEntry[];  // Max 4 entries
  notes?: string;          // Max 160 characters
  updatedAt: string;       // ISO 8601 string
  qrFingerprint: string;   // Deterministic hash of payload
}
```

### Sub-Entities
- `PhoneEntry`: `{ id: string, number: string, label: string, isPrimary: boolean }`
- `EmailEntry`: `{ id: string, address: string, label: string, isPrimary: boolean }`
- `WebsiteEntry`: `{ id: string, url: string, label: string }`
- `SocialEntry`: `{ id: string, platform: 'linkedin' | 'x' | 'github' | 'instagram' | 'whatsapp' | 'other', username: string, url: string }`

---

## 2. Style Schema (`CardStyle`)

```typescript
export interface CardStyle {
  dotColor: string;             // Hex color (#RRGGBB)
  dotType: 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  cornerSquareColor: string;    // Hex color
  cornerSquareType: 'dot' | 'square' | 'extra-rounded';
  cornerDotColor: string;       // Hex color
  cornerDotType: 'dot' | 'square';
  backgroundColor: string;      // Hex color
  plateColor: string;           // Hex color (plate behind QR)
  plateRadius: number;          // Border radius in pixels (0 - 32)
  quietZone: number;            // Padding modules around QR (min 3)
  fontFamily: string;           // Key matching self-hosted FONT_CATALOG
  centerElement: {
    type: 'none' | 'photo' | 'initials' | 'icon';
    value?: string;
  };
}
```

---

## 3. Settings Schema (`UserSettings`)

```typescript
export interface UserSettings {
  theme: 'system' | 'light' | 'dark';
  enableHaptics: boolean;
  backupReminderDays: number; // Default 30 days
  autoMaximizeBrightness: boolean;
}
```

---

## 4. Normalization Rules

1. **Phone Numbers**:
   - Stripped of formatting characters, then formatted via `libphonenumber-js`.
   - International numbers stored with `+` and country code.
   - Fallback raw format if unparseable to prevent user data loss.
2. **Websites**:
   - Prepend `https://` if no protocol is entered.
   - Clean trailing slashes.
3. **Emails**:
   - Lowercased and whitespace trimmed.
4. **vCard Line Folding**:
   - RFC 6350 enforces folding at 75 octets using CRLF followed by a single space. Multibyte UTF-8 characters are never split across line boundaries.

---

## 5. Migration History

| Version | Released | Changes |
| :--- | :--- | :--- |
| **v1** | 2026-10-04 | Initial schema. Card, Style, Settings, and Backup definitions. |

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
