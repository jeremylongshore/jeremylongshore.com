#!/usr/bin/env bash
# Name-leak gate — the design-reference site studied for this rebuild is
# intentionally anonymous in this repository (see 000-docs/001 §preamble).
# This gate fails if any identifying string appears in tracked or untracked
# files (lockfile included). Patterns are stored base64-encoded so the gate
# itself stays clean; runs in CI (deploy.yml) and manually before commits.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PATTERNS_B64=(
  'Y29yZXk='
  'aGFpbmVz'
  'c3dpcGV3ZWxs'
  'c3dpcGVmaWxlcw=='
  'Y29udmVyc2lvbmZhY3Rvcnk='
  'Y29udmVyc2lvbiBmYWN0b3J5'
  'bWFnaXN0ZXJtYXJrZXRpbmc='
  'dHJ1ZWxpc3QuaW8='
  'bWFya2V0aW5nLXNraWxscw=='
  'Y29kaW5nZm9ybWFya2V0ZXJz'
  'cmV0ZXh0Lmlv'
  'bWFrZXJza2lsbHM='
)

fail=0
for b64 in "${PATTERNS_B64[@]}"; do
  pattern=$(printf '%s' "$b64" | base64 -d)
  if hits=$(git grep -I -i -F -n --untracked -- "$pattern" -- ':!scripts/name-leak-gate.sh' 2>/dev/null); then
    echo "LEAK: pattern #${b64:0:6}… found:"
    echo "$hits"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "name-leak-gate: FAILED — remove the identifying strings above." >&2
  exit 1
fi
echo "name-leak-gate: clean"
