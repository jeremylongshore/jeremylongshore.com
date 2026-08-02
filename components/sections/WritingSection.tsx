import { GradientCard } from '@/components/GradientCard';
import { Eyebrow } from '@/components/Eyebrow';
import { SectionReveal } from '@/components/SectionReveal';
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

export async function WritingSection() {
  const [posts, views] = await Promise.all([
    safely('writing', () => getLatestPosts(6)),
    safely('umami-views', () => getViewCounts()),
  ]);

  return (
    <SectionReveal>
      <section aria-label="Writing" className="flex flex-col gap-8">
        <div className="text-center">
          <Eyebrow>Work diary</Eyebrow>
          <h2 className="mt-2 text-2xl">Writing</h2>
          <p className="mt-2 text-base" style={{ color: 'var(--color-faint)' }}>
            Build logs and field notes from startaitools.com
          </p>
        </div>
        {posts ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const path = postPath(post.url);
              const viewCount = views?.get(path) ?? views?.get(`${path}/`);
              return (
                <GradientCard key={post.url} seed={post.url} href={post.url}>
                  <div className="flex h-full flex-col p-5">
                    <h3 className="text-lg leading-snug" style={{ color: 'var(--color-brand)' }}>
                      {post.title}
                    </h3>
                    <p className="mt-2 grow text-sm">{post.excerpt}</p>
                    <div className="mt-3 flex items-center gap-3 font-mono text-xs" style={{ color: 'var(--color-faint)' }}>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                      {typeof viewCount === 'number' && (
                        <span aria-label={`${viewCount} views`}>{viewCount.toLocaleString('en-US')} views</span>
                      )}
                    </div>
                  </div>
                </GradientCard>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center">
            <LiveDataNotice what="writing feed" />
          </div>
        )}
      </section>
    </SectionReveal>
  );
}
