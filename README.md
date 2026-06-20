# JeremyLongshore.com

[![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-v2.20.0-blue)

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
_output/                # Generated static site (committed; served by Netlify)
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

**Netlify** hosts the live site, wired via the Netlify GitHub app (no workflow in
this repo). Netlify serves the committed `_output/` directly — `netlify.toml` sets
`publish = "_output"` with no build command, so whatever `_output/` you commit is
what ships.

- Push to `main` → production deploy.
- Every PR gets a deploy preview at `deploy-preview-<N>--jeremylongshore.netlify.app`.
- Build-time data (stars, contributions, RSS) is baked into `_output/` at commit
  time. To refresh it, rebuild and commit:

```bash
GITHUB_TOKEN=$(gh auth token) bash build.sh   # contributions plugin needs a token
git add _output/ && git commit -m "chore: rebuild _output"
```

> Firebase Hosting (`bigo-portfolio`) was the previous deploy; its workflow and
> config (`firebase-deploy.yml`, `firebase.json`, `.firebaserc`) were removed
> 2026-06-20 in favor of Netlify.

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
- **Hosting:** Netlify (serves committed `_output/`)
- **CI/CD:** Netlify GitHub app (deploys) + GitHub Actions `release.yml` (versioning)
- **Icons:** Font Awesome Free
- **Analytics:** Google Analytics 4 + self-hosted Umami

## File Management

| File | Purpose |
|------|---------|
| `config.yml` | All site content - single source of truth |
| `data/projects.yml` | Project listings with metadata |
| `_output/` | Generated site (committed; served by Netlify) |
| `netlify.toml` | Netlify config (publish dir, redirects) |

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
