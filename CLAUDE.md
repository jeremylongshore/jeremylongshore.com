# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal landing page for Jeremy Longshore built with **Linkyee** (Ruby-based static site generator). Single-page design featuring project links, social profiles, and dynamic GitHub star counts.

**Live:** https://jeremylongshore.com
**Deployment:** Firebase Hosting (`bigo-portfolio`) via `.github/workflows/firebase-deploy.yml` on push to `main`. Netlify is connected for PR deploy previews only — it does NOT serve the live domain.

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

**Firebase Hosting** (project `bigo-portfolio`) serves the live domain. Apex
`jeremylongshore.com` and `www` both point at Firebase (A `199.36.158.100`).

- **Production deploy:** `.github/workflows/firebase-deploy.yml` runs on push to
  `main` — builds with `scaffold.rb` (`GITHUB_TOKEN` in env), authenticates to
  GCP via Workload Identity Federation (pool `github-pool`, SA
  `github-actions@bigo-portfolio.iam.gserviceaccount.com`), then
  `firebase deploy --only hosting`.
- **Manual deploy:** `bash build.sh && firebase deploy --only hosting --project bigo-portfolio`.
- **Netlify is PREVIEW-ONLY:** the Netlify GitHub app builds a deploy preview per
  PR (`deploy-preview-<N>--jeremylongshore.netlify.app`). It does **not** serve
  the production domain.
- **Build-time data** (stars, contributions, RSS) is baked into `_output/` at
  build time; CI rebuilds it on every deploy.

> ⚠️ Verify the live host with DNS, not docs: `dig +short jeremylongshore.com`
> → `199.36.158.100` = Firebase. (2026-06-20: a redesign was briefly mis-shipped
> on the assumption Netlify was canonical — it is not.)
>
> **Planned (GCP exodus):** migrating the apex to Netlify is a candidate but is
> NOT done — it needs a deliberate Porkbun DNS cutover + Netlify domain/SSL setup
> with rollback. Until executed, Firebase is production.

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
