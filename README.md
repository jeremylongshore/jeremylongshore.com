# JeremyLongshore.com

[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase)](https://firebase.google.com/products/hosting)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-v2.17.0-blue)

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
_output/                # Generated static site (deployed to Firebase)
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

### GitHub Actions + Workload Identity Federation (WIF)

On push to `main`, GitHub Actions:
1. Checks out code
2. Sets up Ruby 3.2 + bundler
3. Runs `bundle exec ruby scaffold.rb` to build
4. Authenticates to GCP via WIF (no service account keys)
5. Deploys `_output/` to Firebase Hosting

**WIF Configuration:**
- **Workload Identity Pool:** `github-pool`
- **Provider:** `github-provider`
- **Service Account:** `github-actions@bigo-portfolio.iam.gserviceaccount.com`
- **Project:** `bigo-portfolio`

### Manual Deploy

```bash
bash build.sh
firebase deploy --only hosting --project bigo-portfolio
```

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

### GitHub Stars Plugin
Automatically fetches star counts for repos listed in `data/projects.yml`:
```yaml
github_repo: "owner/repo-name"  # Add to any project
```
Stars are cached in `.github_stars_cache.json` between builds.

## Release Process

Automated via GitHub Actions on push to `main`:
1. Conventional commits determine version bump (feat→minor, fix→patch, BREAKING→major)
2. Updates `version.txt`, `CHANGELOG.md`, README version references
3. Creates Git tag and GitHub release

## Tech Stack

- **Generator:** [Linkyee](https://github.com/username/linkyee) (Ruby + Liquid)
- **Hosting:** Firebase Hosting
- **CI/CD:** GitHub Actions with Workload Identity Federation
- **Auth:** GCP WIF (keyless authentication)
- **Icons:** Font Awesome Free
- **Analytics:** Google Analytics 4

## File Management

| File | Purpose |
|------|---------|
| `config.yml` | All site content - single source of truth |
| `data/projects.yml` | Project listings with metadata |
| `_output/` | Generated site (auto-deployed) |
| `firebase.json` | Firebase hosting config |
| `.firebaserc` | Firebase project binding |

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
