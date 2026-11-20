import type { Metadata } from 'next';
import { SocialIcon } from '@/components/SocialIcon';
import { Footer } from '@/components/sections/Footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact: Jeremy Longshore',
  description:
    'Book a call, send an email, or reach out to Intent Solutions for company projects. Email gets read daily.',
};

const EMAIL = 'jeremy@intentsolutions.io';
/** One size for the three offers, measured to fill the column with the longest, so the bill reads as one row. */
const FIT_OFFER = 28;

/** Three ways in, set as a bill: each a column under a five-point rule, parted by five-point verticals. */
export default function ContactPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <header className="page-head container">
          <h1 className="fit-block" style={{ maxWidth: '40rem' }}>
            <span className="fit" style={{ '--fit': 47 } as React.CSSProperties}>Let&apos;s talk.</span>
          </h1>
          <p className="lead">Fastest paths below. Email gets read daily.</p>
        </header>

        <section className="section--s container" aria-label="Ways to reach me" style={{ paddingTop: 'var(--section-gap-s)' }}>
          <h2 className="visually-hidden">Ways to reach me</h2>
          <div className="bill">
            <div className="bill__col">
              <h3 className="display fit-block">
                <span className="fit" style={{ '--fit': FIT_OFFER } as React.CSSProperties}>Book a call</span>
              </h3>
              <p>The fastest way in: 30 minutes, straight to it.</p>
              <p className="action">
                <a href={site.bookingUrl} className="btn" target="_blank" rel="noopener noreferrer">
                  Book a call
                </a>
              </p>
            </div>
            <div className="bill__col">
              <h3 className="display fit-block">
                <span className="fit" style={{ '--fit': FIT_OFFER } as React.CSSProperties}>Email</span>
              </h3>
              <p>Direct to me, read daily, no ticket queue.</p>
              <p className="action">
                <a href={`mailto:${EMAIL}`} className="link bill__email">
                  {EMAIL}
                </a>
              </p>
            </div>
            <div className="bill__col">
              <h3 className="display fit-block">
                <span className="fit" style={{ '--fit': FIT_OFFER } as React.CSSProperties}>Intent Solutions</span>
              </h3>
              <p>For company projects and partner work.</p>
              <p className="action">
                <a href={site.contactUrl} className="btn btn--frame" target="_blank" rel="noopener noreferrer">
                  Visit Intent Solutions
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="section container" aria-label="Profiles">
          <div className="close">
            <h2>Elsewhere</h2>
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
