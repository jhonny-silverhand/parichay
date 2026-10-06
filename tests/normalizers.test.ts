import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  normalizePhone,
  normalizeWebsite,
  normalizeLinkedIn,
  normalizeInstagram,
  normalizeXHandle,
  normalizeWhatsApp,
  normalizeEmail,
} from '@/shared/normalizers';

describe('Normalizers & Input Sanitization', () => {
  describe('sanitizeString', () => {
    it('removes ASCII control characters', () => {
      expect(sanitizeString('Hello\x00World\x07!')).toBe('HelloWorld!');
      expect(sanitizeString('   Clean Text   ')).toBe('Clean Text');
    });

    it('handles non-string types safely', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
    });
  });

  describe('normalizePhone', () => {
    it('normalizes valid Indian numbers with default region IN', () => {
      expect(normalizePhone('9876543210')).toBe('+919876543210');
      expect(normalizePhone('+91 98765 43210')).toBe('+919876543210');
    });

    it('normalizes international numbers', () => {
      expect(normalizePhone('+1 415 555 2671')).toBe('+14155552671');
      expect(normalizePhone('+44 7911 123456')).toBe('+447911123456');
    });

    it('returns null on invalid phone numbers', () => {
      expect(normalizePhone('123')).toBeNull();
      expect(normalizePhone('abc')).toBeNull();
      expect(normalizePhone('')).toBeNull();
    });
  });

  describe('normalizeWebsite', () => {
    it('prepends https:// when missing and strips trailing slashes', () => {
      expect(normalizeWebsite('example.com/')).toBe('https://example.com');
      expect(normalizeWebsite('http://sub.domain.co.in')).toBe('https://sub.domain.co.in');
    });

    it('rejects malicious schemes', () => {
      expect(normalizeWebsite('javascript:alert(1)')).toBeNull();
      expect(normalizeWebsite('data:text/html,<script>')).toBeNull();
      expect(normalizeWebsite('vbscript:run()')).toBeNull();
    });

    it('rejects invalid hostnames without dots', () => {
      expect(normalizeWebsite('invalidhostname')).toBeNull();
    });
  });

  describe('normalizeLinkedIn', () => {
    it('handles bare usernames, in/ handles, and canonical URLs', () => {
      expect(normalizeLinkedIn('aditisharma')).toBe('https://www.linkedin.com/in/aditisharma');
      expect(normalizeLinkedIn('in/aditisharma')).toBe('https://www.linkedin.com/in/aditisharma');
      expect(normalizeLinkedIn('https://www.linkedin.com/in/aditisharma/')).toBe('https://www.linkedin.com/in/aditisharma');
    });

    it('rejects foreign domains', () => {
      expect(normalizeLinkedIn('https://evil.com/in/user')).toBeNull();
    });
  });

  describe('normalizeInstagram', () => {
    it('extracts handle from URLs and bare handles', () => {
      expect(normalizeInstagram('aditi_designs')).toBe('aditi_designs');
      expect(normalizeInstagram('@aditi_designs')).toBe('aditi_designs');
      expect(normalizeInstagram('https://instagram.com/aditi.designs/')).toBe('aditi.designs');
    });

    it('rejects invalid characters', () => {
      expect(normalizeInstagram('user with spaces')).toBeNull();
      expect(normalizeInstagram('user!@#$')).toBeNull();
    });
  });

  describe('normalizeXHandle', () => {
    it('normalizes X / Twitter handles', () => {
      expect(normalizeXHandle('aditi_builds')).toBe('aditi_builds');
      expect(normalizeXHandle('@aditi_builds')).toBe('aditi_builds');
      expect(normalizeXHandle('https://x.com/aditi_builds')).toBe('aditi_builds');
      expect(normalizeXHandle('https://twitter.com/aditi_builds')).toBe('aditi_builds');
    });

    it('rejects handles longer than 15 characters', () => {
      expect(normalizeXHandle('this_handle_is_way_too_long_for_x')).toBeNull();
    });
  });

  describe('normalizeWhatsApp', () => {
    it('formats digits for wa.me links', () => {
      expect(normalizeWhatsApp('9876543210')).toBe('919876543210');
      expect(normalizeWhatsApp('+91 98765 43210')).toBe('919876543210');
      expect(normalizeWhatsApp('https://wa.me/919876543210')).toBe('919876543210');
    });
  });

  describe('normalizeEmail', () => {
    it('normalizes valid emails', () => {
      expect(normalizeEmail('Aditi@Example.COM')).toBe('aditi@example.com');
      expect(normalizeEmail('first.last+tag@sub.domain.co')).toBe('first.last+tag@sub.domain.co');
    });

    it('rejects invalid emails', () => {
      expect(normalizeEmail('not-an-email')).toBeNull();
      expect(normalizeEmail('@missingusername.com')).toBeNull();
      expect(normalizeEmail('missingdomain@')).toBeNull();
    });
  });
});
