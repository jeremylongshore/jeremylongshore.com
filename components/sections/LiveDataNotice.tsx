/**
 * Visible degraded-state marker for a section whose live-data fetch failed.
 * The invariant is "never silently empty": if data is down, say so.
 */
export function LiveDataNotice({ what }: { what: string }) {
  return (
    <p
      className="rounded-full border px-4 py-2 text-sm"
      style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-faint)' }}
    >
      Live {what} is refreshing — check back shortly.
    </p>
  );
}
