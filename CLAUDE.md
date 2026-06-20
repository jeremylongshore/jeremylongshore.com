# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal landing page for Jeremy Longshore built with **Linkyee** (Ruby-based static site generator). Single-page design featuring project links, social profiles, and dynamic GitHub star counts.

**Live:** https://jeremylongshore.com
**Deployment:** Netlify (auto-deploys `main`; serves the committed `_output/` directly)

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

**Netlify** is the live deploy for jeremylongshore.com, wired via the Netlify
GitHub app (not a workflow in this repo):

- **Host:** Netlify — serves the committed `_output/` directly (`netlify.toml`:
  `publish = "_output"`, no build command). Whatever `_output/` you commit is
  what ships.
- **Trigger:** push to `main` → production deploy; every PR gets a deploy preview
  at `deploy-preview-<N>--jeremylongshore.netlify.app`.
- **Build-time data** (stars, contributions, RSS) is baked into `_output/` at
  commit time — run `bash build.sh` and commit `_output/` to refresh it.

**History:** Firebase Hosting (`bigo-portfolio`) was the previous deploy; its
workflow (`firebase-deploy.yml`) and config (`firebase.json` / `.firebaserc`)
were removed 2026-06-20 in favor of Netlify (part of the GCP exodus).

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
