import type { Card } from './card';

/**
 * Escapes characters for vCard text values according to RFC 2426 / 6350.
 * Characters to escape: \ -> \\, ; -> \;, , -> \,, and newlines -> \n
 */
export function escapeVCardText(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Folds lines strictly at 75 OCTETS (bytes) per RFC 2426 / RFC 6350.
 * Crucial: Never split in the middle of a multibyte UTF-8 code point!
 * Continuation lines start with a single ASCII space (0x20).
 */
export function foldVCardLine(line: string, maxBytes = 75): string {
  const encoder = new TextEncoder();
  const lineBytes = encoder.encode(line);
  if (lineBytes.length <= maxBytes) {
    return line;
  }

  const result: string[] = [];
  let currentStart = 0;

  while (currentStart < line.length) {
    const limit = currentStart === 0 ? maxBytes : maxBytes - 1; // 1 byte for leading space
    let sliceEnd = currentStart;
    let byteAcc = 0;

    while (sliceEnd < line.length) {
      const codePoint = line.codePointAt(sliceEnd)!;
      const charLen = codePoint > 0xffff ? 2 : 1;
      const charStr = line.slice(sliceEnd, sliceEnd + charLen);
      const charBytes = encoder.encode(charStr).length;

      if (byteAcc + charBytes > limit) {
        break;
      }
      byteAcc += charBytes;
      sliceEnd += charLen;
    }

    // Safety fallback: ensure at least one character progresses
    if (sliceEnd === currentStart) {
      const codePoint = line.codePointAt(currentStart)!;
      sliceEnd += codePoint > 0xffff ? 2 : 1;
    }

    const chunk = line.slice(currentStart, sliceEnd);
    if (currentStart === 0) {
      result.push(chunk);
    } else {
      result.push(` ${chunk}`);
    }
    currentStart = sliceEnd;
  }

  return result.join('\r\n');
}

/**
 * Builds compact vCard 3.0 string for QR matrix embedding.
 * Strips all unnecessary headers/metadata to keep bytes minimal.
 */
export function buildCompactVCard(card: Card): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];
  const inc = card.qrInclude;

  // Name
  if (inc.name) {
    const last = escapeVCardText(card.lastName || '');
    const first = escapeVCardText(card.firstName || '');
    lines.push(`N:${last};${first};;;`);
    const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');
    lines.push(`FN:${escapeVCardText(fullName)}`);
  } else {
    lines.push(`N:;${escapeVCardText(card.firstName)};;;`);
    lines.push(`FN:${escapeVCardText(card.firstName)}`);
  }

  // Company / Org
  if (inc.company && card.company) {
    lines.push(`ORG:${escapeVCardText(card.company)}`);
  }

  // Job Title
  if (inc.jobTitle && card.jobTitle) {
    lines.push(`TITLE:${escapeVCardText(card.jobTitle)}`);
  }

  // Phone
  if (inc.phone && card.phone) {
    lines.push(`TEL;TYPE=CELL:${card.phone}`);
  }

  // Email
  if (inc.email && card.email) {
    lines.push(`EMAIL:${escapeVCardText(card.email)}`);
  }

  // Website
  if (inc.website && card.website) {
    lines.push(`URL:${card.website}`);
  }

  // Location
  if (inc.location && card.location) {
    lines.push(`ADR;TYPE=WORK:;;;${escapeVCardText(card.location)};;;`);
  }

  // Social Links in QR (compact single URL lines)
  if (inc.linkedin && card.linkedin) {
    lines.push(`URL:${card.linkedin}`);
  }
  if (inc.instagram && card.instagram) {
    lines.push(`URL:https://instagram.com/${card.instagram}`);
  }
  if (inc.xHandle && card.xHandle) {
    lines.push(`URL:https://x.com/${card.xHandle}`);
  }
  if (inc.whatsapp && card.whatsapp) {
    lines.push(`URL:https://wa.me/${card.whatsapp}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Builds rich vCard 3.0 string for .vcf file export.
 * Includes RFC line folding, UID, PRODID, REV, itemN labels, and base64 photo if present.
 */
export function buildFullVCard(card: Card, photoBase64?: string | null): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const last = escapeVCardText(card.lastName || '');
  const first = escapeVCardText(card.firstName || '');
  lines.push(foldVCardLine(`N:${last};${first};;;`));
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');
  lines.push(foldVCardLine(`FN:${escapeVCardText(fullName)}`));

  if (card.company) {
    lines.push(foldVCardLine(`ORG:${escapeVCardText(card.company)}`));
  }
  if (card.jobTitle) {
    lines.push(foldVCardLine(`TITLE:${escapeVCardText(card.jobTitle)}`));
  }
  if (card.phone) {
    lines.push(foldVCardLine(`TEL;TYPE=CELL,VOICE:${card.phone}`));
  }
  if (card.email) {
    lines.push(foldVCardLine(`EMAIL;TYPE=INTERNET,WORK:${escapeVCardText(card.email)}`));
  }
  if (card.website) {
    lines.push(foldVCardLine(`URL;TYPE=WORK:${card.website}`));
  }
  if (card.location) {
    lines.push(foldVCardLine(`ADR;TYPE=WORK:;;;${escapeVCardText(card.location)};;;`));
  }

  // Sequentially numbered social links with itemN labels
  let itemCounter = 1;
  if (card.linkedin) {
    lines.push(foldVCardLine(`item${itemCounter}.URL:${card.linkedin}`));
    lines.push(foldVCardLine(`item${itemCounter}.X-ABLabel:LinkedIn`));
    itemCounter++;
  }
  if (card.instagram) {
    lines.push(foldVCardLine(`item${itemCounter}.URL:https://instagram.com/${card.instagram}`));
    lines.push(foldVCardLine(`item${itemCounter}.X-ABLabel:Instagram`));
    itemCounter++;
  }
  if (card.xHandle) {
    lines.push(foldVCardLine(`item${itemCounter}.URL:https://x.com/${card.xHandle}`));
    lines.push(foldVCardLine(`item${itemCounter}.X-ABLabel:X`));
    itemCounter++;
  }
  if (card.whatsapp) {
    lines.push(foldVCardLine(`item${itemCounter}.URL:https://wa.me/${card.whatsapp}`));
    lines.push(foldVCardLine(`item${itemCounter}.X-ABLabel:WhatsApp`));
    itemCounter++;
  }

  // Profile photo embedding (base64)
  if (photoBase64) {
    // Strip data URI prefix if present
    const cleanB64 = photoBase64.replace(/^data:image\/[a-z]+;base64,/i, '').replace(/\s+/g, '');
    lines.push(foldVCardLine(`PHOTO;ENCODING=b;TYPE=JPEG:${cleanB64}`));
  }

  lines.push(`UID:urn:uuid:${card.id}`);
  lines.push('PRODID:-//Parichay//EN');
  lines.push(`REV:${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`);
  lines.push('END:VCARD');

  return lines.join('\r\n') + '\r\n';
}

/**
 * Computes deterministic fingerprint (hash) of the vCard payload.
 */
export function computeQRFingerprint(vcardPayload: string): string {
  let hash = 5381;
  for (let i = 0; i < vcardPayload.length; i++) {
    hash = (hash * 33) ^ vcardPayload.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Calculates size status and estimated QR version from byte count.
 */
export function getQRPayloadMetrics(payload: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payload).length;

  let status: 'green' | 'amber' | 'red' = 'green';
  if (bytes > 450) {
    status = 'red';
  } else if (bytes > 250) {
    status = 'amber';
  }

  // Approximate QR version under Error Correction M (Version 1 = 14 bytes, Version 4 = 62 bytes, Version 10 = 271 bytes, etc.)
  let version = 1;
  if (bytes > 450) version = 14;
  else if (bytes > 350) version = 12;
  else if (bytes > 250) version = 10;
  else if (bytes > 180) version = 8;
  else if (bytes > 120) version = 6;
  else if (bytes > 70) version = 4;
  else version = 2;

  return {
    bytes,
    version,
    status,
    isExceeded: bytes > 700,
  };
}

/**
 * Generates an ASCII-safe filename for .vcf exports.
 */
export function getVCFExportFilename(firstName: string, lastName?: string | null): string {
  const cleanFirst = (firstName || 'Contact').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanLast = (lastName || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const base = cleanLast ? `${cleanFirst}-${cleanLast}` : cleanFirst;
  return `${base}.vcf`;
}
