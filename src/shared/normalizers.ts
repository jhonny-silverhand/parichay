import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';

export const DEFAULT_PHONE_REGION = 'IN';

/**
 * Strips dangerous control characters and null bytes while keeping whitespace.
 */
export function sanitizeString(val: unknown): string {
  if (typeof val !== 'string') return '';
  // Remove ASCII control characters (0-31 except \t, \n, \r) and 127 (DEL)
  return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

/**
 * Normalizes phone numbers to E.164 standard.
 * Falls back to default region 'IN' if international prefix is not provided.
 */
export function normalizePhone(raw: string, defaultCountry = DEFAULT_PHONE_REGION): string | null {
  const clean = sanitizeString(raw);
  if (!clean) return null;

  try {
    const phoneNumber = parsePhoneNumberWithError(clean, defaultCountry as any);
    if (phoneNumber.isValid()) {
      return phoneNumber.format('E.164');
    }
  } catch {
    // If libphonenumber fails, test basic E.164 digits regex
    const digitsOnly = clean.replace(/[^\d+]/g, '');
    if (/^\+?[1-9]\d{6,14}$/.test(digitsOnly)) {
      return digitsOnly.startsWith('+') ? digitsOnly : `+${digitsOnly}`;
    }
  }
  return null;
}

/**
 * Normalizes a website URL. Requires http or https, rejects javascript/data URIs,
 * ensures hostname has a dot, and defaults to https:// if protocol is omitted.
 */
export function normalizeWebsite(raw: string): string | null {
  let clean = sanitizeString(raw);
  if (!clean) return null;

  // Reject malicious schemes
  const lower = clean.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return null;
  }

  // Prepend https:// if no protocol exists
  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }

  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // Must have a valid hostname with at least one dot (e.g. example.com) or localhost
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return null;
    }
    // Normalize to https
    parsed.protocol = 'https:';
    return parsed.toString().replace(/\/$/, ''); // Remove trailing slash for compactness
  } catch {
    return null;
  }
}

/**
 * Normalizes LinkedIn input.
 * Accepts: bare username, "in/username", or full URL.
 * Output: canonical https://www.linkedin.com/in/{username}
 */
export function normalizeLinkedIn(raw: string): string | null {
  let clean = sanitizeString(raw);
  if (!clean) return null;

  // If full URL
  if (/^https?:\/\//i.test(clean)) {
    try {
      const parsed = new URL(clean);
      if (!parsed.hostname.includes('linkedin.com')) return null;
      const parts = parsed.pathname.split('/').filter(Boolean);
      const inIdx = parts.indexOf('in');
      if (inIdx !== -1 && parts[inIdx + 1]) {
        const username = parts[inIdx + 1].replace(/[?#].*$/, '');
        return `https://www.linkedin.com/in/${encodeURIComponent(username)}`;
      }
      if (parts.length > 0) {
        return `https://www.linkedin.com/in/${encodeURIComponent(parts[parts.length - 1])}`;
      }
    } catch {
      return null;
    }
  }

  // If "in/username" or bare handle
  clean = clean.replace(/^(linkedin\.com\/|www\.linkedin\.com\/)?(in\/)?/i, '').replace(/\/$/, '');
  if (/^[A-Za-z0-9_\-\u00C0-\u024F]{2,100}$/.test(clean)) {
    return `https://www.linkedin.com/in/${clean}`;
  }
  return null;
}

/**
 * Normalizes Instagram handle.
 * Accepts: bare handle or @handle or URL.
 * Handle pattern: ^[A-Za-z0-9._]{1,30}$
 * Returns bare handle (without @)
 */
export function normalizeInstagram(raw: string): string | null {
  let clean = sanitizeString(raw);
  if (!clean) return null;

  clean = clean.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/\/.*$/, '');
  if (/^[A-Za-z0-9._]{1,30}$/.test(clean)) {
    return clean;
  }
  return null;
}

/**
 * Normalizes X (Twitter) handle.
 * Accepts: bare handle or @handle or URL.
 * Handle pattern: ^[A-Za-z0-9_]{1,15}$
 * Returns bare handle (without @)
 */
export function normalizeXHandle(raw: string): string | null {
  let clean = sanitizeString(raw);
  if (!clean) return null;

  clean = clean.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').replace(/^@/, '').replace(/\/.*$/, '');
  if (/^[A-Za-z0-9_]{1,15}$/.test(clean)) {
    return clean;
  }
  return null;
}

/**
 * Normalizes WhatsApp input.
 * Accepts: phone number or wa.me/digits URL.
 * Returns E.164 digits string (e.g. 919876543210 without '+')
 */
export function normalizeWhatsApp(raw: string, defaultCountry = DEFAULT_PHONE_REGION): string | null {
  let clean = sanitizeString(raw);
  if (!clean) return null;

  clean = clean.replace(/^https?:\/\/wa\.me\//i, '').replace(/[^\d+]/g, '');
  const e164 = normalizePhone(clean, defaultCountry);
  if (e164) {
    return e164.replace(/^\+/, ''); // wa.me format digits
  }
  return null;
}

/**
 * Normalizes email address.
 */
export function normalizeEmail(raw: string): string | null {
  const clean = sanitizeString(raw).toLowerCase();
  if (!clean || clean.length > 254) return null;
  // RFC 5322 simplified pattern
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(clean)) {
    return clean;
  }
  return null;
}
