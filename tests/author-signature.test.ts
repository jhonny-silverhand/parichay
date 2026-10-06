import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DEVELOPER_NAME, DEVELOPER_LINK, DEVELOPER_SIGNATURE } from '../src/shared/author';
import { buildCompactVCard } from '../src/shared/vcard';
import type { Card } from '../src/shared/card';

const rootDir = path.resolve(__dirname, '..');

describe('Developer Signature Verification', () => {
  it('defines correct craftsman author constants in src/shared/author.ts', () => {
    expect(DEVELOPER_NAME).toBe('Omkar Kardile');
    expect(DEVELOPER_LINK).toBe('https://omkardile.is-a.dev/');
    expect(DEVELOPER_SIGNATURE).toBe('Designed & developed by Omkar Kardile');
  });

  it('declares author metadata and link in index.html <head>', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    expect(indexHtml).toContain('<meta name="author" content="Omkar Kardile"');
    expect(indexHtml).toContain('<link rel="author" href="https://omkardile.is-a.dev/"');
  });

  it('declares author in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    expect(pkg.author).toBe('Omkar Kardile <https://omkardile.is-a.dev/>');
  });

  it('includes footer credit line in README.md and core documentation', () => {
    const readme = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf-8');
    expect(readme).toContain('Designed & developed by **[Omkar Kardile](https://omkardile.is-a.dev/)**');

    const privacyDoc = fs.readFileSync(path.join(rootDir, 'docs/PRIVACY.md'), 'utf-8');
    expect(privacyDoc).toContain('Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)');
  });

  it('strictly excludes developer signature from generated vCards and QR payloads', () => {
    const sampleCard: Card = {
      id: 'test-card-1',
      schemaVersion: 1,
      firstName: 'Aarav',
      lastName: 'Patel',
      jobTitle: 'Architect',
      company: 'Studio Form',
      phone: '+919876543210',
      email: 'aarav@example.com',
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
      createdAt: '2026-10-05T00:00:00.000Z',
      updatedAt: '2026-10-05T00:00:00.000Z',
      qrFingerprint: 'sig-test',
    };

    const vcard = buildCompactVCard(sampleCard);
    expect(vcard).not.toContain('Omkar');
    expect(vcard).not.toContain('omkardile');
  });
});
