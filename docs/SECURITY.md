# Security Architecture & Threat Model

This document outlines the threat model, security controls, and vulnerability reporting procedures for Parichay.

---

## 1. Threat Model for a Local-Only Application

In traditional client-server applications, threats center around server breaches, database leaks, API interception, and credential compromise. Because Parichay has **no server, no user accounts, and no network endpoints**, the threat model is distinct:

| Threat | Risk Level | Mitigation in Parichay |
| :--- | :--- | :--- |
| **Silent Exfiltration via Third-Party Dependencies** | Critical | Strict Content Security Policy (`connect-src 'self'`), zero telemetry packages, automated static privacy audit (`npm run check:privacy`). |
| **Physical Device Extraction / Unauthenticated Access** | Moderate | Contact cards are meant for public distribution, but sensitive fields (notes) are kept local; Android auto-backup disabled (`android:allowBackup="false"`). |
| **Metadata & GPS Leakage in Profile Photos** | High | In-memory canvas rasterization strips 100% of EXIF, GPS, camera serials, and timestamps prior to storage. |
| **Malicious Backup Injection** | Moderate | Strict Zod runtime validation (`CardSchema.safeParse`), URI protocol sanitization (rejects `javascript:` and dangerous schemas). |
| **Storage Cross-Contamination** | Low | Sandboxed inside origin-isolated IndexedDB and native app directory; `frame-ancestors 'none'` prevents iframe embedding. |

---

## 2. Technical Enforcement Mechanisms

### A. Content Security Policy (CSP)
Enforced in `index.html` and static hosting headers:
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self';
  form-action 'none';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'none';
```

### B. Automated Privacy & Network Audit (`npm run check:privacy`)
A pre-commit and CI verification gate that traverses all source code and dependencies to fail if:
- Any network API (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `EventSource`) is present.
- Any analytics/telemetry package (Mixpanel, PostHog, Sentry, Segment, GA) is listed in `package.json`.
- Any external HTTP(S) network request is initiated.

### C. Android Cloud Auto-Backup Opt-Out
In `android/app/src/main/AndroidManifest.xml`:
- `android:allowBackup="false"`
- `android:fullBackupContent="false"`
This prevents Google Cloud from automatically copying user business cards to remote cloud drives during Android system backups.

---

## 3. Reporting Security Vulnerabilities

If you discover a security flaw, Content Security Policy bypass, or privacy leak in Parichay:
- **Do not open a public GitHub issue.**
- Email the maintainer directly at: `contact@omkardile.is-a.dev` or visit [omkardile.is-a.dev](https://omkardile.is-a.dev/).
- Include steps to reproduce, the impacted runtime (Web, Android, iOS), and proof-of-concept code.
- We aim to acknowledge reports within 24 hours and patch critical flaws immediately.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
