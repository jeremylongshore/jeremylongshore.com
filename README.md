# JeremyLongshore.com

[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase)](https://firebase.google.com/products/hosting)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-v2.22.1-blue)

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
_output/                # Generated static site (committed; deployed to Firebase)
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

**Firebase Hosting** (project `bigo-portfolio`) serves the live domain. The apex
`jeremylongshore.com` and `www` both resolve to Firebase (`199.36.158.100`).

On push to `main`, `.github/workflows/firebase-deploy.yml`:
1. Checks out + sets up Ruby 3.2
2. Builds with `bundle exec ruby scaffold.rb` (`GITHUB_TOKEN` in env so the
   stars/contributions plugins fetch live)
3. Authenticates to GCP via Workload Identity Federation (no service-account keys)
4. Runs `firebase deploy --only hosting --project bigo-portfolio`

**Manual deploy:**

```bash
GITHUB_TOKEN=$(gh auth token) bash build.sh
firebase deploy --only hosting --project bigo-portfolio
```

**Netlify is preview-only** — the Netlify GitHub app builds a deploy preview per
PR (`deploy-preview-<N>--jeremylongshore.netlify.app`); it does **not** serve the
live domain. Verify the host with `dig +short jeremylongshore.com`, not docs.
Migrating the apex to Netlify (GCP exodus) is a candidate but not yet done.

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
- **Hosting:** Firebase Hosting (`bigo-portfolio`)
- **CI/CD:** GitHub Actions — `firebase-deploy.yml` (deploy via WIF) + `release.yml` (versioning); Netlify GitHub app for PR previews only
- **Icons:** Font Awesome Free
- **Analytics:** Google Analytics 4 + self-hosted Umami

## File Management

| File | Purpose |
|------|---------|
| `config.yml` | All site content - single source of truth |
| `data/projects.yml` | Project listings with metadata |
| `_output/` | Generated site (committed; deployed to Firebase) |
| `firebase.json` | Firebase hosting config |
| `.firebaserc` | Firebase project binding |
| `netlify.toml` | Netlify config (PR deploy previews only) |

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
