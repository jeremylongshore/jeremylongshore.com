'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Cursor shimmer: a soft white radial highlight that tracks the pointer
 * across a card surface (000-docs/001 §8). `useCursorShimmer` never causes a
 * re-render — it writes `--shimmer-x` / `--shimmer-y` custom properties
 * straight onto the tracked element via a ref, rAF-throttled. `CursorShimmer`
 * is the paired visual overlay: it reads those inherited custom properties
 * and stays invisible until its `group` ancestor is hovered.
 */

/**
 * Attach a pointermove tracker to `containerRef.current`. Updates
 * `--shimmer-x` / `--shimmer-y` (percentages within the element's box) on
 * that same element — a plain DOM write, throttled to one update per animation
 * frame, no React state involved.
 */
export function useCursorShimmer(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let frame = 0;

    const handlePointerMove = (event: PointerEvent): void => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty('--shimmer-x', `${x}%`);
        node.style.setProperty('--shimmer-y', `${y}%`);
      });
    };

    node.addEventListener('pointermove', handlePointerMove);
    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [containerRef]);
}

/**
 * The shimmer's visual overlay. Render inside a `group`-classed ancestor
 * that also calls `useCursorShimmer` on its own ref — this element only
 * paints the radial highlight and reveals it on `group-hover`.
 */
export function CursorShimmer(): React.ReactElement {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-[var(--duration-hover)] ease-out group-hover:opacity-100"
      style={{
        background:
          'radial-gradient(600px circle at var(--shimmer-x, 50%) var(--shimmer-y, 50%), rgba(255, 255, 255, 0.7), transparent 70%)',
      }}
    />
  );
}
