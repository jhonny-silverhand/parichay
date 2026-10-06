import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING DOCUMENTATION INTEGRITY AUDIT ---');

const errors = [];

// 1. Required documentation files
const requiredDocs = [
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'THIRD_PARTY_LICENSES.md',
  'docs/README.md',
  'docs/APP_GUIDELINES.md',
  'docs/DECISIONS.md',
  'docs/ARCHITECTURE.md',
  'docs/TECHNICAL.md',
  'docs/DATA_MODEL.md',
  'docs/TESTING.md',
  'docs/SECURITY.md',
  'docs/PRIVACY.md',
  'docs/RELEASE.md',
  'docs/DESIGN.md',
  'docs/BRAND.md',
  'docs/FIGMA_GUIDE.md',
  'docs/STORE.md',
  'docs/AUTOMATION.md',
  'docs/BACKLOG.md',
  'docs/KNOWN_ISSUES.md',
  'docs/PROGRESS.md',
  'docs/BUSINESS.md',
  'docs/USER_GUIDE.md',
  'docs/FAQ.md',
  'docs/TROUBLESHOOTING.md',
];

for (const relPath of requiredDocs) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required documentation file: "${relPath}"`);
  } else {
    const stats = fs.statSync(fullPath);
    if (stats.size < 50) {
      errors.push(`Documentation file is empty or too short (< 50 bytes): "${relPath}"`);
    }
  }
}

// 2. CHANGELOG entry for current version in package.json
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const currentVersion = pkg.version;
const changelogContent = fs.readFileSync(path.join(rootDir, 'CHANGELOG.md'), 'utf-8');

if (!changelogContent.includes(`## [${currentVersion}]`)) {
  errors.push(`CHANGELOG.md does not contain an entry for package.json version [${currentVersion}]`);
}

// 3. Verify in-product routes (/showcase and /index-help) in Router
const appTsx = fs.readFileSync(path.join(rootDir, 'src/web/app/App.tsx'), 'utf-8');
if (!appTsx.includes('path="/showcase"') || !appTsx.includes('path="/index-help"')) {
  errors.push('App.tsx is missing required routes for /showcase or /index-help');
}

// 4. Verify relative markdown links in all doc files
function checkMarkdownLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const dir = path.dirname(filePath);

  // Match [text](link)
  const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
  for (const match of linkMatches) {
    const rawLink = match[2].trim();
    // Skip external http, mailto, anchor only (#)
    if (rawLink.startsWith('http://') || rawLink.startsWith('https://') || rawLink.startsWith('mailto:') || rawLink.startsWith('#')) {
      continue;
    }

    const [cleanPath] = rawLink.split('#');
    if (!cleanPath) continue;

    const targetFullPath = path.resolve(dir, cleanPath);
    if (!fs.existsSync(targetFullPath)) {
      errors.push(`Broken relative link in ${path.relative(rootDir, filePath)}: "${rawLink}" (target not found: ${cleanPath})`);
    }
  }
}

for (const relPath of requiredDocs) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath) && relPath.endsWith('.md')) {
    checkMarkdownLinks(fullPath);
  }
}

// 5. Verify package.json scripts are mentioned in docs
const readmeContent = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf-8');
const expectedScripts = ['dev', 'build', 'test', 'lint', 'check:privacy', 'docs:check'];
for (const script of expectedScripts) {
  if (!readmeContent.includes(script)) {
    errors.push(`README.md does not mention core npm script: "${script}"`);
  }
}

if (errors.length > 0) {
  console.error('\nDOCUMENTATION AUDIT FAILED! Issues found:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\nDOCUMENTATION AUDIT PASSED: All 26 required docs present, zero broken links, routes aligned.');
  process.exit(0);
}
