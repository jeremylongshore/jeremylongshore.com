import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getLatestPosts } from '@/lib/data/writing';
import { getViewCounts } from '@/lib/data/umami-views';
import { safely } from '@/lib/safe';

function postPath(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
}

/** Stage four: the latest field notes from startaitools.com, as dated rows with live view counts. */
export async function WritingSection() {
  const [posts, views] = await Promise.all([
    safely('writing', () => getLatestPosts(6)),
    safely('umami-views', () => getViewCounts()),
  ]);

  return (
    <li className="stage" aria-labelledby="stage-write">
      <div className="stage__head">
        <h2 id="stage-write">Write it down</h2>
        <p className="lead">Build logs and field notes from startaitools.com.</p>
      </div>
      <div className="stage__body">
        {posts ? (
          <div className="rows">
            {posts.map((post) => {
              const path = postPath(post.url);
              const viewCount = views?.get(path) ?? views?.get(`${path}/`);
              return (
                <a key={post.url} href={post.url} className="row">
                  <span className="row__date">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    {typeof viewCount === 'number' && (
                      <>
                        <br />
                        <span aria-label={`${viewCount} views`}>{viewCount.toLocaleString('en-US')} views</span>
                      </>
                    )}
                  </span>
                  <h3>{post.title}</h3>
                  <p className="row__excerpt">{post.excerpt}</p>
                </a>
              );
            })}
          </div>
        ) : (
          <LiveDataNotice what="writing feed" />
        )}
      </div>
    </li>
  );
}
