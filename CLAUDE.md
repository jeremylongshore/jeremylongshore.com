# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal hub site for Jeremy Longshore — **Next.js 15 (App Router, standalone output) + Tailwind v4 + TypeScript**, serving live data (GitHub stars/heatmap/contributions, startaitools RSS, Umami view counts) via ISR. Design system adapted from a best-in-class reference hub's published machine-readable spec — the reference is deliberately anonymous in this repo (see `000-docs/001`, and the name-leak gate below).

**Live:** https://jeremylongshore.com
**Deployment:** Dockerized on the Intent Solutions VPS (`intentsolutions`, 167.86.106.29), Caddy `reverse_proxy` → `127.0.0.1:3010`. Push to `main` → `.github/workflows/deploy.yml` (build gate → Tailscale OIDC → force-command SSH → VPS-side `docker compose build` + `up -d` → `/api/healthz` smoke).


## Commands

```bash
pnpm install          # deps (pnpm 10, Node 22)
pnpm dev              # dev server on :3000
pnpm typecheck        # tsc --noEmit
pnpm build            # production build (standalone)
bash scripts/name-leak-gate.sh   # MUST be clean before every commit
```

## Architecture

```
app/                  # App Router: layout (Geist fonts, metadata), page (homepage), api/healthz
app/globals.css       # THE design-token layer — every color/gradient/radius/motion token
components/           # Design-system primitives (GradientCard, PillButton, AvatarRing,
                      #   StatusChip, SectionReveal, CursorShimmer, LightLeakImage, Heatmap…)
components/sections/  # Homepage sections (server components, fail-loud data boundaries)
lib/site.ts           # Site-wide copy/config (name, tagline, socials, CTAs)
lib/data/*.ts         # ISR fetchers: github-stars, github-heatmap (GraphQL),
                      #   github-contributions, writing (RSS), umami-views, projects (YAML)
lib/safe.ts           # Section boundary: fetchers throw; sections render VISIBLE fallbacks
data/projects.yml     # Curated project grid data (single source of truth)
000-docs/             # Design study, diagrams, design-language spec, cutover runbook
Dockerfile            # Standalone server image (built on the VPS by the deploy script)
docker-compose.yml    # Prod service: 127.0.0.1:3010 → container :3000
```

**Data philosophy:** fetchers throw typed errors (`DataFetchError`/`ConfigError`) and never return silently-empty data; sections catch via `safely()` and render a visible degraded notice. Page-level `revalidate = 3600`; per-fetch revalidate 6h (GitHub), 1h (RSS), 15m (Umami).

## Critical Rules

1. **Name-leak gate before every commit** — `bash scripts/name-leak-gate.sh` (also runs in CI). The design reference's owner/domains/handles must never appear in this repo; patterns live base64-encoded inside the gate script.
2. **Every visual value routes through a token** in `app/globals.css` — no ad-hoc hex/duration in components.
3. **Color is an interaction reward** — accent gradients only on hover/rings/small accents, never static fills (`000-docs/003`).
4. **All content edits** go in `lib/site.ts` (copy/socials) or `data/projects.yml` (projects) — not in components.
5. **Test locally before push:** `pnpm build` must pass; live-data sections must render real values with `GITHUB_TOKEN` set.
6. **Umami env** (`UMAMI_BASE_URL`, `UMAMI_API_TOKEN`, `UMAMI_WEBSITE_ID`) only exists on the VPS — locally the views section degrades to a visible notice by design (ConfigError → warn).

## Deployment

Reusable workflow `jeremylongshore/.github` `vps-deploy.yml` (`variant: docker`). Per-repo Tailscale OIDC trust + 4 GH secrets (TS_OIDC_CLIENT_ID, TS_AUDIENCE, VPS_DEPLOY_KEY, VPS_HOST_KEY). VPS side: `/usr/local/sbin/deploy-jeremylongshore` (force-command) does git fetch + compose build + up -d + healthz loop. Env at `/srv/jeremylongshore/.env` (GITHUB_TOKEN + UMAMI_*). Caddy block: `reverse_proxy 127.0.0.1:3010` — edit `/etc/caddy/Caddyfile` then `sudo caddy validate && sudo systemctl reload caddy` (NEVER restart — shared ingress). Full procedure + rollback: `000-docs/004-OD-RUNB-vps-cutover-runbook.md`.

> ⚠️ Verify the live host with DNS, not docs: `dig +short jeremylongshore.com` → `167.86.106.29`.

## Release Process

Automated via GitHub Actions (`.github/workflows/release.yml`): conventional commits → version bump, `CHANGELOG.md`, tag, GitHub release.
