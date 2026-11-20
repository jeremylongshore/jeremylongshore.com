import { ToolsFilter } from '@/components/sections/ToolsFilter';
import { getToolCategories } from '@/lib/data/tools';

/**
 * Stage three: the curated "what I run" list from data/tools.yml. No live
 * fetch: a static, build-time YAML load (lib/data/tools.ts), so this stays a
 * synchronous server component. The filter is a switcher over one list.
 */
export function ToolsSection() {
  const categories = getToolCategories();

  return (
    <li className="stage" aria-labelledby="stage-run">
      <div className="stage__head">
        <h2 id="stage-run">Run it daily</h2>
        <p className="lead">The stack behind everything on this page. No affiliate links, just what survives daily use.</p>
      </div>
      <div className="stage__body">
        <ToolsFilter categories={categories} />
      </div>
    </li>
  );
}
