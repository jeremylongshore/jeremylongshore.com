import { SocialIcon } from '@/components/SocialIcon';
import { getRepoStars, formatStars } from '@/lib/data/github-stars';
import { safely } from '@/lib/safe';
import { site } from '@/lib/site';

export async function Footer() {
  const stars = await safely('footer-stars', () => getRepoStars([site.canonicalRepo]));
  const starCount = stars?.[site.canonicalRepo] ?? site.footerFallbackStars;

  return (
    <footer
      className="flex flex-col items-center gap-6 border-t pt-12 text-center text-base"
      style={{ borderColor: 'var(--color-hairline)' }}
    >
      <p className="max-w-2xl">
        Claude Code Plugins creator (<span className="font-mono">{formatStars(starCount)}</span>+ stars). Marine.{' '}
        <a
          href="https://www.citadel.edu"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-4"
        >
          Citadel
        </a>{' '}
        grad. 20 years ops → self-taught dev → AI architect. I build what I sell.
      </p>
      <nav aria-label="Social profiles (footer)" className="flex flex-wrap items-center justify-center gap-1">
        {site.socials.map((s) => (
          <SocialIcon key={s.url} social={s} size={18} />
        ))}
      </nav>
      <p className="pb-12 text-sm" style={{ color: 'var(--color-faint)' }}>
        © 2026{' '}
        <a href="https://jeremylongshore.com" className="underline decoration-dotted underline-offset-4">
          Jeremy Longshore
        </a>{' '}
        |{' '}
        <a
          href="https://intentsolutions.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-4"
        >
          Intent Solutions
        </a>{' '}
        |{' '}
        <a href="/privacy.html" className="underline decoration-dotted underline-offset-4">
          Privacy
        </a>{' '}
        |{' '}
        <a href="/terms.html" className="underline decoration-dotted underline-offset-4">
          Terms
        </a>
      </p>
    </footer>
  );
}
