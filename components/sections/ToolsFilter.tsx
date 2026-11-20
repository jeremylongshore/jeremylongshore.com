'use client';

import { useMemo, useState } from 'react';
import type { ToolCategory } from '@/lib/data/tools';

/**
 * Client-side category switcher + list for the Tools stage: a typography-led
 * row list under ink rules. Filtering is local state only, no URL sync; every
 * tool renders without script, with "All" selected.
 */

export interface ToolsFilterProps {
  categories: ToolCategory[];
}

interface FlatTool {
  category: string;
  title: string;
  url: string;
  note: string;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const ALL = 'All';

export function ToolsFilter({ categories }: ToolsFilterProps): React.ReactElement {
  const [active, setActive] = useState<string>(ALL);

  const flatTools: FlatTool[] = useMemo(
    () =>
      categories.flatMap((category) =>
        category.tools.map((tool) => ({ category: category.name, ...tool })),
      ),
    [categories],
  );

  const filters = useMemo(() => [ALL, ...categories.map((c) => c.name)], [categories]);
  const visibleTools = active === ALL ? flatTools : flatTools.filter((tool) => tool.category === active);

  return (
    <div>
      <div className="switch" role="group" aria-label="Filter tools by category">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === active}
            onClick={() => setActive(name)}
            className="chip"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="tool-grid">
        {visibleTools.map((tool) => (
          <a key={tool.url} href={tool.url} target="_blank" rel="noopener noreferrer" className="tool">
            <span>
              <span className="tool__name">{tool.title}</span> <span className="tool__note">{tool.note}</span>
            </span>
            <span className="tool__host">{hostname(tool.url)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
