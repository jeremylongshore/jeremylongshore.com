import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getContributions } from '@/lib/data/github-contributions';
import { safely } from '@/lib/safe';

/**
 * Stage two: proof upstream. The merged-PR count fitted to the measure, the
 * contribution heatmap (passed in as children), then the highlights as a table.
 */
export async function ContributionsSection({ children }: { children?: React.ReactNode }) {
  const contributions = await safely('contributions', () => getContributions());

  return (
    <li className="stage" aria-labelledby="stage-prove">
      <div className="stage__head">
        <h2 id="stage-prove">Prove it upstream</h2>
        <p className="lead">Upstream, not just downstream: work accepted by outside maintainers.</p>
      </div>
      <div className="stage__body">
        {contributions ? (
          <div className="proof__figure">
            <p className="display fit-block" aria-label={`${contributions.totalPrs} merged pull requests`}>
              <span className="fit" style={{ '--fit': 35 } as React.CSSProperties}>
                {contributions.totalPrs} merged PRs
              </span>
            </p>
            <div className="proof__note">
              <p className="lead">
                Across {contributions.totalRepos} external repos.
              </p>
              <p className="muted">
                Authored by Jeremy and accepted by outside maintainers. Contribution does not imply employment,
                partnership, or client status.
              </p>
            </div>
          </div>
        ) : (
          <LiveDataNotice what="contribution data" />
        )}

        {children}

        {contributions && (
          <>
            <table className="table">
              <caption className="visually-hidden">Merged pull requests by project</caption>
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">What was merged</th>
                  <th scope="col">Stack</th>
                  <th scope="col">Merged PRs</th>
                </tr>
              </thead>
              <tbody>
                {contributions.highlights.map((c) => (
                  <tr key={c.repo}>
                    <td>
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.label}
                      </a>
                    </td>
                    <td className="desc">{c.description}</td>
                    <td className="desc muted">{c.tags.slice(0, 3).join(', ')}</td>
                    <td className="num">{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contributions.others.length > 0 && (
              <p className="also">
                Also merged in{' '}
                {contributions.others.map((o, i) => (
                  <span key={o.repo}>
                    {i > 0 && (i === contributions.others.length - 1 ? ' and ' : ', ')}
                    <a href={o.url} target="_blank" rel="noopener noreferrer" className="link">
                      {o.name}
                    </a>
                  </span>
                ))}
                .
              </p>
            )}
          </>
        )}
      </div>
    </li>
  );
}
