import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getFeaturedProjects } from '@/lib/data/projects';
import { getRepoStars, formatStars } from '@/lib/data/github-stars';
import { safely } from '@/lib/safe';

const FEATURED_COUNT = 8;
/** Below this a star count reads as weak proof, so the row shows none. */
const MIN_STARS_SHOWN = 10;

/** Stage one: the shipped projects as an index, the lead row set larger with its live star count. */
export async function ProjectsSection() {
  const projects = getFeaturedProjects(FEATURED_COUNT);
  const repos = projects.map((p) => p.githubRepo).filter((r): r is string => Boolean(r));
  const stars = await safely('project-stars', () => getRepoStars(repos));

  return (
    <li className="stage" aria-labelledby="stage-build">
      <div className="stage__head">
        <h2 id="stage-build">Build it</h2>
        <p className="lead">Shipped and running: the projects, with live GitHub stars.</p>
      </div>
      <div className="stage__body">
        {!stars && <LiveDataNotice what="star counts" />}
        <div className="index">
          {projects.map((project, i) => {
            const starCount = project.githubRepo ? stars?.[project.githubRepo] : undefined;
            const githubUrl = project.githubRepo ? `https://github.com/${project.githubRepo}` : undefined;
            return (
              <article key={project.id} className={i === 0 ? 'index__row index__row--lead' : 'index__row'}>
                <div>
                  <h3>{project.title}</h3>
                  <p className="label">{project.visibility === 'private' ? 'Client' : 'Live'}</p>
                </div>
                <div>
                  <p>{project.purposeShort}</p>
                  {(project.techStack ?? []).length > 0 && (
                    <ul className="tags" aria-label="Stack">
                      {(project.techStack ?? []).slice(0, 3).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  <div className="index__links">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="link">
                        Open project
                      </a>
                    )}
                    {githubUrl && project.url !== githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="link">
                        Repository
                      </a>
                    )}
                    {(project.proofLinks ?? []).map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="link">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="index__meta">
                  {typeof starCount === 'number' && starCount >= MIN_STARS_SHOWN && (
                    <>
                      <span className="index__stars" aria-label={`${starCount} GitHub stars`}>
                        {formatStars(starCount)}
                      </span>
                      <span className="label" aria-hidden="true">
                        stars
                      </span>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </li>
  );
}
