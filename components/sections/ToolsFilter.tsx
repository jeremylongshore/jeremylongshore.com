'use client';

import { useMemo, useState } from 'react';
import type { ToolCategory } from '@/lib/data/tools';

/**
 * Client-side category filter + list for the Tools section. Deliberately
 * quieter than the project cards (000-docs/001 §6 cards are a 3-layer
 * gradient sandwich) — this is a typography-led row list with hairline
 * dividers, no gradient overlays. Filtering is local state only, no URL sync.
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter tools by category">
        {filters.map((name) => {
          const isActive = name === active;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(name)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
              style={
                isActive
                  ? { backgroundImage: 'var(--gradient-button)', color: '#ffffff' }
                  : { color: 'var(--color-body)', border: '1px solid var(--color-hairline)' }
              }
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-x-8 sm:grid-cols-2">
        {visibleTools.map((tool) => (
          <a
            key={tool.url}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline justify-between gap-4 border-t py-3"
            style={{ borderColor: 'var(--color-hairline)' }}
          >
            <span>
              <span
                className="font-medium transition-colors duration-200 group-hover:text-black dark:group-hover:text-white"
                style={{ color: 'var(--color-brand)' }}
              >
                {tool.title}
              </span>
              <span className="ml-2 text-sm" style={{ color: 'var(--color-faint)' }}>
                {tool.note}
              </span>
            </span>
            <span className="shrink-0 font-mono text-xs" style={{ color: 'var(--color-eyebrow)' }}>
              {hostname(tool.url)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
