# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal landing page for Jeremy Longshore built with **Linkyee** (Ruby-based static site generator). Single-page design featuring project links, social profiles, and dynamic GitHub star counts.

**Live:** https://jeremylongshore.com
**Deployment:** Self-hosted on the Intent Solutions VPS (`intentsolutions`, 167.86.106.29) — Caddy `file_server` from `/srv/jeremylongshore/dist`. Push to `main` → `.github/workflows/deploy.yml` (Tailscale OIDC + force-command SSH). No Firebase/GCP, no Netlify (migrated 2026-06-20).

## Commands

```bash
# Build locally (requires Ruby + bundler)
bash build.sh

# Preview locally
cd _output && python -m http.server 8000

# Full workflow
bash build.sh && cd _output && python -m http.server 8000
```

## Architecture

```
config.yml          # ALL content: links, bio, socials, plugin config
scaffold.rb         # Build script: loads config → runs plugins → renders Liquid
build.sh            # Wrapper: bundle install → ruby scaffold.rb
themes/default/     # Liquid template + CSS + Font Awesome
  index.html        # Template with {{ vars }} placeholders
  styles.css        # Site styling
plugins/            # Dynamic data fetchers (Ruby classes)
_output/            # Generated static site (committed, deployed directly)
```

**Build flow:** `config.yml` → plugins fetch data → Liquid renders `themes/default/` → `_output/`

## Content Changes

All content lives in `config.yml`:
- `links:` - Project links with Font Awesome icons
- `socials:` - Social media icons
- `tagline:` - Bio text below name
- `footer:` / `copyright:` - Footer content
- `plugins:` - GitHub repos to fetch star counts for

**Workflow:** Edit `config.yml` → `bash build.sh` → commit `_output/` → push to main

## Plugins

Located in `plugins/`. Fetch dynamic data at build time.

**GithubRepoStarsCountPlugin**: Scrapes GitHub star counts. Usage in config.yml:
```yaml
plugins:
  - GithubRepoStarsCountPlugin:
      - owner/repo-name

# Reference in link text:
text: "Project <span class='link-button-text'>({{vars.GithubRepoStarsCountPlugin['owner/repo-name']}} Stars)</span>"
```

**Other build-time plugins (auto-run by `scaffold.rb`, no config needed):**
- `StartAIToolsRSSPlugin` — pulls the latest posts from startaitools.com for the Work Diary section (1h cache).
- `GithubContributionsPlugin` — pulls merged PRs to **external** repos live from the GitHub search API for the Open Source Contributions section; curated repo metadata (label/description/icon/tags) lives in the plugin's `META` map. Needs `GITHUB_TOKEN` in CI; falls back to `.github_contributions_cache.json` (6h TTL). This replaced the old hand-maintained `contributions:` block in `config.yml`.

## Critical Rules

1. **Never edit `_output/` manually** - regenerated on every build
2. **All content in `config.yml`** - single source of truth
3. **Icons: Font Awesome Free only** - https://fontawesome.com/search?o=r&m=free
4. **Test locally before push**: Run `bash build.sh` to verify changes work
5. **README.md is outdated** - references old Hugo setup; ignore it for architecture info

## Deployment

**Self-hosted on the `intentsolutions` VPS** (167.86.106.29), the canonical
VPS-as-the-home pattern. Apex `jeremylongshore.com` + `www` resolve to the VPS;
Caddy serves the static build via `file_server` from `/srv/jeremylongshore/dist`.

- **Production deploy:** push to `main` → `.github/workflows/deploy.yml` →
  CI build gate → Tailscale OIDC → SSH (force-command) → the VPS script
  `/usr/local/sbin/deploy-jeremylongshore` does `git fetch` + `bundle install` +
  `ruby scaffold.rb` + `rsync -a --delete _output/ → dist/` + writes `dist/healthz`.
  Reusable workflow: `jeremylongshore/.github` `vps-deploy.yml` (`variant: static`).
  Per-repo Tailscale OIDC trust + 4 GH secrets (TS_OIDC_CLIENT_ID, TS_AUDIENCE,
  VPS_DEPLOY_KEY, VPS_HOST_KEY) per the runbook onboarding doc.
- **Build env on VPS:** `/srv/jeremylongshore/.env` (mode 600) holds `GITHUB_TOKEN`
  for the stars + contributions plugins (interim plaintext; SOPS is the target).
- **Caddy block:** `jeremylongshore.com, www.jeremylongshore.com { root * /srv/jeremylongshore/dist; file_server }`. Edit `/etc/caddy/Caddyfile` then `sudo caddy reload` (NEVER restart — shared ingress).
- **Manual deploy:** `ssh intentsolutions /usr/local/sbin/deploy-jeremylongshore`.
- **Build-time data** (stars, contributions, RSS) is baked into `_output/` on the
  VPS at deploy time.

> ⚠️ Verify the live host with DNS, not docs: `dig +short jeremylongshore.com`
> → `167.86.106.29` = the VPS. (History: was on Firebase `bigo-portfolio` until
> 2026-06-20, when it migrated to the VPS as part of the GCP exodus — off Google
> and off Netlify, single deploy path.)

## Dependencies

Ruby gems (see Gemfile):
- `liquid` ~> 5.5 - Template rendering
- `nokogiri` >= 1.18.4 - HTML parsing for plugins
- `rexml` - RSS/XML parsing (Work Diary plugin)
- `yaml`, `bigdecimal`, `base64` - Standard libs

## Release Process

Automated via GitHub Actions (`.github/workflows/release.yml`):
- Conventional commits determine version bumps (feat→minor, fix→patch, BREAKING→major)
- Updates `version.txt`, `CHANGELOG.md`, `README.md` version references
- Creates Git tag and GitHub release
