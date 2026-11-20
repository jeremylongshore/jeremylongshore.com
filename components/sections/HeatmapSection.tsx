import { Heatmap } from '@/components/Heatmap';
import { LiveDataNotice } from '@/components/sections/LiveDataNotice';
import { getContributionHeatmap } from '@/lib/data/github-heatmap';
import { safely } from '@/lib/safe';

/** The year of GitHub activity, set inside stage two under a hair rule. */
export async function HeatmapSection() {
  const heatmap = await safely('heatmap', () => getContributionHeatmap());

  return (
    <section aria-label="GitHub contribution activity" className="proof__heat">
      <h3>
        {heatmap
          ? `${heatmap.totalContributions.toLocaleString('en-US')} contributions in the last year`
          : 'GitHub activity'}
      </h3>
      {heatmap ? (
        <div className="heat-scroll">
          <Heatmap weeks={heatmap.weeks} totalContributions={heatmap.totalContributions} />
        </div>
      ) : (
        <LiveDataNotice what="contribution data" />
      )}
    </section>
  );
}
