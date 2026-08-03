# jeremylongshore.com — Design System (for developers and AI agents)

This is the machine-readable design system for jeremylongshore.com. If you are an AI agent building something that should match this site, follow this file exactly. Canonical source of the tokens: `app/globals.css` in the site repo.

## Core principles

1. **Neutral, refined base.** Silver gradients and warm grays; the work is the color. The resting page is white/gray/silver (near-black in dark mode).
2. **Color is an interaction reward.** The 12 accent gradients appear only on hover, rings, halos, and small accents — never as dominant static fills.
3. **Two-metal identity.** Silver frames + **Amber/bronze** lead accent. Where a single accent is needed (focus rings, featured labels, the heatmap ramp), use the Amber family.
4. **Rounded forms.** Pills, circles, rings, generous radii.
5. **Soft, physical motion.** Modest translations, gentle scaling, extended crossfades. Never abrupt.
6. **Numbers are evidence.** Monospace type is reserved for live data (star counts, view counts, dates). Never show a zero as proof.

## Color

| Token | Light | Dark |
|---|---|---|
| Page background | `#ffffff` | `#0b0b0c` |
| Brand gray (headings/icons) | `#4d4d4d` | `#e8e8e8` |
| Body text | `rgba(77,77,77,0.8)` | `rgba(232,232,232,0.78)` |
| Captions/small | `rgba(77,77,77,0.78)` | `rgba(232,232,232,0.68)` |
| Eyebrow labels | `rgba(77,77,77,0.8)` | `rgba(232,232,232,0.6)` |
| Hover/active text | `#000000` | `#ffffff` |
| Hairline borders | `#eeeeee` | `#232327` |
| Card content well | `#ffffff` | `#151517` |
| Well border | `rgba(0,0,0,0.15)` | `rgba(255,255,255,0.16)` |
| Status dot active / idle | `#22c55e` / `#999999` | same |
| Lead accent / strong | `#d97706` / `#b45309` | same |

**Silver UI gradients** (used in both modes):

- Card border (default): `linear-gradient(to bottom, #fcfcfc, #b9b9b9)`
- Card border (angled): `linear-gradient(113deg, #fcfcfc 0%, #b9b9b9 84%)`
- Card border (reverse): `linear-gradient(203deg, #fcfcfc 18%, #b9b9b9 100%)`
- Button primary: `linear-gradient(to bottom, #999999, #4d4d4d)`

**12 accent gradients** (all `linear-gradient(to bottom, …)`; hover/ring/halo use only):

1. Sunset `#ef4444 → #f97316 → #eab308` (primary CTA family)
2. Emerald `#22c55e → #10b981 → #06b6d4`
3. Twilight `#3b82f6 → #8b5cf6 → #ec4899`
4. Neon `#00bfff → #0015ff → #ff00ea`
5. Coral `#f43f5e → #ec4899 → #d946ef`
6. Ocean `#6366f1 → #3b82f6 → #06b6d4`
7. Citrus `#eab308 → #84cc16 → #22c55e`
8. Aurora `#14b8a6 → #6366f1 → #a855f7`
9. **Amber `#f59e0b → #d97706 → #b45309` (lead accent family)**
10. Peach `#fb7185 → #f9a8d4 → #fbbf24`
11. Cosmos `#9333ea → #7c3aed → #4f46e5`
12. Prism `#ef4444 → #06b6d4 → #eab308`

**Bronze heatmap ramp** (the signature element; replaces contribution-green):
`#f5f5f4` (empty; `#1c1c1f` dark) → `#fef3c7` → `#fde68a` → `#f59e0b` → `#d97706` → `#92400e`

## Typography

Geist Sans everywhere; Geist Mono for data/code. Self-hosted (SIL OFL).

| Role | Spec |
|---|---|
| H1 | 56px (hero up to 96px) / Medium / tight tracking / 1.1 |
| H2 | 24px / Medium |
| Body | 18px / Light / relaxed leading |
| Small | 14px / Regular |
| Eyebrow | 14px / Medium / uppercase / wide tracking |
| Data/code | Geist Mono 13–14px |

## Radius

Base token `0.625rem`; scale sm `0.375rem` → 4xl `1.625rem`. Cards: `rounded-3xl` outer / `rounded-xl` inner. Buttons, chips, tags: fully rounded.

## Components

**Card (3-layer sandwich):** outer `p-3 rounded-3xl` silver-gradient frame → accent-gradient overlay revealed on hover (opacity 0 → 1, 300ms) cycling the 12 accents (2s each, 24s loop, per-instance hash offset so instances never sync) → content well (`rounded-xl`, well color, 1px well-border). Hover lifts `-translate-y-1`, transform only.

**Pill button:** fully rounded; primary = silver-to-dark gradient with white text; CTA = Sunset family. A conic accent ring spins continuously behind the border (4s linear) layered with the 24s crossfade. Active scale 0.97.

**Avatar ring:** 4px metallic ring (`button` gradient + inset bevels `inset 0 8px 8px rgba(255,255,255,0.5), inset 0 -8px 8px rgba(77,77,77,0.2)`); cycles accents when active/hovered. Optional warm light-leak overlay (screen blend): radial at 85%/15% `rgba(255,120,100,0.4)`→50%, 10%/80% `rgba(255,200,100,0.2)`→50%, 50%/50% `rgba(255,255,255,0.1)`→70%.

**Status chip:** frosted pill (chip-bg token + backdrop-blur), 8px dot, 12px medium label.

**Cursor shimmer:** soft white radial (`rgba(255,255,255,0.7)`, 600px) tracking the pointer across card surfaces.

## Motion

| Token | Value | Use |
|---|---|---|
| Micro | 200ms ease-out | text color, small scales |
| Hover | 300ms ease-out | card lift, gradient fade, image zoom 1.05–1.10 |
| Slide-in | 350ms cubic-bezier(0.22,1,0.36,1) | fade + 2rem translate |
| Crossfade | 500ms | gradient cycle |
| Scroll reveal | 700ms ease-out | sections fade + rise 2rem, IntersectionObserver 0.15, once |
| Pill spin | 4s linear | conic ring |

Accent-cycle layers use **negative** animation-delays so the cycle is live on first paint. `prefers-reduced-motion` collapses all of it; content must remain fully visible.

## Voice

Blunt operator. Claim → live number → link. Active verbs, sentence case, no filler. Errors say what happened and what to do next. Live-data sections never render silently empty — degraded states are visible and honest.

## Do / Don't

**Do:** keep the resting page neutral; spend color on interaction; use Amber when one accent must lead; keep focus rings visible (amber, 2px).
**Note on muted text:** caption/eyebrow alphas are deliberately heavier than the reference system's — they are tuned to hold WCAG AA (4.5:1) at 14px. Do not lighten them.

**Don't:** use accent gradients as static fills; synchronize gradient cycles across instances; show "★ 0"; animate with layout-shifting properties; drop below WCAG AA contrast.
