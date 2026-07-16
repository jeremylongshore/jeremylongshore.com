# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal landing page for Jeremy Longshore built with **Linkyee** (Ruby-based static site generator). Single-page design featuring project links, social profiles, and dynamic GitHub star counts.

**Live:** https://jeremylongshore.com
**Deployment:** Contabo VPS `intentsolutions` (`167.86.106.29`, Caddy). Verified via `dig +short jeremylongshore.com` 2026-07-16. Migrated off Firebase Hosting + Netlify on 2026-06-20. **NOT Firebase, NOT Netlify** — the repo still carries a stale `firebase-deploy.yml`/`netlify.toml` from the old hosts. Confirm the current pipeline against `~/.claude/CLAUDE.md` § "Cloud Platform" and the VPS runbook before touching deploy.

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

## Critical Rules

1. **Never edit `_output/` manually** - regenerated on every build
2. **All content in `config.yml`** - single source of truth
3. **Icons: Font Awesome Free only** - https://fontawesome.com/search?o=r&m=free
4. **Test locally before push**: Run `bash build.sh` to verify changes work
5. **README.md is outdated** - references old Hugo setup; ignore it for architecture info

## Deployment

- **Host:** Contabo VPS `intentsolutions` (`167.86.106.29`), served by Caddy. `dig`-verified 2026-07-16.
- **History:** Migrated 2026-06-20 off **Firebase Hosting** (project `bigo-portfolio`) and Netlify. The old Firebase note (WIF auth, 1-year caching, push-to-`main` trigger) described the retired host, not the live one.
- **Stale artifacts:** `.github/workflows/firebase-deploy.yml` and `netlify.toml` remain in the repo from the prior hosts — they do not reflect the live pipeline. Do not treat them as authoritative.
- **Source of truth for the live pipeline:** `~/.claude/CLAUDE.md` § "Cloud Platform" + the VPS runbook (`~/000-projects/intentsolutions-vps-runbook/`). Verify the host with `dig`, not this file.

## Dependencies

Ruby gems (see Gemfile):
- `liquid` ~> 5.5 - Template rendering
- `nokogiri` >= 1.18.4 - HTML parsing for plugins
- `yaml`, `bigdecimal`, `base64` - Standard libs

## Release Process

Automated via GitHub Actions (`.github/workflows/release.yml`):
- Conventional commits determine version bumps (feat→minor, fix→patch, BREAKING→major)
- Updates `version.txt`, `CHANGELOG.md`, `README.md` version references
- Creates Git tag and GitHub release
