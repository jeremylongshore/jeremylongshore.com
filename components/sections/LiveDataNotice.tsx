/**
 * Visible degraded-state marker for a section whose live-data fetch failed.
 * The invariant is "never silently empty": if data is down, say so.
 */
export function LiveDataNotice({ what }: { what: string }) {
  return <p className="notice">Live {what} is refreshing. Check back shortly.</p>;
}
