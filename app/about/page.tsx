import type { Metadata } from 'next';
import { SocialIcon } from '@/components/SocialIcon';
import { Footer } from '@/components/sections/Footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About: Jeremy Longshore',
  description:
    'Marine veteran and Citadel grad who spent 20 years running operations before software, now a self-taught developer and AI architect who builds what he sells.',
};

/** The path, in order: a label and the fact, set as particulars. */
const FACTS: { label: string; fact: string }[] = [
  { label: 'Service', fact: 'United States Marine Corps veteran' },
  { label: 'School', fact: 'The Citadel graduate' },
  { label: 'Operations', fact: '20 years of operations leadership before software' },
  { label: 'Software', fact: 'Self-taught developer' },
  { label: 'Now', fact: 'An AI architect' },
];

const BELIEFS = [
  'Evidence over adjectives.',
  'I build what I sell.',
  'Simple survives.',
  'Enforcement travels with the code.',
];

export default function AboutPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <header className="page-head container">
          <h1 className="fit-block" style={{ maxWidth: '40rem' }}>
            <span className="fit" style={{ '--fit': 30.5 } as React.CSSProperties}>Operator first.</span>
            <span className="fit" style={{ '--fit': 28 } as React.CSSProperties}>Engineer second.</span>
            <span className="fit fit--accent" style={{ '--fit': 28 } as React.CSSProperties}>Shipping always.</span>
          </h1>
        </header>

        <section className="section container" aria-labelledby="what-i-do">
          <div className="split">
            <h2 id="what-i-do">What I do</h2>
            <div className="prose">
              {site.companyStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                <a href={site.companyStoryUrl} className="link">
                  How the Intent Solutions work connects
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="section container" aria-labelledby="how-i-got-here">
          <div className="split">
            <div>
              <h2 id="how-i-got-here">How I got here</h2>
              <p className="lead" style={{ marginTop: 'var(--space-lg)' }}>
                The ops years are why the systems ship: reliability habits came before the code.
              </p>
            </div>
            <dl className="particulars">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.fact}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="band grained section--s" aria-labelledby="what-i-believe" style={{ marginTop: 'var(--section-gap)' }}>
          <div className="container split">
            <div>
              <h2 id="what-i-believe">What I believe</h2>
              <p className="lead" style={{ marginTop: 'var(--space-lg)' }}>
                The homepage numbers are live for a reason.
              </p>
            </div>
            <ul className="beliefs">
              {BELIEFS.map((belief) => (
                <li key={belief}>{belief}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section container" aria-label="Get in touch">
          <div className="close">
            <div className="hero__actions">
              <a href={site.bookingUrl} className="btn" target="_blank" rel="noopener noreferrer">
                Book a call
              </a>
              <a href="/contact" className="btn btn--frame">
                Get in touch
              </a>
            </div>
            <nav aria-label="Social profiles">
              <ul className="socials">
                {site.socials.map((s) => (
                  <li key={s.url}>
                    <SocialIcon social={s} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
