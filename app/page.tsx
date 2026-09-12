import { Hero } from '@/components/sections/Hero';
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

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pt-12 sm:gap-24 md:pt-28">
      <Hero />
      <HeatmapSection />
      <ProjectsSection />
      <ContributionsSection />
      <WritingSection />
      <ToolsSection />
      <Footer />
    </main>
  );
}
