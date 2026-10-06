# Automation & Scheduled Workflows (AUTOMATION.md)

Parichay includes continuous automation tooling to ensure privacy compliance, code health, and continuous quality polish without manual intervention.

---

## 1. Automated Jobs Overview

| Job Name | Frequency | Target Branch | Primary Actions |
|----------|-----------|---------------|-----------------|
| **Daily Polish Pass** | Daily @ 02:00 UTC | `auto/polish-YYYYMMDD` | Implements top open tasks from `docs/BACKLOG.md`, executes verification, logs results. |
| **Nightly Smoke Run** | Daily @ 00:00 UTC | `main` | Runs full verification suite (`./scripts/verify-all`) and reports build status. |
| **Weekly Freshness Audit** | Sundays @ 04:00 UTC | `auto/dep-report` | Runs `npm outdated` and `npm audit`, updating `docs/DEPENDENCY_REPORT.md`. |

---

## 2. Guardrails for All Automated Jobs

Every automated job must operate strictly within the following security boundaries:
1. **Branch Isolation**: Jobs work **only** on branches matching `auto/*`. They **never** commit or push directly to `main`.
2. **No Force-Pushes**: Force-pushing (`git push -f`) and history rewriting are strictly prohibited.
3. **No Secrets or Signing Keys**: Automated scripts never touch keystores, certificates, or environment configs.
4. **Privacy Invariant**: Jobs can never add network calls (`fetch`, `WebSocket`, `XHR`), tracking SDKs, or cloud services.
5. **No Major Version Jumps**: Automated dependency routines report outdated packages but do not perform automatic breaking upgrades.
6. **Execution Timeout**: Capped at 30 minutes per run with file locking (`/tmp/parichay_polish.lock`).
7. **Backlog Completion**: Once `docs/BACKLOG.md` has no open items, the polish runner automatically halts.

---

## 3. Ready-to-Install Schedules

### Option A: Standard Crontab (Linux / macOS)
Add these lines to your user crontab (`crontab -e`):
```cron
# Parichay Nightly Smoke Verification (00:00 UTC)
0 0 * * * cd /path/to/parichay && ./scripts/verify-all >> logs/cron/smoke.log 2>&1

# Parichay Daily Polish Run (02:00 UTC)
0 2 * * * cd /path/to/parichay && ./scripts/polish-run.sh >> logs/cron/polish.log 2>&1

# Parichay Weekly Dependency Report (Sundays at 04:00 UTC)
0 4 * * 0 cd /path/to/parichay && npm outdated > docs/DEPENDENCY_REPORT.md 2>&1
```

### Option B: macOS Launchd Daemon
Place a plist in `~/Library/LaunchAgents/com.parichay.smoke.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.parichay.smoke</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>npm run verify:all</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>0</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
</dict>
</plist>
```

### Option C: GitHub Actions Scheduled Cron (`.github/workflows/nightly.yml`)
```yaml
name: Nightly Smoke Run

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - run: npm ci || npm install
      - run: ./scripts/verify-all
```

---

## 4. How to Review & Merge `auto/*` Branches

1. Check open automated branches:
   ```bash
   git branch -r | grep 'auto/'
   ```
2. Review the diff against `main`:
   ```bash
   git diff main..origin/auto/polish-YYYYMMDD
   ```
3. Run verification locally:
   ```bash
   git checkout auto/polish-YYYYMMDD
   ./scripts/verify-all
   ```
4. Merge using standard squash or fast-forward merge:
   ```bash
   git checkout main
   git merge --no-ff auto/polish-YYYYMMDD
   git push origin main
   ```
