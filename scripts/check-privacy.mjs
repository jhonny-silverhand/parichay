import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING PRIVACY ENFORCEMENT AUDIT ---');

let violations = [];

// 1. Audit package.json dependencies for known analytics / telemetry packages
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

const bannedPackages = [
  'mixpanel',
  'segment',
  'amplitude',
  'posthog',
  'firebase/analytics',
  '@google-analytics',
  'sentry',
  '@sentry',
  'datadog',
  'hotjar',
  'clarity',
  'telemetry',
  'statsig',
];

for (const dep of Object.keys(allDeps)) {
  for (const banned of bannedPackages) {
    if (dep.includes(banned)) {
      violations.push(`Banned telemetry / analytics package detected in package.json: "${dep}"`);
    }
  }
}

// 2. Scan src/ directory for network invocations
const bannedTokens = [
  { pattern: /\bfetch\s*\(/g, name: 'fetch()' },
  { pattern: /\bXMLHttpRequest\b/g, name: 'XMLHttpRequest' },
  { pattern: /\bnew\s+WebSocket\b/g, name: 'WebSocket' },
  { pattern: /\bsendBeacon\b/g, name: 'navigator.sendBeacon' },
  { pattern: /\bnew\s+EventSource\b/g, name: 'EventSource' },
];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
      // Exclude privacy check script itself and test mocks if any
      if (fullPath.includes('check-privacy.mjs')) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip comment lines
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return;
        }

        for (const { pattern, name } of bannedTokens) {
          if (pattern.test(line)) {
            violations.push(
              `Forbidden network API [${name}] in ${path.relative(rootDir, fullPath)}:${index + 1}`
            );
          }
        }

        // Check for hardcoded external HTTP(S) requests in functional code
        // (Excluding documentation strings, schema schemas, XML namespaces, and protocol builders)
        const httpMatch = line.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s"'`)]*/g);
        if (httpMatch) {
          for (const url of httpMatch) {
            // Allow schema URLs, XML namespaces, and social link builders in vcard
            if (
              url.includes('tokens.studio') ||
              url.includes('w3.org') ||
              url.includes('omkardile.is-a.dev') ||
              url.includes('github.com') ||
              url.includes('linkedin.com') ||
              url.includes('instagram.com') ||
              url.includes('x.com') ||
              url.includes('wa.me') ||
              url.includes('play.google.com') ||
              url.includes('apple.com') ||
              url.includes('example.com')
            ) {
              continue;
            }
            violations.push(
              `Suspicious external HTTP(S) URL in code: "${url}" in ${path.relative(rootDir, fullPath)}:${index + 1}`
            );
          }
        }
      });
    }
  }
}

scanDirectory(path.join(rootDir, 'src'));

if (violations.length > 0) {
  console.error('\nPRIVACY AUDIT FAILED! Violations found:');
  violations.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
} else {
  console.log('\nPRIVACY AUDIT PASSED: Zero network APIs, zero tracking SDKs, 100% offline.');
  process.exit(0);
}
