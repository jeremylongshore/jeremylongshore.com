## Task Tracking (Beads / bd)
- Use `bd` for ALL tasks/issues (no markdown TODO lists).
- Start of session: `bd ready`
- Create work: `bd create "Title" -p 1 --description "Context + acceptance criteria"`
- Update status: `bd update <id> --status in_progress`
- Finish: `bd close <id> --reason "Done"`
- End of session: `bd sync` (flush/import/export + git sync)
- Manual testing safety:
  - Prefer `BEADS_DIR` to isolate a workspace if needed. (`BEADS_DB` exists but is deprecated.)


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal landing page for Jeremy Longshore, AI Automation Specialist based in Gulf Shores, Alabama. Built with **Linkyee** (Ruby-based static landing page generator) featuring links to active projects and social profiles.

**Live site:** https://jeremylongshore.com
**GitHub:** https://github.com/jeremylongshore
**Company:** intentsolutions.io
**Contact:** jeremy@intentsolutions.io

**Featured Projects:**
- [Start AI Tools](https://startaitools.com) - AI implementation guides and tutorials
- [Perception](https://perception-with-intent.web.app) - Multi-agent AI news intelligence
- [Claude Code Skills](https://claudecodeskills.io) - Production-ready agent skills
- [Claude Code Plugins](https://claudecodeplugins.io) - 253 plugins marketplace
- [DiagnosticPro](https://diagnosticpro.io) - AI vehicle diagnostics platform
- [PipelinePilot](https://pipelinepilot-prod.web.app) - B2B sales automation
- [HustleStats](https://hustlestats.io) - Youth sports analytics
- [Waygate MCP](https://github.com/jeremylongshore/waygate-mcp) - Enterprise MCP server
- [Bob's Brain](https://intent-solutions-io.github.io/bobs-brain/) - Specialist AI team

## Key Commands

### Local Development
```bash
# Build and preview the site locally
bash build.sh

# Then serve the output directory with any static server
cd _output && python -m http.server 8000
# Visit http://localhost:8000
```

### Building the Site
```bash
# Production build (used by Netlify)
bash build.sh

# Output will be in _output/ directory
```

### Editing Content
All content is managed in a single YAML configuration file:

```bash
# Edit site configuration (links, projects, bio, etc.)
# Open config.yml in your editor
```

**Note:** This is NOT a blog/CMS. It's a single-page landing page with links. All content modifications happen in `config.yml`.

## Project Structure

```
jeremylongshore/
├── config.yml                  # ⭐ MAIN CONFIGURATION FILE (all content lives here)
├── scaffold.rb                 # Ruby build script (generates HTML from template)
├── build.sh                    # Build wrapper script (called by Netlify)
├── Gemfile                     # Ruby dependencies (liquid, yaml, nokogiri)
├── themes/
│   └── default/               # Linkyee theme (HTML template + assets)
│       ├── index.html         # Liquid template (rendered with config.yml data)
│       ├── style.css          # Styles
│       ├── images/            # Theme images (profile.jpeg, etc.)
│       └── fontawesome/       # Font Awesome icons
├── plugins/
│   └── GithubRepoStarsCountPlugin.rb  # Fetches GitHub star counts dynamically
├── _output/                   # Generated site (DO NOT EDIT - auto-generated)
├── netlify.toml               # Netlify deployment config (Ruby 3.4.2)
├── version.txt                # Current version (v1.6.0)
├── CHANGELOG.md               # Auto-generated release changelog
├── CLAUDE.md                  # This file - source of truth for development
└── .github/workflows/
    └── release.yml            # Automated release workflow (conventional commits)
```

**Critical files:**
- `config.yml`: Single source of truth for ALL site content (links, bio, social profiles, projects)
- `scaffold.rb`: Builds site by combining `config.yml` data with theme template
- `themes/default/index.html`: Liquid template that gets populated with config data

**Note:** README.md may be outdated. This CLAUDE.md is the source of truth.

## Linkyee Architecture

### How Linkyee Works

Linkyee is a Ruby-based static site generator optimized for single-page landing pages with links.

**Build process:**
1. `build.sh` is called (by you or Netlify)
2. `bundle install` installs Ruby gems (liquid, yaml, nokogiri)
3. `scaffold.rb` runs:
   - Loads `config.yml` (site configuration)
   - Copies theme from `themes/default/` to `_output/`
   - Runs plugins (e.g., fetches GitHub star counts)
   - Processes Liquid template (`themes/default/index.html`)
   - Injects config data into template
   - Writes final HTML to `_output/index.html`
4. `_output/` directory contains the complete static site

**Key technology:**
- Ruby 3.4.2
- Liquid templating (same as Jekyll, Shopify)
- YAML configuration
- Plugin system for dynamic data

### Configuration Structure (config.yml)

All site content is in `config.yml`:

```yaml
theme: default                    # Theme directory name
lang: "en"                       # HTML lang attribute
title: "Jeremy Longshore - AI Automation & Cloud Infrastructure"
avatar: "./images/profile.jpeg"  # Profile image path
name: "Jeremy Longshore"
tagline: >-                      # Bio/tagline (multiline)
    AI Automation Specialist & Google Cloud Platform Expert...

plugins:                         # Dynamic data fetching
  - GithubRepoStarsCountPlugin:
      - jeremylongshore/claude-code-plugins-plus
      - jeremylongshore/waygate-mcp
      # Access via {{vars.GithubRepoStarsCountPlugin['repo-name']}}

links:                           # Main project links
  - link:
      icon: "fa-solid fa-robot"
      text: "Start AI Tools - Implementation Guides"
      url: "https://startaitools.com"
      alt: "Start AI Tools description"
      title: "Start AI Tools title"
      target: "_blank"

socials:                         # Social media links
  - social:
      icon: "fa-brands fa-github"
      url: "https://github.com/jeremylongshore"
      title: "Jeremy Longshore's GitHub"
      alt: "Jeremy Longshore's GitHub"
      target: "_blank"

footer: >                        # Footer bio text
    AI Automation Specialist & Google Cloud Platform Expert...

copyright: >                     # Footer copyright HTML
    © 2025 <a href="...">Jeremy Longshore</a> | ...
```

### Adding New Projects/Links

Edit `config.yml` and add to the `links` array:

```yaml
links:
  - link:
      icon: "fa-solid fa-code"           # Font Awesome icon
      text: "New Project Name"            # Display text
      url: "https://example.com"         # URL
      alt: "Description for accessibility"
      title: "Hover tooltip text"
      target: "_blank"                   # Open in new tab
```

Then rebuild: `bash build.sh`

## Deployment & Netlify Configuration

**Hosting:** Netlify with automatic deployments on push to main branch

**Build Configuration** (netlify.toml):
```toml
[build]
  command = "bash build.sh"
  publish = "_output"

[build.environment]
  RUBY_VERSION = "3.4.2"
  TZ = "America/Chicago"

[[redirects]]
  from = "http://jeremylongshore.com/*"
  to = "https://jeremylongshore.com/:splat"
  status = 301
  force = true  # HTTP → HTTPS redirect
```

**Deployment workflow:**
1. Edit `config.yml` to update links, bio, or projects
2. Test locally with `bash build.sh && cd _output && python -m http.server 8000`
3. Commit and push to main branch
4. Netlify auto-builds and deploys (typically < 1 minute)

## Theme: Linkyee Default

**Active theme:** `themes/default/` (Linkyee's default theme)

**Design philosophy:**
- Single-page landing page
- Clean, modern design
- Mobile responsive
- Fast loading (minimal dependencies)
- Font Awesome icons
- Focus on links and project showcase

**Customization approach:**
- Primary customization: Edit `config.yml` (no code changes needed)
- Advanced customization: Edit `themes/default/index.html` (Liquid template)
- Styling: Edit `themes/default/style.css`
- Images: Replace `themes/default/images/profile.jpeg`

**Never edit `_output/` directory** - It's auto-generated and will be overwritten on every build

## Critical Development Rules

1. **Never edit `_output/` directory** - It's auto-generated and will be overwritten
2. **All content changes happen in `config.yml`** - Single source of truth
3. **Test locally before committing** - Run `bash build.sh` to preview changes
4. **Ruby version locked** - Site uses Ruby 3.4.2 (defined in netlify.toml and .ruby-version)
5. **Icons use Font Awesome** - Free icons only: https://fontawesome.com/search?o=r&m=free
6. **Plugin output caching** - GitHub star counts may be cached; rebuild clears cache

## Common Development Tasks

### Adding a New Project Link
```bash
# 1. Edit config.yml
# 2. Add new entry to the 'links' array
# 3. Build and test
bash build.sh
cd _output && python -m http.server 8000

# 4. Commit and push
git add config.yml
git commit -m "feat: add new project link"
git push
```

### Updating Bio/Tagline
```bash
# Edit the 'tagline' or 'footer' fields in config.yml
# Then rebuild
bash build.sh
```

### Changing Profile Image
```bash
# 1. Replace themes/default/images/profile.jpeg
# 2. Or update the 'avatar' field in config.yml to point to new image
# 3. Rebuild
bash build.sh
```

### Adding a New Social Profile
```bash
# 1. Edit config.yml
# 2. Add new entry to the 'socials' array
# 3. Find icon code from Font Awesome (e.g., "fa-brands fa-twitter")
# 4. Rebuild and test
bash build.sh
```

### Testing Plugin Changes
```bash
# Plugins are in plugins/ directory (Ruby files)
# After editing a plugin, rebuild to see changes
bash build.sh
```

## Versioning & Releases

**Current version:** v1.5.1 (released Dec 12, 2025)
**Release workflow:** Automated via GitHub Actions (`.github/workflows/release.yml`)

### Release Process
- **Automatic:** Triggered on push to main branch
- **Manual:** Can be triggered via workflow_dispatch with bump type (major/minor/patch/auto)
- **Version files updated:** `version.txt`, `package.json` (if exists), `CHANGELOG.md`, `README.md`
- **Conventional Commits:** Uses commit messages to determine bump type automatically
  - `BREAKING CHANGE` → major version bump
  - `feat(...)` → minor version bump
  - Other commits → patch version bump
- **Artifacts:** Creates Git tag, GitHub release with auto-generated changelog

### Recent Releases
- **v1.5.1** (Dec 12, 2025): "Hunting the ghost bug - 9 PRs one import path"
- **v1.5.0** (Dec 11, 2025): "From Did I Lose My PRs to Google Recognized"
- **v1.4.0** (Dec 2, 2025): "Delivering Brand Consistency"
- **v1.3.0** (Nov 18, 2025): "Solving Stripe webhook drift unified enforcement"

## Active GitHub Repositories (Dec 2025)

**Public Repositories (15 total):**
- `claude-code-plugins-plus` - 227 plugins hub, most actively developed (updated Oct 19)
- `startaitools.com` - AI tools directory with tutorials (Hugo + Jupyter notebooks)
- `jeremylongshore.com` - This blog (Python sync scripts, Hugo)
- `bobs-brain` - Slack AI assistant with sovereign deployment
- `waygate-mcp` - Enterprise MCP server framework (Python 3.12, FastAPI, Docker)
- `local-rag-agent-intent-solutions` - Local RAG system with zero-cost deployment
- `ai-devops-intent-solutions` - AI-powered documentation generator (5-minute PRDs)
- `lead-followup-system-n8n` - B2B lead capture with AI scoring
- `gmail-drive-organizer-n8n` - Gmail attachment automation
- `disposable-marketplace-n8n` - Instant marketplace for quote collection
- `ai-blog-journalist-n8n` - Automated content using Perplexity + Claude
- `news-pipeline-n8n` - Daily news monitoring with AI analysis
- `n8n-workflow-template` - Professional N8N repo template
- `diagnosticpro-schema-sql` - SQL schemas (public subset)
- `Hybrid-ai-stack-intent-solutions` - 60-80% AI cost reduction

**Private Repositories:**
- `hustle` - Youth sports stats app (Next.js 15 + TypeScript + PostgreSQL)
- `DiagnosticPro` - Main diagnostic platform (TypeScript, Firebase, Vertex AI)
- `intent-solutions-landing` - Company landing page (TypeScript, React/Vite, Bun)
- `diagnostic-platform` - Data platform components (Python)
- `cost-plus-db` - Database work (HTML)
- Others: `plugins-Claude-code`, `claude-code-marketplace`, `prompts-intent-solutions`, `brainstorm-intent-solutions`, `daily-energizer-workflow-n8n`, `fix-it-detective-ai`, `diagnostic-pro-mvp3-legacy`

**Recent Activity Indicators:**
- Most active: `claude-code-plugins-plus` (daily commits)
- Regular updates: `startaitools.com`, `hustle`, `jeremylongshore.com`
- Stable/mature: `waygate-mcp`, `bobs-brain`, N8N workflow repos

## Technology Stack (Based on Active Projects)

**Primary Languages:**
- Python (AI agents, automation, data pipelines, MCP servers)
- TypeScript/JavaScript (React, Next.js 15, web applications)
- SQL (PostgreSQL, BigQuery)
- Shell scripting (automation, DevOps)

**Frontend Frameworks:**
- Next.js 15 (App Router, React 19)
- SvelteKit (DiagnosticPro)
- React 18/19 + Vite
- Hugo (static sites)

**Backend & Infrastructure:**
- Google Cloud Platform (Vertex AI Gemini, BigQuery, Firestore, Cloud Functions, Cloud Run)
- Firebase (Hosting, Functions, Firestore)
- Docker (containerization, MCP servers)
- FastAPI (Python APIs)
- PostgreSQL (Hustle, other apps)

**AI & Automation:**
- Google Vertex AI Gemini 2.5 Flash (primary)
- Claude API (Anthropic)
- N8N (workflow automation - 10+ production workflows)
- Ollama (local models)
- LangChain, RAG systems

**DevOps & Deployment:**
- Netlify (static sites, auto-deploy)
- Google Cloud Run (containerized services)
- GitHub Actions (CI/CD)
- Terraform (IaC for AWS/GCP)
- Nginx (reverse proxy)

## Important Context for AI Assistants

**Development Philosophy:**
- "Deploy in days, not months" - Rapid prototyping and iteration
- Practical solutions over theoretical perfection
- Working code over comprehensive documentation
- Business value over technical complexity

**Common Workflow:**
1. Build MVP in 24-72 hours
2. Deploy to production early
3. Iterate based on real usage
4. Document what actually works

**Writing Style in Blog Posts:**
- Direct, no-BS tone
- Focus on real numbers and outcomes
- Technical depth with practical application
- Case studies from actual projects

**Avoid When Writing Content:**
- Corporate buzzwords and fluff
- Theoretical concepts without implementation
- Over-promising or marketing speak
- Generic advice without specifics