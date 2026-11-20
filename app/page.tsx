import { Hero, Credentials } from '@/components/sections/Hero';
import { HeatmapSection } from '@/components/sections/HeatmapSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContributionsSection } from '@/components/sections/ContributionsSection';
import { WritingSection } from '@/components/sections/WritingSection';
import { ToolsSection } from '@/components/sections/ToolsSection';
import { Footer } from '@/components/sections/Footer';

/*
 * Page-level ISR: hourly regeneration covers every section, including the
 * GraphQL heatmap fetch (a POST, which Next's per-fetch cache won't
 * memoize). Per-fetch revalidate values give GET fetchers finer freshness.
 */
export const revalidate = 3600;

/*
 * The page argues in four numbered stages, the tagline's own verbs:
 * build it (projects), prove it (upstream contributions and the heatmap),
 * run it (the tools), write it down (field notes).
 */
export default function Home() {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Credentials />
        <ol className="stages container" aria-label="The work, in four stages">
          <ProjectsSection />
          <ContributionsSection>
            <HeatmapSection />
          </ContributionsSection>
          <ToolsSection />
          <WritingSection />
        </ol>
      </main>
      <Footer />
    </>
  );
}
