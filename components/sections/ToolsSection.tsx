import { Eyebrow } from '@/components/Eyebrow';
import { SectionReveal } from '@/components/SectionReveal';
import { ToolsFilter } from '@/components/sections/ToolsFilter';
import { getToolCategories } from '@/lib/data/tools';

/**
 * Curated "what I run" list from data/tools.yml. Unlike the other homepage
 * sections this has no live fetch — the data is a static, build-time YAML
 * load (lib/data/tools.ts), so this stays a synchronous server component.
 */
export function ToolsSection() {
  const categories = getToolCategories();

  return (
    <SectionReveal>
      <section aria-label="Tools" className="flex flex-col gap-8">
        <div className="text-center">
          <Eyebrow>Stuff I run</Eyebrow>
          <h2 className="mt-2 text-2xl">Tools</h2>
          <p className="mx-auto mt-2 max-w-xl text-base" style={{ color: 'var(--color-faint)' }}>
            The stack behind everything on this page — no affiliate links, just what survives daily use.
          </p>
        </div>
        <ToolsFilter categories={categories} />
      </section>
    </SectionReveal>
  );
}
