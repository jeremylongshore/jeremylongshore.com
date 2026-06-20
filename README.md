# JeremyLongshore.com

[![Deploy: self-hosted VPS](https://img.shields.io/badge/deploy-self--hosted%20VPS%20(Caddy)-2ea44f)](https://intentsolutions.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-v2.23.0-blue)

Personal landing page and portfolio for Jeremy Longshore - AI Automation Specialist & Google Cloud Platform Expert.

**Live Site:** [jeremylongshore.com](https://jeremylongshore.com)

## Architecture

```
config.yml              # Site content: bio, socials, booking links
data/projects.yml       # All project listings by category
scaffold.rb             # Ruby build script (loads config → plugins → Liquid)
build.sh                # Build wrapper: bundle install + scaffold.rb
themes/default/         # Liquid template + CSS + Font Awesome
  index.html            # Main template with {{ vars }} placeholders
  styles.css            # Site styling
plugins/                # Ruby plugins for dynamic data
  GithubRepoStarsCountPlugin.rb  # Fetches GitHub star counts
_output/                # Generated static site (rebuilt + served on the VPS via Caddy)
```

**Build flow:** `config.yml` → plugins fetch data → Liquid renders `themes/default/` → `_output/`

## Quick Start

```bash
# Build locally (requires Ruby 3.2+)
bash build.sh

# Preview locally
cd _output && python -m http.server 8000
```

## Deployment

**Self-hosted** on the Intent Solutions VPS (`intentsolutions`, `167.86.106.29`) —
the canonical VPS-as-the-home pattern. Caddy serves the static build via
`file_server` from `/srv/jeremylongshore/dist`. The apex + `www` resolve to the VPS
(`dig +short jeremylongshore.com` → `167.86.106.29`).

On push to `main`, `.github/workflows/deploy.yml`:
1. **Build gate** — Ruby 3.2 + `bundle exec ruby scaffold.rb` (validates Liquid + plugins)
2. **Tailscale OIDC** — keyless auth to the tailnet (per-repo WIF trust)
3. **SSH (force-command)** — triggers `/usr/local/sbin/deploy-jeremylongshore` on the VPS,
   which does `git fetch` + `bundle install` + `ruby scaffold.rb` +
   `rsync -a --delete _output/ → dist/` + writes `dist/healthz`
4. **Smoke check** — `curl https://jeremylongshore.com/healthz` asserts `.ok == true`

Reusable workflow: `jeremylongshore/.github` `vps-deploy.yml` (`variant: static`).
GH secrets: `TS_OIDC_CLIENT_ID`, `TS_AUDIENCE`, `VPS_DEPLOY_KEY`, `VPS_HOST_KEY`.

**Manual deploy:** `ssh intentsolutions /usr/local/sbin/deploy-jeremylongshore`

> Migrated off Firebase Hosting (`bigo-portfolio`) **and** Netlify on 2026-06-20 as
> part of the GCP exodus — single deploy path, no Google, no Netlify.

## Configuration

### Site Content (`config.yml`)
- `title`, `name`, `tagline` - Header content
- `socials` - Social media icons and links
- `booking_url`, `contact_url` - CTA buttons
- `footer`, `copyright` - Footer text

### Projects (`data/projects.yml`)
Organized by category:
- `intent_solutions_repos` - Enterprise/production systems
- `products` - Commercial offerings
- `personal_repos` - Open source projects
- `client_projects` - Work for clients
- `n8n_workflows` - Automation templates

### Build-time data plugins (`plugins/`, auto-run by `scaffold.rb`)
- **GithubRepoStarsCountPlugin** — star counts for any project with a
  `github_repo: "owner/repo-name"`, cached in `.github_stars_cache.json`.
- **GithubContributionsPlugin** — merged PRs to external repos, pulled live from
  the GitHub search API for the Open Source Contributions section (needs
  `GITHUB_TOKEN`; cached in `.github_contributions_cache.json`).
- **StartAIToolsRSSPlugin** — latest startaitools.com posts for the Work Diary.

## Release Process

Automated via GitHub Actions on push to `main`:
1. Conventional commits determine version bump (feat→minor, fix→patch, BREAKING→major)
2. Updates `version.txt`, `CHANGELOG.md`, README version references
3. Creates Git tag and GitHub release

## Tech Stack

- **Generator:** [Linkyee](https://github.com/username/linkyee) (Ruby + Liquid)
- **Hosting:** Self-hosted on the `intentsolutions` VPS (Caddy `file_server`)
- **CI/CD:** GitHub Actions — `deploy.yml` (VPS deploy via Tailscale OIDC) + `release.yml` (versioning)
- **Icons:** Font Awesome Free
- **Analytics:** Google Analytics 4 + self-hosted Umami

## File Management

| File | Purpose |
|------|---------|
| `config.yml` | All site content - single source of truth |
| `data/projects.yml` | Project listings with metadata |
| `_output/` | Generated site (rebuilt + served on the VPS via Caddy) |
| `.github/workflows/deploy.yml` | VPS deploy (Tailscale OIDC + force-command SSH) |

**Rules:**
- Never edit `_output/` manually - regenerated on every build
- All content changes go in `config.yml` or `data/projects.yml`
- Test locally with `bash build.sh` before pushing

## Contact

- **Website:** [jeremylongshore.com](https://jeremylongshore.com)
- **Email:** jeremy@intentsolutions.io
- **GitHub:** [@jeremylongshore](https://github.com/jeremylongshore)
- **LinkedIn:** [Jeremy Longshore](https://linkedin.com/in/jeremylongshore)
- **X/Twitter:** [@asphaltcowb0y](https://x.com/asphaltcowb0y)
