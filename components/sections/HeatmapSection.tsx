import { Heatmap } from '@/components/Heatmap';
import { Eyebrow } from '@/components/Eyebrow';
import { SectionReveal } from '@/components/SectionReveal';
import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getContributionHeatmap } from '@/lib/data/github-heatmap';
import { safely } from '@/lib/safe';

export async function HeatmapSection() {
  const heatmap = await safely('heatmap', () => getContributionHeatmap());

  return (
    <SectionReveal>
      <section aria-label="GitHub contribution activity" className="flex flex-col items-center gap-6">
        <div className="text-center">
          <Eyebrow>Proof of work</Eyebrow>
          <h2 className="mt-2 text-2xl">
            {heatmap
              ? `${heatmap.totalContributions.toLocaleString('en-US')} contributions in the last year`
              : 'GitHub activity'}
          </h2>
        </div>
        {heatmap ? (
          <div className="w-full overflow-x-auto">
            <Heatmap weeks={heatmap.weeks} totalContributions={heatmap.totalContributions} />
          </div>
        ) : (
          <LiveDataNotice what="contribution data" />
        )}
      </section>
    </SectionReveal>
  );
}
