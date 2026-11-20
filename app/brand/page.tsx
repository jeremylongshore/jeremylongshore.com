import type { Metadata } from 'next';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Brand: Jeremy Longshore',
  description:
    'The jeremylongshore.com design system: a printed bill in buff, ink and one vermilion, with a machine-readable design.md spec built for AI agents to build against.',
};

/** The palette, read from the token layer (app/tokens.css); swatches render the live token. */
const SWATCHES: { name: string; varName: string; value: string; role: string }[] = [
  { name: 'Paper', varName: '--color-paper', value: 'oklch(92% 0.028 88)', role: 'The buff stock every page is printed on' },
  { name: 'Paper 2', varName: '--color-paper-2', value: 'oklch(88.5% 0.032 88)', role: 'Bands and wells' },
  { name: 'Ink', varName: '--color-ink', value: 'oklch(18% 0.01 50)', role: 'Type, rules, the filled button' },
  { name: 'Vermilion', varName: '--color-accent', value: 'oklch(53% 0.19 33)', role: 'One display line or one figure a screen' },
];

/** Type specimens: the three faces and the role each one plays. */
const SPECIMENS: { face: string; role: string; className: string; sample: string }[] = [
  { face: 'Six Caps', role: 'Headlines and big figures, fitted to the measure', className: 'display', sample: 'I build what I sell' },
  { face: 'Bevan', role: 'Section heads, item titles, the wordmark', className: 'specimen-slab', sample: 'Prove it upstream' },
  { face: 'Archivo Narrow', role: 'Everything read: body, labels, captions', className: 'specimen-body', sample: 'Twenty years in operations, then a self-taught developer.' },
];

const DO_LIST = [
  'Print on buff with near-black ink; spend vermilion on one line or one figure a screen.',
  'Fit Six Caps lines to their column; every big line fills its measure.',
  'Part sections with a five-point ink rule, rows with a hair rule.',
  'Keep corners square and surfaces flat; no shadows.',
  'Show live numbers, and say so plainly when a feed is down.',
];

const DONT_LIST = [
  'Add a second accent colour or a gradient.',
  'Set labels in tracked capitals; capitals belong to the display and the buttons.',
  'Show a zero as proof.',
  'Animate layout properties or reveal content with script.',
  'Drop below WCAG AA contrast.',
];

export default function BrandPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <header className="page-head container">
          <h1 className="fit-block" style={{ maxWidth: '34rem' }}>
            <span className="fit" style={{ '--fit': 47 } as React.CSSProperties}>Steal this</span>
            <span className="fit fit--accent" style={{ '--fit': 32 } as React.CSSProperties}>design system.</span>
          </h1>
          <p className="lead">Assets, tokens, and a machine-readable spec built for AI agents. Take all of it.</p>
        </header>

        <section className="band grained" aria-labelledby="design-md" style={{ marginTop: 'var(--section-gap)' }}>
          <div className="container split">
            <h2 id="design-md">design.md for AI agents</h2>
            <div className="prose">
              <p>
                This site publishes its whole design system as one markdown file: tokens, components, motion and
                voice. Point an agent at it and build something that matches.
              </p>
              <p className="hero__actions">
                <a href="/design.md" className="btn">
                  Read design.md
                </a>
              </p>
              <p className="label">jeremylongshore.com/design.md</p>
            </div>
          </div>
        </section>

        <section className="section container" aria-labelledby="assets">
          <div className="split">
            <h2 id="assets">Download</h2>
            <div>
              <div className="asset" style={{ paddingTop: 0 }}>
                <div className="asset__art frame">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the published SVG as it downloads */}
                  <img src="/jl-monogram.svg" alt="JL monogram" width={72} height={72} />
                </div>
                <div>
                  <h3>JL monogram</h3>
                  <p className="muted">SVG, used for the favicon.</p>
                  <p style={{ marginTop: 'var(--space-sm)' }}>
                    <a href="/jl-monogram.svg" download className="link">
                      Download the SVG
                    </a>
                  </p>
                </div>
              </div>
              <div className="asset">
                <div className="frame frame--photo">
                  <div style={{ aspectRatio: '1 / 1' }} data-slot="headshot" data-alt="Jeremy Longshore headshot">
                    {/* eslint-disable-next-line @next/next/no-img-element -- printed through the slot's duotone */}
                    <img src="/images/profile.jpeg" alt="Jeremy Longshore" width={400} height={400} loading="lazy" />
                  </div>
                </div>
                <div>
                  <h3>Headshot</h3>
                  <p className="muted">JPEG, the full-colour original. The site prints it in the ink.</p>
                  <p style={{ marginTop: 'var(--space-sm)' }}>
                    <a href="/images/profile.jpeg" download className="link">
                      Download the JPEG
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section container" aria-labelledby="color">
          <div className="split">
            <div>
              <h2 id="color">Color</h2>
              <p className="lead" style={{ marginTop: 'var(--space-lg)' }}>
                A printed bill: buff stock, near-black ink, one vermilion.
              </p>
            </div>
            <dl className="swatches">
              {SWATCHES.map((s) => (
                <div key={s.varName} className="swatch">
                  <div className="swatch__chip" style={{ background: `var(${s.varName})` }} />
                  <dt>{s.name}</dt>
                  <dd>{s.value}</dd>
                  <dd>{s.role}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section container" aria-labelledby="type">
          <div className="split">
            <div>
              <h2 id="type">Typography</h2>
              <p className="lead" style={{ marginTop: 'var(--space-lg)' }}>
                One case of wood type: the gothic for scale, the slab for weight, the narrow for reading. All SIL OFL,
                self-hosted.
              </p>
            </div>
            <div className="specimen">
              {SPECIMENS.map((s) => (
                <div key={s.face} className="specimen__row">
                  <div>
                    <p style={{ fontWeight: 600 }}>{s.face}</p>
                    <p className="label">{s.role}</p>
                  </div>
                  <p className={s.className}>{s.sample}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section container" aria-labelledby="usage">
          <div className="split">
            <h2 id="usage">Do and don&apos;t</h2>
            <div className="bill" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <div className="bill__col">
                <h3>Do</h3>
                <ul className="usage">
                  {DO_LIST.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bill__col">
                <h3>Don&apos;t</h3>
                <ul className="usage">
                  {DONT_LIST.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
