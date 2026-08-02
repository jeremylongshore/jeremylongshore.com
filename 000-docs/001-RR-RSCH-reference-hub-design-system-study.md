# Reference Hub Design-System Study

**Doc:** 001-RR-RSCH-reference-hub-design-system-study
**Date:** 2026-08-02
**Status:** Final (Phase 0 deliverable of the hub rebuild)
**Anonymization note:** This study documents a best-in-class personal hub site referred to throughout as **the reference site (RS)**. The RS owner's identity, domains, product names, and handles are deliberately excluded from this repository. The design facts below were captured from the RS's *publicly published, machine-readable design-system document* — a spec the RS intentionally ships for developers and AI agents to consume. We adopt the system's architecture while building Jeremy's own identity on top of it (see `003-DR-SPEC-design-language-adaptation.md`).

---

## 1. Why this reference

The RS is a personal hub site that does what jeremylongshore.com should do:

- **Hub-and-spokes strategy.** The personal site is the trust anchor; each product lives on its own domain and is cross-linked from the hub; OSS repositories serve as social proof. This maps 1:1 to Jeremy's estate (claudecodeplugins.io, tonsofskills.com, startaitools.com, intentsolutions.io, hustlestats.io, scorecardecho.com).
- **Dynamic, not static.** Live per-post view counts, a live GitHub contribution heatmap, real project metrics. Credibility is shown, not claimed.
- **AI-agent-native.** The RS publishes its complete design system as a machine-readable markdown spec so agents can build against it — a differentiator worth copying outright (Jeremy's own `design.md` ships in Phase 4).
- **Confirmed stack:** Next.js (`/_next/image` paths observed) + Tailwind + Geist Sans/Mono (SIL OFL, self-hostable). Built with heavy AI-agent assistance.

## 2. Core design principles (from the RS spec)

1. **Neutral, refined base.** Silver gradients and warm grays let the work stand out. Color appears **only as an interaction reward** — accent gradients on hover or as small accents, never as dominant static fills.
2. **Rounded forms are the native aesthetic.** Pills, circles, rings, generous radii.
3. **Motion is soft and physical.** Modest translations, gentle scaling, extended crossfades — never abrupt.

## 3. Color tokens

**Primary palette:**

| Token | Value | Use |
|---|---|---|
| Brand gray | `#4d4d4d` | Headings, icons, primary text |
| Body text | `rgba(77,77,77,0.8)` | Body copy |
| Hover/active | `#000000` | Interactive text states |
| Background | `#ffffff` | Page background |
| Borders/dividers | `#eeeeee` | Hairlines |

**Silver UI gradients:**

| Token | Value |
|---|---|
| Card border (default) | `linear-gradient(to bottom, #fcfcfc, #b9b9b9)` |
| Button primary | `linear-gradient(to bottom, #999, #4d4d4d)` |
| Card border (angled) | `linear-gradient(113deg, #fcfcfc 0%, #b9b9b9 84%)` |
| Card border (reverse) | `linear-gradient(203deg, #fcfcfc 18%, #b9b9b9 100%)` |

**12 accent gradients** (all `linear-gradient(to bottom, …)`), used only for hover reveals, rings, halos, and small accents:

| # | Name | Stops |
|---|---|---|
| 1 | Sunset | `#ef4444` → `#f97316` → `#eab308` |
| 2 | Emerald | `#22c55e` → `#10b981` → `#06b6d4` |
| 3 | Twilight | `#3b82f6` → `#8b5cf6` → `#ec4899` |
| 4 | Neon | `#00bfff` → `#0015ff` → `#ff00ea` |
| 5 | Coral | `#f43f5e` → `#ec4899` → `#d946ef` |
| 6 | Ocean | `#6366f1` → `#3b82f6` → `#06b6d4` |
| 7 | Citrus | `#eab308` → `#84cc16` → `#22c55e` |
| 8 | Aurora | `#14b8a6` → `#6366f1` → `#a855f7` |
| 9 | Amber | `#f59e0b` → `#d97706` → `#b45309` |
| 10 | Peach | `#fb7185` → `#f9a8d4` → `#fbbf24` |
| 11 | Cosmos | `#9333ea` → `#7c3aed` → `#4f46e5` |
| 12 | Prism | `#ef4444` → `#06b6d4` → `#eab308` |

## 4. Typography

Geist Sans everywhere; Geist Mono for code/technical content.

| Style | Spec |
|---|---|
| H1 | 56px (up to 124px hero) / Medium / tight tracking / 1.1 line-height |
| H2 | 24px / Medium |
| Body | 18px / Light / relaxed leading / `rgba(77,77,77,0.8)` |
| Small/captions | 14px / Regular / `rgba(77,77,77,0.6)` |
| Eyebrow labels | 14px / Medium / uppercase / wide tracking / `rgba(77,77,77,0.5)` |
| Code | Geist Mono 13–14px |

## 5. Spacing & radius

- Base radius token: `--radius: 0.625rem`; scale from `radius-sm` (base − 4px) through `radius-4xl` (base + 16px).
- Cards: `rounded-3xl` outer / `rounded-xl` inner. Buttons, chips, tags, bars: `rounded-full`.
- Circles and rings are foundational brand shapes.

## 6. Card component architecture — the 3-layer sandwich

1. **Resting silver frame** — outer gradient layer (default silver or angled variant).
2. **Accent gradient overlay** — one of the 12 gradients revealed on hover via opacity transition.
3. **Content well** — white interior with `border: 1px solid rgba(0,0,0,0.15)`.

Structure: `p-3` (12px) padding turns the gradient layers into visible borders; outer `rounded-3xl`, inner `rounded-xl`.

## 7. Image treatments

- **Warm light-leak** (screen blend mode, 3 radial gradients): ellipse at 85%/15% `rgba(255,120,100,0.4)`→50%; ellipse at 10%/80% `rgba(255,200,100,0.2)`→50%; ellipse at 50%/50% `rgba(255,255,255,0.1)`→70%.
- **Metallic avatar ring:** 4px pad, `linear-gradient(to bottom, #999, #4d4d4d)`, inset bevels `inset 0 8px 8px rgba(255,255,255,0.5), inset 0 -8px 8px rgba(77,77,77,0.2)`.
- **Gradient avatar ring (active):** cycles the 12 accent gradients — 2s per gradient, 24s full loop, hash-random per-instance offset so no two rings are synchronized.
- **Gradient halo:** 3px accent border (`rounded-2xl`) + blurred identical gradient backdrop (`-inset-1`, `blur-lg`, ~40% opacity).
- **Silver frame:** 8px-padded container with the silver gradient, `rounded-2xl`, inner image border `rgba(0,0,0,0.15)`.
- **Status chip:** frosted pill (`bg-white/80` + `backdrop-blur`), fully rounded, 8px dot (`#22c55e` active / `#999` inactive) + 12px medium label.

## 8. Motion tokens

| Token | Spec | Used for |
|---|---|---|
| Micro | 200ms ease-out | Text color, 1.02–1.10 hover scale, 0.97–0.98 active |
| Hover | 300ms ease-out | Card lift `-translate-y-1`, gradient fade, image zoom 1.05–1.10 |
| Slide-in | 350ms `cubic-bezier(0.22, 1, 0.36, 1)` | Fade + 2rem translate-x |
| Crossfade | 500ms | Gradient cycle opacity |
| Scroll reveal | 700ms ease-out | Sections fade + rise 2rem on first view; IntersectionObserver threshold 0.15 |

**Signature animations:**

- **Gradient cycle:** 12 accents crossfade sequentially — 2s each, 24s loop, hash-based random per-instance offset (never synchronized).
- **Pill button spin:** conic accent gradient rotating continuously (4s linear), layered with the 24s crossfade.
- **Cursor shimmer:** soft white radial (`rgba(255,255,255,0.7)` core, 600px radius) tracking the cursor across card surfaces.

## 9. Page architecture (homepage, top to bottom)

1. Header/nav — wordmark + primary links.
2. Hero — large first-person headline + subscription/CTA prompt.
3. About blurb — values-forward, personality over résumé.
4. Projects grid — 8 cards with imagery + frosted status chips, each product on its own domain.
5. **Live GitHub contribution heatmap.**
6. Featured writing — cards with **live per-post view counts** (a "Featured" label + view count on the top performer).
7. Topic tags.
8. Speaking section — availability + past venues.
9. Curated tools list — 70+ items with category filtering (books/podcasts/tools/products/services/learning).
10. Repeated CTAs throughout.
11. Deep footer — full link tree, socials, legal.

**Subpages:** `/about` (personality-forward, no timeline — hypothetical scenarios reveal character), `/brand` (logo downloads, headshots, 6K wallpapers **with HTML wallpaper generators**, media kit, and the machine-readable design spec itself), `/contact`, plus per-service landing pages targeting long-tail queries.

## 10. Usage directives (from the RS spec)

**Do:** logo on white/light backgrounds; invert to white on dark; clear space = logo height; minimum 24px; strict palette adherence.
**Don't:** stretch/skew/recolor/rotate/crop the logo; add shadows/effects; place on busy or low-contrast backgrounds; **use accent gradients as large static fills.**

## 11. What we adopt vs. adapt

| Adopt outright | Adapt to Jeremy's identity |
|---|---|
| Token system (colors, silver + 12 accent gradients, radius, motion) | Wordmark, monogram, headshot assets |
| 3-layer card sandwich, pill buttons, status chips | Which accent family leads (see design-language spec) |
| Gradient-cycle / shimmer / scroll-reveal behaviors | Section copy voice (blunt operator, not marketer) |
| Live-data credibility pattern (heatmap, view counts, stars) | Data sources: GitHub GraphQL, startaitools RSS, Umami |
| Machine-readable `design.md` for AI agents (Phase 4) | Curated tools list contents |
| Hub-and-spokes cross-linking | Spokes: Jeremy's own product domains |

## 12. Verification gates tied to this study

- **Name-leak gate:** before every commit, a repo-wide grep for the RS owner's name/domains/handles must return zero hits (package.json and lockfile included). The identity lives only in session context, never in this repo.
- Live-data features must fail loudly (build/health alarms), never render silently empty.
