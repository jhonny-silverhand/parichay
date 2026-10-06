#!/usr/bin/env bash
set -euo pipefail

LOCK_FILE="/tmp/parichay_polish.lock"
LOG_DIR="logs/cron"
DATE_STR=$(date +%Y%m%d)
BRANCH_NAME="auto/polish-${DATE_STR}"

mkdir -p "${LOG_DIR}"

if [ -f "${LOCK_FILE}" ]; then
  echo "Another polish run is currently active. Skipping."
  exit 0
fi

trap 'rm -f "${LOCK_FILE}"' EXIT
touch "${LOCK_FILE}"

echo "Starting automated polish pass on branch ${BRANCH_NAME}..." | tee -a "${LOG_DIR}/polish-${DATE_STR}.log"

# Create or checkout auto/ polish branch
git checkout -b "${BRANCH_NAME}" 2>/dev/null || git checkout "${BRANCH_NAME}"

# Execute verification suite
if ./scripts/verify-all; then
  echo "Verification suite passed clean." | tee -a "${LOG_DIR}/polish-${DATE_STR}.log"
else
  echo "Verification suite failed. Halting polish run." | tee -a "${LOG_DIR}/polish-${DATE_STR}.log"
  exit 1
fi

echo "Polish cycle finished."
