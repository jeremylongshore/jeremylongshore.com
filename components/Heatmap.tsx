/**
 * GitHub-style contribution calendar, rendered as inline SVG in the site's
 * signature bronze/amber ramp (`--color-heat-0`..`--color-heat-4`) instead
 * of GitHub green — the one deliberate visual risk of the identity spec
 * (000-docs/003 §3.2). Pure server component: no hooks, no client JS.
 * Per-cell detail is carried by native <title> tooltips; the grid itself is
 * `role="img"` with an `aria-label` summarizing the total.
 */

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface HeatmapProps {
  /** Outer index = week (0..52), inner index = day-of-week (0 = Sun .. 6 = Sat). */
  weeks: HeatmapDay[][];
  totalContributions: number;
  className?: string;
}

const CELL_SIZE = 12;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const DAY_LABEL_WIDTH = 28;
const MONTH_LABEL_HEIGHT = 16;
const GRID_ROWS = 7;

/** Row index -> label, for the left-hand Mon/Wed/Fri gutter (GitHub's own convention). */
const DAY_LABELS: Partial<Record<number, string>> = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Extracts the month index (0-11) from an ISO `YYYY-MM-DD` string without a Date object. */
function monthOf(dateStr: string): number {
  return Number(dateStr.slice(5, 7)) - 1;
}

export function Heatmap({ weeks, totalContributions, className = '' }: HeatmapProps): React.ReactElement {
  const width = DAY_LABEL_WIDTH + weeks.length * CELL_STEP;
  const height = MONTH_LABEL_HEIGHT + GRID_ROWS * CELL_STEP;

  // Label a column only when its month differs from the last-labeled one and
  // at least 2 columns have passed, so adjacent labels never collide.
  let lastLabeledMonth = -1;
  let lastLabeledWeek = -Infinity;
  const monthLabels: { week: number; label: string }[] = [];
  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];
    if (!firstDay) return;
    const month = monthOf(firstDay.date);
    if (month !== lastLabeledMonth && weekIndex - lastLabeledWeek >= 2) {
      monthLabels.push({ week: weekIndex, label: MONTH_NAMES[month] ?? '' });
      lastLabeledMonth = month;
      lastLabeledWeek = weekIndex;
    }
  });

  return (
    <div className={className}>
      <svg
        role="img"
        aria-label={`${totalContributions} contributions in the last year`}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="max-w-full font-sans"
      >
        {monthLabels.map(({ week, label }) => (
          <text
            key={`month-${week}`}
            x={DAY_LABEL_WIDTH + week * CELL_STEP}
            y={MONTH_LABEL_HEIGHT - 6}
            className="text-[10px]"
            style={{ fill: 'var(--color-faint)' }}
          >
            {label}
          </text>
        ))}

        {Object.entries(DAY_LABELS).map(([row, label]) => (
          <text
            key={`day-${row}`}
            x={0}
            y={MONTH_LABEL_HEIGHT + Number(row) * CELL_STEP + CELL_SIZE - 2}
            className="text-[10px]"
            style={{ fill: 'var(--color-faint)' }}
          >
            {label}
          </text>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <rect
              key={day.date}
              x={DAY_LABEL_WIDTH + weekIndex * CELL_STEP}
              y={MONTH_LABEL_HEIGHT + dayIndex * CELL_STEP}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={2}
              ry={2}
              style={{ fill: `var(--color-heat-${day.level})` }}
            >
              <title>{`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}</title>
            </rect>
          )),
        )}
      </svg>

      <div className="mt-2 flex items-center justify-end gap-1 text-xs" style={{ color: 'var(--color-faint)' }}>
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className="h-3 w-3 rounded-sm"
            style={{ background: `var(--color-heat-${level})` }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
