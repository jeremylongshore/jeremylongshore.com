import { GradientCard } from '@/components/GradientCard';
import { Eyebrow } from '@/components/Eyebrow';
import { SectionReveal } from '@/components/SectionReveal';
import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getContributions } from '@/lib/data/github-contributions';
import { safely } from '@/lib/safe';

export async function ContributionsSection() {
  const contributions = await safely('contributions', () => getContributions());

  return (
    <SectionReveal>
      <section aria-label="Open source contributions" className="flex flex-col gap-8">
        <div className="text-center">
          <Eyebrow>Upstream, not just downstream</Eyebrow>
          <h2 className="mt-2 text-2xl">Open-source contributions</h2>
          {contributions && (
            <p className="mt-2 text-base" style={{ color: 'var(--color-faint)' }}>
              <span className="font-mono">{contributions.totalPrs}</span> merged PRs across{' '}
              <span className="font-mono">{contributions.totalRepos}</span> external repos
            </p>
          )}
        </div>
        {contributions ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {contributions.highlights.map((c) => (
                <GradientCard key={c.repo} seed={c.repo} href={c.url}>
                  <div className="flex h-full flex-col p-5">
                    <h3 className="text-lg" style={{ color: 'var(--color-brand)' }}>
                      {c.label}
                    </h3>
                    <p className="mt-2 grow text-sm">{c.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm" style={{ color: 'var(--color-accent-strong)' }}>
                        {c.count} merged PR{c.count === 1 ? '' : 's'}
                      </span>
                      {c.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-2.5 py-0.5 text-xs"
                          style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-faint)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </GradientCard>
              ))}
            </div>
            {contributions.others.length > 0 && (
              <p className="text-center text-sm" style={{ color: 'var(--color-faint)' }}>
                Also merged in{' '}
                {contributions.others.map((o, i) => (
                  <span key={o.repo}>
                    {i > 0 && ' · '}
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-4 transition-colors duration-200 hover:text-black"
                    >
                      {o.name}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <LiveDataNotice what="contribution data" />
          </div>
        )}
      </section>
    </SectionReveal>
  );
}
