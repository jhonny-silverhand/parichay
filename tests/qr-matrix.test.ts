import { describe, it, expect } from 'vitest';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { buildCompactVCard } from '@/shared/vcard';
import type { Card } from '@/shared/card';

const sampleCard: Card = {
  id: 'b1ffcd88-8d0a-4ef8-bb6d-5cc8bd380a22',
  schemaVersion: 1,
  firstName: 'Vikram',
  lastName: 'Patil',
  jobTitle: 'Design Lead',
  company: 'Parichay Labs',
  phone: '+919123456789',
  email: 'vikram@example.com',
  website: 'https://example.com',
  location: null,
  linkedin: null,
  instagram: null,
  xHandle: null,
  whatsapp: null,
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

describe('QR Matrix Encode & Decode Round-Trip', () => {
  it('encodes vCard payload and decodes back via jsQR with 100% fidelity', async () => {
    const payload = buildCompactVCard(sampleCard);
    expect(payload).toContain('FN:Vikram Patil');

    // Generate QR matrix
    const qr = QRCode.create(payload, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const quietZone = 4;
    const totalModules = moduleCount + quietZone * 2;
    const scale = 8;
    const size = totalModules * scale;

    // Build RGBA byte buffer
    const rgba = new Uint8ClampedArray(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const modX = Math.floor(x / scale) - quietZone;
        const modY = Math.floor(y / scale) - quietZone;

        let isDark = false;
        if (modX >= 0 && modX < moduleCount && modY >= 0 && modY < moduleCount) {
          isDark = qr.modules.get(modY, modX) === 1;
        }

        const offset = (y * size + x) * 4;
        const col = isDark ? 0 : 255;
        rgba[offset] = col;     // R
        rgba[offset + 1] = col; // G
        rgba[offset + 2] = col; // B
        rgba[offset + 3] = 255; // A
      }
    }

    // Decode with jsQR
    const code = jsQR(rgba, size, size);
    expect(code).toBeDefined();
    expect(code?.data).toBe(payload);
  });

  it('decodes compact vCard and validates parsed fields', () => {
    const payload = buildCompactVCard(sampleCard);
    const lines = payload.split('\r\n');
    const fnLine = lines.find((l) => l.startsWith('FN:'));
    const telLine = lines.find((l) => l.startsWith('TEL;TYPE=CELL:'));
    const emailLine = lines.find((l) => l.startsWith('EMAIL:'));

    expect(fnLine).toBe('FN:Vikram Patil');
    expect(telLine).toBe('TEL;TYPE=CELL:+919123456789');
    expect(emailLine).toBe('EMAIL:vikram@example.com');
  });
});
