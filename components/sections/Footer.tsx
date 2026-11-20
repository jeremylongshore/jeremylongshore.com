import { SocialIcon } from '@/components/SocialIcon';
import { getRepoStars, formatStars } from '@/lib/data/github-stars';
import { safely } from '@/lib/safe';
import { site } from '@/lib/site';

/** Statement footer: the closing line fitted in Six Caps on the ink, the bio, the profiles, the page links and the legal line. */
export async function Footer() {
  const stars = await safely('footer-stars', () => getRepoStars([site.canonicalRepo]));
  const starCount = stars?.[site.canonicalRepo] ?? site.footerFallbackStars;

  return (
    <footer className="site-foot grained">
      <div className="container">
        <p className="display fit-block">
          <span className="fit" style={{ '--fit': 26 } as React.CSSProperties}>
            I build what I sell.
          </span>
        </p>
        <p className="site-foot__bio">
          Tons of Skills creator ({formatStars(starCount)}+ stars). Marine.{' '}
          <a href="https://www.citadel.edu" target="_blank" rel="noopener noreferrer">
            Citadel
          </a>{' '}
          grad. Twenty years in operations, then a self-taught developer, now an AI architect.
        </p>
        <div className="site-foot__row">
          <nav aria-label="Social profiles (footer)">
            <ul className="socials">
              {site.socials.map((s) => (
                <li key={s.url}>
                  <SocialIcon social={s} />
                </li>
              ))}
            </ul>
          </nav>
          <ul className="site-foot__links" aria-label="Pages">
            <li><a href="/about">About</a></li>
            <li><a href="/brand">Brand</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy.html">Privacy</a></li>
            <li><a href="/terms.html">Terms</a></li>
          </ul>
        </div>
        <p className="site-foot__legal">
          © 2026 <a href="https://jeremylongshore.com">Jeremy Longshore</a>. Founder of{' '}
          <a href="https://intentsolutions.io" target="_blank" rel="noopener noreferrer">
            Intent Solutions
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
