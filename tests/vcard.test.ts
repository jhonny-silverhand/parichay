import { describe, it, expect } from 'vitest';
import {
  escapeVCardText,
  foldVCardLine,
  buildCompactVCard,
  buildFullVCard,
  computeQRFingerprint,
  getQRPayloadMetrics,
  getVCFExportFilename,
} from '@/shared/vcard';
import type { Card } from '@/shared/card';

const sampleCard: Card = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  schemaVersion: 1,
  firstName: 'Aditi',
  lastName: 'Sharma',
  jobTitle: 'Principal Architect',
  company: 'Studio Parichay, Inc.',
  phone: '+919876543210',
  email: 'aditi@example.com',
  website: 'https://example.com',
  location: 'Mumbai, India',
  linkedin: 'https://www.linkedin.com/in/aditisharma',
  instagram: 'aditi.designs',
  xHandle: 'aditisharma',
  whatsapp: '919876543210',
  photoPresent: false,
  qrInclude: {
    name: true,
    jobTitle: true,
    company: true,
    phone: true,
    email: true,
    website: true,
    location: false,
    linkedin: false,
    instagram: false,
    xHandle: false,
    whatsapp: false,
  },
  createdAt: '2026-10-04T12:00:00Z',
  updatedAt: '2026-10-04T12:00:00Z',
  qrFingerprint: '',
};

describe('vCard 3.0 Generation & RFC Compliance', () => {
  describe('escapeVCardText', () => {
    it('escapes backslashes, semicolons, commas, and newlines', () => {
      const raw = 'Parichay\\Design; Mumbai, India\nFloor 4';
      const escaped = escapeVCardText(raw);
      expect(escaped).toBe('Parichay\\\\Design\\; Mumbai\\, India\\nFloor 4');
    });
  });

  describe('foldVCardLine (75 Octets Rule)', () => {
    it('does not fold lines shorter than 75 octets', () => {
      const short = 'FN:Aditi Sharma';
      expect(foldVCardLine(short)).toBe(short);
    });

    it('folds long ASCII lines strictly at 75 octets with leading space continuation', () => {
      const longAscii = 'NOTE:' + 'A'.repeat(160);
      const folded = foldVCardLine(longAscii);
      const lines = folded.split('\r\n');
      expect(lines.length).toBeGreaterThan(2);

      const encoder = new TextEncoder();
      expect(encoder.encode(lines[0]).length).toBeLessThanOrEqual(75);
      lines.slice(1).forEach((l) => {
        expect(l.startsWith(' ')).toBe(true);
        expect(encoder.encode(l).length).toBeLessThanOrEqual(75);
      });
    });

    it('never splits a multibyte UTF-8 code point across lines', () => {
      // Devanagari character 'परिचय' contains 3-byte UTF-8 sequences
      const devanagariSeq = 'FN:' + 'परिचय '.repeat(20);
      const folded = foldVCardLine(devanagariSeq);
      const lines = folded.split('\r\n');

      const decoder = new TextDecoder('utf-8', { fatal: true });
      const encoder = new TextEncoder();

      // Ensure every single chunk can be decoded without decoding errors
      lines.forEach((l) => {
        const bytes = encoder.encode(l);
        expect(() => decoder.decode(bytes)).not.toThrow();
      });
    });
  });

  describe('buildCompactVCard', () => {
    it('outputs compact vCard with CRLF line endings', () => {
      const vcard = buildCompactVCard(sampleCard);
      expect(vcard.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n')).toBe(true);
      expect(vcard.endsWith('\r\nEND:VCARD')).toBe(true);
      expect(vcard).toContain('FN:Aditi Sharma');
      expect(vcard).toContain('TEL;TYPE=CELL:+919876543210');
      expect(vcard).toContain('EMAIL:aditi@example.com');
      // Stripped metadata check
      expect(vcard).not.toContain('PRODID');
      expect(vcard).not.toContain('UID');
      expect(vcard).not.toContain('PHOTO');
    });

    it('respects per-field toggles', () => {
      const cardWithDisabledFields: Card = {
        ...sampleCard,
        qrInclude: {
          ...sampleCard.qrInclude,
          phone: false,
          email: false,
        },
      };
      const vcard = buildCompactVCard(cardWithDisabledFields);
      expect(vcard).not.toContain('TEL;TYPE=CELL');
      expect(vcard).not.toContain('EMAIL');
    });
  });

  describe('buildFullVCard', () => {
    it('includes UID, PRODID, REV, and structured social labels', () => {
      const full = buildFullVCard({
        ...sampleCard,
        linkedin: 'https://www.linkedin.com/in/aditisharma',
        instagram: 'aditi.designs',
      });
      expect(full).toContain('UID:urn:uuid:a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
      expect(full).toContain('PRODID:-//Parichay//EN');
      expect(full).toContain('item1.X-ABLabel:LinkedIn');
      expect(full).toContain('item2.X-ABLabel:Instagram');
    });

    it('embeds folded base64 photo when supplied', () => {
      const mockPhoto = 'data:image/jpeg;base64,' + 'B'.repeat(300);
      const full = buildFullVCard(sampleCard, mockPhoto);
      expect(full).toContain('PHOTO;ENCODING=b;TYPE=JPEG:');
      const lines = full.split('\r\n');
      const photoLine = lines.find((l) => l.includes('PHOTO;ENCODING=b'));
      expect(photoLine).toBeDefined();
    });
  });

  describe('computeQRFingerprint & Metrics', () => {
    it('computes deterministic hash', () => {
      const p1 = buildCompactVCard(sampleCard);
      const h1 = computeQRFingerprint(p1);
      const h2 = computeQRFingerprint(p1);
      expect(h1).toBe(h2);

      const modified = { ...sampleCard, firstName: 'Aarav' };
      const p2 = buildCompactVCard(modified);
      const h3 = computeQRFingerprint(p2);
      expect(h1).not.toBe(h3);
    });

    it('calculates size thresholds accurately', () => {
      const metrics = getQRPayloadMetrics('A'.repeat(200));
      expect(metrics.status).toBe('green');

      const metricsAmber = getQRPayloadMetrics('A'.repeat(320));
      expect(metricsAmber.status).toBe('amber');

      const metricsRed = getQRPayloadMetrics('A'.repeat(520));
      expect(metricsRed.status).toBe('red');

      const metricsExceeded = getQRPayloadMetrics('A'.repeat(720));
      expect(metricsExceeded.isExceeded).toBe(true);
    });
  });

  describe('getVCFExportFilename', () => {
    it('sanitizes non-ASCII and special characters', () => {
      expect(getVCFExportFilename('Aditi', 'Sharma')).toBe('Aditi-Sharma.vcf');
      expect(getVCFExportFilename('Aditi', null)).toBe('Aditi.vcf');
      expect(getVCFExportFilename('John/Doe', 'Smith*')).toBe('John_Doe-Smith_.vcf');
    });
  });
});
