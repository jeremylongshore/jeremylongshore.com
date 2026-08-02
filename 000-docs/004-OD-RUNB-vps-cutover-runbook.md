# VPS Cutover Runbook — Ruby static → Next.js container

**Doc:** 004-OD-RUNB-vps-cutover-runbook
**Date:** 2026-08-02
**Scope:** flips jeremylongshore.com on the `intentsolutions` VPS from Caddy `file_server` (Ruby/Linkyee build in `/srv/jeremylongshore/dist`) to Caddy `reverse_proxy` → the `jeremylongshore-web` container (127.0.0.1:3010). Run **after** the hub-rebuild PR is merged to `main` and CI is green. All commands over `ssh intentsolutions`.

## Pre-flight

```bash
ssh intentsolutions
sudo ss -ltnp | grep 3010 || echo "port 3010 free"   # must be free; pick another if not (update docker-compose.yml + Caddyfile)
cd /srv/jeremylongshore/code && git fetch origin && git log origin/main -1 --oneline   # confirm the merge landed
docker --version && docker compose version
```

## 1. Extend the build env

`/srv/jeremylongshore/.env` (mode 600) already holds `GITHUB_TOKEN`. Append the Umami keys (values from the Umami admin → API token; website ID for startaitools.com):

```bash
sudo tee -a /srv/jeremylongshore/.env >/dev/null <<'EOF'
UMAMI_BASE_URL=https://analytics.intentsolutions.io
UMAMI_API_TOKEN=<token>
UMAMI_WEBSITE_ID=<startaitools website uuid>
EOF
```

(Interim plaintext like the existing token; SOPS remains the target posture.)

## 2. Replace the force-command deploy script

Overwrite `/usr/local/sbin/deploy-jeremylongshore` (root-owned, 755) with the container variant:

```bash
#!/usr/bin/env bash
# Force-command deploy for jeremylongshore.com — Next.js container variant.
set -euo pipefail
cd /srv/jeremylongshore/code
git fetch origin main
git reset --hard origin/main
set -a; source /srv/jeremylongshore/.env; set +a
docker compose build --pull web
docker compose up -d web
for i in $(seq 1 12); do
  curl -fsS http://127.0.0.1:3010/api/healthz >/dev/null 2>&1 && { echo "healthz OK"; exit 0; }
  sleep 5
done
echo "healthz FAILED after container start" >&2
exit 1
```

The `authorized_keys` force-command entry itself is unchanged (same key, same script path).

## 3. First image build + start (manual, before the Caddy flip)

```bash
sudo /usr/local/sbin/deploy-jeremylongshore
curl -s http://127.0.0.1:3010/api/healthz   # expect {"ok":true,...}
curl -s http://127.0.0.1:3010/ | head -30   # homepage HTML sanity
```

## 4. Caddy flip (validate → reload, NEVER restart)

In `/etc/caddy/Caddyfile`, replace the site block:

```caddy
jeremylongshore.com, www.jeremylongshore.com {
    reverse_proxy 127.0.0.1:3010
}
```

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## 5. Verify live

```bash
dig +short jeremylongshore.com          # 167.86.106.29
curl -fsS https://jeremylongshore.com/api/healthz
curl -s https://jeremylongshore.com/ | grep -i "ai-native" | head -1
```

Phone spot-check over mobile data. Old `dist/` stays on disk untouched (it is the rollback).

## 6. Rollback (if anything is off)

```bash
# Caddyfile: restore
#   jeremylongshore.com, www.jeremylongshore.com {
#       root * /srv/jeremylongshore/dist
#       file_server
#   }
sudo caddy validate --config /etc/caddy/Caddyfile && sudo systemctl reload caddy
docker compose -f /srv/jeremylongshore/code/docker-compose.yml down
```

`dist/` still contains the last Ruby build — the site is back on the old stack in seconds. Restore the previous force-command script from git history if reverting long-term.

## 7. Post-cutover cleanup (separate commit, only after §5 verified)

- Remove from the repo: `scaffold.rb`, `Gemfile`, `Gemfile.lock`, `plugins/`, `themes/`, `build.sh`, `_output/`, `config.yml` (content migrated), `.bundle/`, stale `netlify.toml` / Firebase remnants if present.
- Update `CLAUDE.md` + `README.md` to the Next.js architecture.
- After a week of clean runs: `sudo rm -rf /srv/jeremylongshore/dist` and retire the Ruby build deps on the VPS.
