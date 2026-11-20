import { SocialIcon } from '@/components/SocialIcon';
import { site } from '@/lib/site';

/**
 * Stage hero: the headline fitted to its column in Six Caps (each line its own
 * element, sized in cqi so it fills the measure), one sentence, the two
 * actions, and the portrait printed in the ink in a double-rule frame.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__text">
          <h1 id="hero-title" className="fit-block">
            <span className="fit" style={{ '--fit': 38.5 } as React.CSSProperties}>
              I make teams
            </span>
            <span className="fit fit--accent" style={{ '--fit': 48.5 } as React.CSSProperties}>
              AI-native.
            </span>
          </h1>
          <p className="hero__lead">{site.tagline}</p>
          <div className="hero__actions">
            <a href={site.bookingUrl} className="btn" target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
            <a href={site.contactUrl} className="btn btn--frame" target="_blank" rel="noopener noreferrer">
              Send a message
            </a>
          </div>
          <nav aria-label="Social profiles" className="hero__socials">
            <ul className="socials">
              {site.socials.map((s) => (
                <li key={s.url}>
                  <SocialIcon social={s} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <figure className="hero__figure">
          <div className="frame frame--photo">
            <div className="hero__slot" data-slot="hero" data-alt="Jeremy Longshore, head and shoulders, 1600px or larger">
              {/* eslint-disable-next-line @next/next/no-img-element -- printed through the slot's duotone, which next/image's wrapper would break */}
              <img src="/images/profile.jpeg" alt="Jeremy Longshore" width={400} height={400} fetchPriority="high" />
            </div>
          </div>
          <figcaption>Marine. Citadel grad. Twenty years in operations before software.</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** The credentials, as particulars on a paper band: the individual certificate first, the company badge beneath it. */
export function Credentials() {
  const { developer, partner } = site.credentials;
  return (
    <section className="band grained" aria-labelledby="credentials-title">
      <div className="container creds">
        <h2 id="credentials-title">Certified and partnered</h2>
        <div className="creds__list">
          {developer && (
            <article className="cred">
              <div className="cred__art cred__art--badge">
                {/* eslint-disable-next-line @next/next/no-img-element -- issuer artwork shown as published */}
                <img src={developer.image} alt={developer.imageAlt} width={600} height={600} loading="lazy" />
              </div>
              <div>
                <h3>{developer.title}</h3>
                <p>{developer.description}</p>
                <p>
                  <a href={developer.url} className="link" target="_blank" rel="noopener noreferrer">
                    {developer.linkLabel}
                  </a>
                </p>
              </div>
            </article>
          )}
          <article className="cred">
            <div className="cred__art">
              {/* eslint-disable-next-line @next/next/no-img-element -- issuer artwork shown as published */}
              <img src={partner.image} alt={partner.imageAlt} width={600} height={190} loading="lazy" />
            </div>
            <div>
              <h3>{partner.company}</h3>
              <p>{partner.description}</p>
              <p className="muted">{partner.note}</p>
              <p>
                <a href={partner.url} className="link">
                  {partner.linkLabel}
                </a>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
