import { GradientCard } from '@/components/GradientCard';
import { StatusChip } from '@/components/StatusChip';
import { Eyebrow } from '@/components/Eyebrow';
import { SectionReveal } from '@/components/SectionReveal';
import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getFeaturedProjects } from '@/lib/data/projects';
import { getRepoStars, formatStars } from '@/lib/data/github-stars';
import { safely } from '@/lib/safe';

const FEATURED_COUNT = 8;

export async function ProjectsSection() {
  const projects = getFeaturedProjects(FEATURED_COUNT);
  const repos = projects.map((p) => p.githubRepo).filter((r): r is string => Boolean(r));
  const stars = await safely('project-stars', () => getRepoStars(repos));

  return (
    <SectionReveal>
      <section aria-label="Projects" className="flex flex-col gap-8">
        <div className="text-center">
          <Eyebrow>Shipped and running</Eyebrow>
          <h2 className="mt-2 text-2xl">Projects</h2>
        </div>
        {!stars && (
          <div className="flex justify-center">
            <LiveDataNotice what="star counts" />
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => {
            const starCount = project.githubRepo ? stars?.[project.githubRepo] : undefined;
            return (
              <GradientCard
                key={project.id}
                seed={project.id}
                href={project.url ?? (project.githubRepo ? `https://github.com/${project.githubRepo}` : undefined)}
                variant={i % 3 === 0 ? 'default' : i % 3 === 1 ? 'angled' : 'reverse'}
                shimmer
              >
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl" style={{ color: 'var(--color-brand)' }}>
                      {project.title}
                    </h3>
                    <StatusChip
                      label={project.visibility === 'private' ? 'Client' : 'Live'}
                      active={project.visibility !== 'private'}
                    />
                  </div>
                  <p className="mt-3 grow text-base">{project.purposeShort}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {typeof starCount === 'number' && (
                      <span
                        className="font-mono text-sm"
                        style={{ color: 'var(--color-accent-strong)' }}
                        aria-label={`${starCount} GitHub stars`}
                      >
                        ★ {formatStars(starCount)}
                      </span>
                    )}
                    {(project.techStack ?? []).slice(0, 3).map((t) => (
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
            );
          })}
        </div>
      </section>
    </SectionReveal>
  );
}
