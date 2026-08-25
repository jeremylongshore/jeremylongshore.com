# JeremyLongshore.com

[![Deploy: self-hosted VPS](https://img.shields.io/badge/deploy-self--hosted%20VPS%20(Caddy)-2ea44f)](https://intentsolutions.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-v3.8.0-blue)

Personal hub site for Jeremy Longshore — AI systems that ship, live-data proof, hub-and-spokes to every product.

**Live Site:** [jeremylongshore.com](https://jeremylongshore.com)

## Architecture

Next.js 15 (App Router, standalone output) + Tailwind v4 + TypeScript, running as a Docker container on the Intent Solutions VPS behind Caddy. Live data rendered server-side via ISR — no client-side third-party calls.

```
app/                  # App Router: layout (self-hosted Geist), homepage, /api/healthz
app/globals.css       # Design-token layer (colors, silver + 12 accent gradients, motion)
components/           # Design-system primitives (GradientCard, PillButton, AvatarRing,
                      #   StatusChip, SectionReveal, Heatmap, …)
components/sections/  # Homepage sections (server components, fail-loud data boundaries)
lib/site.ts           # Site copy/config (name, tagline, socials, CTAs)
lib/data/             # ISR fetchers: GitHub stars + contribution heatmap (GraphQL) +
                      #   merged external PRs, startaitools RSS, Umami view counts, projects
data/projects.yml     # Project listings by category (single source of truth)
000-docs/             # Design-system study, architecture diagrams, cutover runbook
Dockerfile            # Standalone server image (built on the VPS at deploy time)
docker-compose.yml    # Prod service: 127.0.0.1:3010 → container :3000
```


## Quick Start

```bash
pnpm install     # Node 22 + pnpm 10
pnpm dev         # dev server → http://localhost:3000
pnpm typecheck && pnpm build
```

`GITHUB_TOKEN` in the environment lights up the stars/heatmap/contributions sections locally. Umami view counts need `UMAMI_BASE_URL` / `UMAMI_API_TOKEN` / `UMAMI_WEBSITE_ID` (VPS-only by default).

## Deployment

**Self-hosted** on the Intent Solutions VPS (`intentsolutions`, `167.86.106.29`) — the canonical VPS-as-the-home pattern. Caddy reverse-proxies the apex + `www` to the app container (`dig +short jeremylongshore.com` → `167.86.106.29`).

On push to `main`, `.github/workflows/deploy.yml`:
1. **Build gate** — Node 22 + pnpm: `typecheck` + `next build` + name-leak gate
2. **Tailscale OIDC** — keyless auth to the tailnet (per-repo WIF trust)
3. **SSH (force-command)** — triggers `/usr/local/sbin/deploy-jeremylongshore` on the VPS: `git fetch` + `docker compose build` + `up -d` (image built on the VPS)
4. **Smoke check** — `curl https://jeremylongshore.com/api/healthz` asserts `.ok == true`

Reusable workflow: `jeremylongshore/.github` `vps-deploy.yml` (`variant: docker`).
GH secrets: `TS_OIDC_CLIENT_ID`, `TS_AUDIENCE`, `VPS_DEPLOY_KEY`, `VPS_HOST_KEY`.

**Manual deploy:** `ssh intentsolutions /usr/local/sbin/deploy-jeremylongshore`

> Migrated off Firebase Hosting **and** Netlify on 2026-06-20 (GCP exodus); rebuilt from the
> Ruby/Linkyee static generator to this Next.js hub in 2026-08.

## Configuration

- `lib/site.ts` — header/tagline copy, social links, CTA URLs, footer fallbacks
- `data/projects.yml` — project listings by category (`intent_solutions_repos`, `products`, `personal_repos`, `client_projects`, `n8n_workflows`)
- `app/globals.css` — every design token (see `000-docs/003` for the design-language spec)

### Live-data fetchers (`lib/data/`, ISR)

- **github-stars** — star counts for any project with `github_repo` (6h revalidate)
- **github-heatmap** — contribution calendar via GraphQL, rendered in the site's bronze ramp (6h)
- **github-contributions** — merged PRs to external repos via the search API (6h)
- **writing** — latest startaitools.com posts (1h)
- **umami-views** — per-post view counts from self-hosted Umami (15m)

Fetchers fail loudly (typed errors + logs); sections render visible fallbacks, never silently-empty content.

## Release Process

Automated via GitHub Actions on push to `main`:
1. Conventional commits determine version bump (feat→minor, fix→patch, BREAKING→major)
2. Updates `version.txt`, `CHANGELOG.md`, README version references
3. Creates Git tag and GitHub release

## Tech Stack

- **Framework:** Next.js 15 (standalone) · React 19 · Tailwind v4 · TypeScript
- **Fonts:** Geist Sans/Mono, self-hosted
- **Hosting:** Docker on the `intentsolutions` VPS (Caddy `reverse_proxy`)
- **CI/CD:** GitHub Actions — `deploy.yml` (VPS deploy via Tailscale OIDC) + `release.yml` (versioning)
- **Analytics:** self-hosted Umami (also the view-counts data source)

## Contact

- **Website:** [jeremylongshore.com](https://jeremylongshore.com)
- **Email:** jeremy@intentsolutions.io
- **GitHub:** [@jeremylongshore](https://github.com/jeremylongshore)
- **LinkedIn:** [Jeremy Longshore](https://linkedin.com/in/jeremylongshore)
- **X/Twitter:** [@asphaltcowb0y](https://x.com/asphaltcowb0y)
