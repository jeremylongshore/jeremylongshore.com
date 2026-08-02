# Design-Language Adaptation Spec — jeremylongshore.com

**Doc:** 003-DR-SPEC-design-language-adaptation
**Date:** 2026-08-02
**Status:** Final (Phase 0 deliverable; governs Phases 1–4)
**Inputs:** `001-RR-RSCH-reference-hub-design-system-study.md` (the RS token system) + Jeremy's identity. Same architecture, own identity — this is an adaptation, not a clone.

---

## 1. Subject, audience, job

- **Subject:** Jeremy Longshore — Marine, 20 years operations, self-taught dev, AI architect. "I make teams AI-native."
- **Audience:** engineering leaders, partner programs, OSS users deciding in under a minute whether this person is real.
- **The page's single job:** prove it with live evidence — running products, real star counts, real contribution activity, real writing — not adjectives.

## 2. What carries over unchanged

The RS neutral spine is adopted verbatim (it is the system's load-bearing wall):

- Full color/gradient/radius/motion token set from the research doc §3–§8.
- 3-layer card sandwich, pill buttons, frosted status chips, scroll reveal, cursor shimmer.
- 12-gradient hover cycle (2s/24s, hash-offset) on cards and active rings.
- Principle: **color only as interaction reward** — the resting page is white/gray/silver.

## 3. Jeremy-specific decisions

### 3.1 Lead accent: Amber (bronze), with Sunset as the CTA family

Where a *single* accent is required (focus rings, featured labels, inline link hover, the heatmap ramp), the lead family is **Amber** `#f59e0b → #d97706 → #b45309`. Rationale: silver frames + bronze accents make a coherent two-metal story — insignia, not decoration — and it is the least-used family in AI-generated design right now (calibration: the current AI-slop cluster is cream/terracotta-serif, black/acid-green, and broadsheet hairlines — we're in none of them). Primary CTAs ("Book a call") use **Sunset** for heat. The other ten gradients appear only inside the standard hover cycle.

### 3.2 Signature element (the one deliberate risk): a bronze contribution heatmap

The live GitHub heatmap renders in a **5-step amber/bronze ramp** (`#fef3c7 → #fde68a → #f59e0b → #d97706 → #92400e`) instead of GitHub green — the most-seen dataviz on the internet, made unmistakably ours. It sits directly under the hero as the first live-data proof. Everything around it stays quiet; this is where the boldness budget is spent.

### 3.3 Wordmark & monogram

- **Wordmark:** "Jeremy Longshore" set in Geist Sans Medium, tight tracking — typographic, no logo drawing.
- **Monogram:** "JL" in Geist Sans Medium inside a silver-gradient ring (the RS metallic-ring treatment applied to type). Used for favicon/OG fallback/nav mark. SVG, committed in Phase 1.

### 3.4 Headshot treatment

Existing `images/profile.jpeg`: metallic silver ring (4px + inset bevels) at rest, accent-gradient cycling ring on hover, warm light-leak overlay. Frosted status chip pinned to it: green dot + "Building" (live text editable in one data file).

### 3.5 Typography

Geist Sans / Geist Mono, self-hosted (SIL OFL), exactly per RS scale. Hero H1: "I make teams AI-native." at 72–96px (124px ceiling is for shorter lines; this line wraps at 96px on desktop). Geist Mono is *earned*: only for numbers-as-evidence (star counts, view counts, dates, heatmap tooltips) — data reads as data.

### 3.6 Voice

Blunt operator, active verbs, sentence case, zero marketing filler. Pattern: claim → live number → link. ("Claude Code Plugins — ★ 2,547 — creator." Not "a thriving ecosystem.") Errors and empty states say what happened and what to do; live-data sections never render silently empty — a failed fetcher keeps last-good data and alarms (build/health), per the architecture invariants.

### 3.7 Sections (homepage order)

Hero (name, thesis line, Partner-credential card, socials, CTA) → bronze heatmap → projects grid (from `data/projects.yml`, status chips, live stars) → OSS contributions (merged external PRs) → writing (startaitools RSS + Umami view counts) → speaking/work-with-me CTA → deep footer (live star count parity with current site).

### 3.8 Dark mode

Phase 4. Token layer ships light-first with every color routed through CSS variables so the dark pass is a variable swap, not a rewrite.

## 4. Quality floor (non-negotiable, unannounced)

Responsive to 360px; visible keyboard focus (amber ring); `prefers-reduced-motion` kills cycle/shimmer/reveal (content still appears); WCAG AA contrast on all text tokens; Lighthouse ≥ 95.
