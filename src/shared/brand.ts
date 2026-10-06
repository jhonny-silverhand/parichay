/**
 * Brand Constants for Parichay
 * Single source of truth for app identity, naming, tagline, and identifiers.
 */

export const BRAND = {
  name: 'Parichay',
  displayName: 'Parichay',
  tagline: 'One card. One scan. Nothing leaves your phone.',
  shortDescription: 'A private digital business card that lives only on your phone.',
  fullDescription:
    'A private digital business card that lives only on your phone, sharing contacts via pure offline vCard QR codes with zero servers, tracking, or cloud.',
  packageSlug: 'parichay',
  appId: 'com.example.parichay',
  androidPackage: 'com.example.parichay',
  iosBundleId: 'com.example.parichay',
  version: '1.0.0',
  license: 'MIT',
  repository: 'https://github.com/example/parichay',
  supportEmail: 'contact@example.com',
  author: 'Parichay Team',
  
  // Editorial Color Palette
  colors: {
    obsidian: '#111317',
    charcoal: '#1A1D24',
    paperLight: '#F7F5F0',
    paperWarm: '#FAF8F4',
    terracotta: '#B85226',
    terracottaHover: '#A0451E',
    terracottaSubtle: '#F6EAE4',
    slate: '#4A505C',
    hairline: 'rgba(17, 19, 23, 0.08)',
    hairlineDark: 'rgba(255, 255, 255, 0.12)',
  },
} as const;

export type Brand = typeof BRAND;
