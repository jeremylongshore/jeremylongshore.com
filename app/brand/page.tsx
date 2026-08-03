import type { Metadata } from 'next';
import Image from 'next/image';
import { Eyebrow } from '@/components/Eyebrow';
import { SectionReveal } from '@/components/SectionReveal';
import { PillButton } from '@/components/PillButton';
import { GradientCard } from '@/components/GradientCard';
import { LightLeakImage } from '@/components/LightLeakImage';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Brand — Jeremy Longshore',
  description:
    'The jeremylongshore.com design system — tokens, gradients, typography, and a machine-readable design.md spec built for AI agents to build against.',
};

/**
 * Neutral spine tokens (000-docs/003 §2, verbatim from the reference-system
 * study). Swatches render via `var(--color-*)` so they stay theme-correct;
 * the light/dark hex pair is documentation caption text only (design.md §Color).
 */
const NEUTRAL_TOKENS: { name: string; varName: string; light: string; dark?: string }[] = [
  { name: 'Page', varName: '--color-page', light: '#ffffff', dark: '#0b0b0c' },
  { name: 'Well', varName: '--color-well', light: '#ffffff', dark: '#151517' },
  { name: 'Brand', varName: '--color-brand', light: '#4d4d4d', dark: '#e8e8e8' },
  { name: 'Hairline', varName: '--color-hairline', light: '#eeeeee', dark: '#232327' },
  { name: 'Status · active', varName: '--color-status-active', light: '#22c55e' },
  { name: 'Status · idle', varName: '--color-status-idle', light: '#999999' },
  { name: 'Accent', varName: '--color-accent', light: '#d97706' },
  { name: 'Accent strong', varName: '--color-accent-strong', light: '#b45309' },
];

/** The 12 hover-only accent gradients (design.md §Color). */
const ACCENT_GRADIENTS: { name: string; varName: string; stops: string }[] = [
  { name: 'Sunset', varName: '--gradient-sunset', stops: '#ef4444 → #f97316 → #eab308' },
  { name: 'Emerald', varName: '--gradient-emerald', stops: '#22c55e → #10b981 → #06b6d4' },
  { name: 'Twilight', varName: '--gradient-twilight', stops: '#3b82f6 → #8b5cf6 → #ec4899' },
  { name: 'Neon', varName: '--gradient-neon', stops: '#00bfff → #0015ff → #ff00ea' },
  { name: 'Coral', varName: '--gradient-coral', stops: '#f43f5e → #ec4899 → #d946ef' },
  { name: 'Ocean', varName: '--gradient-ocean', stops: '#6366f1 → #3b82f6 → #06b6d4' },
  { name: 'Citrus', varName: '--gradient-citrus', stops: '#eab308 → #84cc16 → #22c55e' },
  { name: 'Aurora', varName: '--gradient-aurora', stops: '#14b8a6 → #6366f1 → #a855f7' },
  { name: 'Amber', varName: '--gradient-amber', stops: '#f59e0b → #d97706 → #b45309' },
  { name: 'Peach', varName: '--gradient-peach', stops: '#fb7185 → #f9a8d4 → #fbbf24' },
  { name: 'Cosmos', varName: '--gradient-cosmos', stops: '#9333ea → #7c3aed → #4f46e5' },
  { name: 'Prism', varName: '--gradient-prism', stops: '#ef4444 → #06b6d4 → #eab308' },
];

/** The bronze heatmap ramp — the signature element (design.md §Color). */
const HEAT_RAMP: { step: string; varName: string; hex: string }[] = [
  { step: 'heat-0', varName: '--color-heat-0', hex: '#f5f5f4' },
  { step: 'heat-1', varName: '--color-heat-1', hex: '#fef3c7' },
  { step: 'heat-2', varName: '--color-heat-2', hex: '#fde68a' },
  { step: 'heat-3', varName: '--color-heat-3', hex: '#f59e0b' },
  { step: 'heat-4', varName: '--color-heat-4', hex: '#d97706' },
  { step: 'heat-5', varName: '--color-heat-5', hex: '#92400e' },
];

/** Type specimen rows (design.md §Typography). */
const TYPE_SPECIMENS: { label: string; sampleClassName: string; sampleStyle: React.CSSProperties }[] = [
  {
    label: 'H1 · 56px · Medium',
    sampleClassName: 'break-words text-[32px] leading-[1.1] tracking-tight sm:text-[56px]',
    sampleStyle: { color: 'var(--color-brand)', fontWeight: 500 },
  },
  {
    label: 'H2 · 24px · Medium',
    sampleClassName: 'text-2xl tracking-tight',
    sampleStyle: { color: 'var(--color-brand)', fontWeight: 500 },
  },
  {
    label: 'Body · 18px · Light',
    sampleClassName: 'text-lg font-light',
    sampleStyle: { color: 'var(--color-body)' },
  },
  {
    label: 'Eyebrow · 14px · Medium · uppercase',
    sampleClassName: 'text-sm font-medium uppercase tracking-wide',
    sampleStyle: { color: 'var(--color-eyebrow)' },
  },
  {
    label: 'Data/code · Geist Mono 14px',
    sampleClassName: 'font-mono text-sm',
    sampleStyle: { color: 'var(--color-brand)' },
  },
];

const DO_LIST = [
  'Keep the resting page neutral — silver, gray, white (near-black in dark mode).',
  'Spend color on interaction: hover reveals, rings, halos.',
  'Use Amber when a single accent must lead (focus rings, featured labels, the heatmap).',
  'Keep focus rings visible — amber, 2px.',
];

const DONT_LIST = [
  'Use accent gradients as static, page-dominant fills.',
  'Synchronize gradient cycles across component instances.',
  'Show "★ 0" — a zero is never proof.',
  'Animate with layout-shifting properties.',
  'Drop below WCAG AA contrast.',
];

export default function BrandPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6 pt-20 md:pt-28">
      <SectionReveal>
        <header className="flex flex-col items-center gap-6 text-center">
          <Eyebrow>Brand kit</Eyebrow>
          <h1 className="text-5xl leading-[1.1] tracking-tight md:text-7xl">Steal this design system.</h1>
          <p className="max-w-2xl text-lg" style={{ color: 'var(--color-body)' }}>
            Everything on this page is meant to be taken — assets, tokens, and a machine-readable spec
            built for AI agents.
          </p>
        </header>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="design.md for AI agents" className="flex flex-col items-center gap-6 text-center">
          <Eyebrow>The differentiator</Eyebrow>
          <h2 className="text-2xl">design.md — for AI agents</h2>
          <p className="max-w-2xl text-base">
            This site publishes its complete design system as a machine-readable markdown file —
            tokens, components, motion, and voice. Point an agent at it and build something that
            matches.
          </p>
          <PillButton href="/design.md" variant="cta">
            Read design.md
          </PillButton>
          <p className="font-mono text-sm" style={{ color: 'var(--color-faint)' }}>
            jeremylongshore.com/design.md
          </p>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="Downloadable assets" className="flex flex-col gap-8">
          <div className="text-center">
            <Eyebrow>Assets</Eyebrow>
            <h2 className="mt-2 text-2xl">Download</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <GradientCard seed="asset-monogram" shimmer>
              <div className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="rounded-2xl p-3" style={{ backgroundImage: 'var(--gradient-silver)' }}>
                  <div
                    className="flex items-center justify-center rounded-xl border p-6"
                    style={{ background: 'var(--color-well)', borderColor: 'var(--color-well-border)' }}
                  >
                    <Image src="/jl-monogram.svg" alt="JL monogram" width={72} height={72} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg" style={{ color: 'var(--color-brand)' }}>
                    JL monogram
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-faint)' }}>
                    SVG · silver-ring wordmark, used for favicon and nav.
                  </p>
                </div>
                <a
                  href="/jl-monogram.svg"
                  download
                  className="font-medium underline decoration-dotted underline-offset-4"
                  style={{ color: 'var(--color-accent-strong)' }}
                >
                  Download SVG →
                </a>
              </div>
            </GradientCard>

            <GradientCard seed="asset-headshot" shimmer>
              <div className="flex flex-col items-center gap-4 p-6 text-center">
                <LightLeakImage
                  src="/images/profile.jpeg"
                  alt="Jeremy Longshore"
                  width={160}
                  height={160}
                  lightLeak
                  className="w-40"
                />
                <div>
                  <h3 className="text-lg" style={{ color: 'var(--color-brand)' }}>
                    Headshot
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-faint)' }}>
                    JPEG · silver-frame + light-leak treatment.
                  </p>
                </div>
                <a
                  href="/images/profile.jpeg"
                  download
                  className="font-medium underline decoration-dotted underline-offset-4"
                  style={{ color: 'var(--color-accent-strong)' }}
                >
                  Download JPEG →
                </a>
              </div>
            </GradientCard>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="Color tokens" className="flex flex-col gap-10">
          <div className="text-center">
            <Eyebrow>Palette</Eyebrow>
            <h2 className="mt-2 text-2xl">Color</h2>
            <p className="mx-auto mt-2 max-w-xl text-base" style={{ color: 'var(--color-faint)' }}>
              Neutral, refined base — silver and warm gray. Color is an interaction reward, never a
              resting fill.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-eyebrow)' }}>
              Neutrals
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {NEUTRAL_TOKENS.map((token) => (
                <div key={token.varName} className="flex flex-col gap-2">
                  <div
                    className="h-16 w-full rounded-xl border"
                    style={{ background: `var(${token.varName})`, borderColor: 'var(--color-hairline)' }}
                  />
                  <p className="font-mono text-xs" style={{ color: 'var(--color-faint)' }}>
                    {token.name} · {token.light}
                    {token.dark ? ` / ${token.dark}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-eyebrow)' }}>
              12 accent gradients (hover / ring / halo only)
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ACCENT_GRADIENTS.map((gradient) => (
                <div key={gradient.varName} className="flex flex-col gap-2">
                  <div
                    className="h-14 w-full rounded-lg"
                    style={{ backgroundImage: `var(${gradient.varName})` }}
                  />
                  <p className="font-mono text-xs" style={{ color: 'var(--color-faint)' }}>
                    {gradient.name}
                    <br />
                    {gradient.stops}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-eyebrow)' }}>
              Bronze heatmap ramp · signature
            </h3>
            <div className="mt-4 flex gap-2">
              {HEAT_RAMP.map((step) => (
                <div key={step.varName} className="flex flex-1 flex-col gap-2">
                  <div
                    className="h-12 w-full rounded-md border"
                    style={{ background: `var(${step.varName})`, borderColor: 'var(--color-hairline)' }}
                  />
                  <p className="text-center font-mono text-xs" style={{ color: 'var(--color-faint)' }}>
                    {step.hex}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="Typography" className="flex flex-col gap-8">
          <div className="text-center">
            <Eyebrow>Type</Eyebrow>
            <h2 className="mt-2 text-2xl">Typography</h2>
            <p className="mx-auto mt-2 max-w-xl text-base" style={{ color: 'var(--color-faint)' }}>
              Geist Sans everywhere, Geist Mono reserved for numbers-as-evidence. Self-hosted, SIL
              OFL.
            </p>
          </div>
          <div className="flex flex-col">
            {TYPE_SPECIMENS.map((specimen, index) => (
              <div
                key={specimen.label}
                className={index === 0 ? 'pb-6' : 'border-t py-6'}
                style={index === 0 ? undefined : { borderColor: 'var(--color-hairline)' }}
              >
                <p className="font-mono text-xs" style={{ color: 'var(--color-eyebrow)' }}>
                  {specimen.label}
                </p>
                <p className={`mt-2 ${specimen.sampleClassName}`} style={specimen.sampleStyle}>
                  Aa Bb Cc — jeremylongshore.com
                </p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="Usage guidelines" className="flex flex-col gap-8">
          <div className="text-center">
            <Eyebrow>Usage</Eyebrow>
            <h2 className="mt-2 text-2xl">Do / Don&apos;t</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent-strong)' }}>
                Do
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-base">
                {DO_LIST.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" style={{ color: 'var(--color-accent-strong)' }}>
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-faint)' }}>
                Don&apos;t
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-base">
                {DONT_LIST.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" style={{ color: 'var(--color-faint)' }}>
                      −
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
