/**
 * Frosted status pill: `bg-white/80` + `backdrop-blur`, an 8px status dot,
 * and a 12px medium label (000-docs/001 §7). Pure server component — no
 * interactivity, no hooks.
 */

export interface StatusChipProps {
  /** Text next to the dot, e.g. "Building". */
  label: string;
  /** true = --color-status-active (green); false = --color-status-idle (gray). */
  active: boolean;
  className?: string;
}

export function StatusChip({ label, active, className = '' }: StatusChipProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur ${className}`.trim()}
      style={{ background: 'var(--color-chip-bg)', color: 'var(--color-brand)' }}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full"
        style={{ background: active ? 'var(--color-status-active)' : 'var(--color-status-idle)' }}
      />
      {label}
    </span>
  );
}
