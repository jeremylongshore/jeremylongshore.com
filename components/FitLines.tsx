'use client';

import { useEffect } from 'react';

/**
 * Fits every `.fit` line to its `.fit-block` once the real faces have loaded.
 *
 * Each line ships with a measured `--fit` (in cqi), so it already fills its
 * measure on first paint and without script. This pass only corrects for what
 * that constant cannot know (a fallback face during swap, zoom, a rounding
 * edge): a line wider than its block is scaled down to its measured width, so it
 * is never clipped. It only shrinks, so a line set smaller on purpose stays put. Widths scale with cqi, so one pass after the
 * fonts settle holds at every viewport.
 */
function fitAll() {
  const range = document.createRange();
  document.querySelectorAll<HTMLElement>('.fit-block .fit').forEach((line) => {
    const block = line.closest<HTMLElement>('.fit-block');
    if (!block) return;
    const current = parseFloat(getComputedStyle(line).getPropertyValue('--fit'));
    range.selectNodeContents(line);
    const width = range.getBoundingClientRect().width;
    if (!current || !width) return;
    const next = (current * block.clientWidth * 0.995) / width;
    if (next < current * 0.995) {
      line.style.setProperty('--fit', next.toFixed(2));
    }
  });
}

export function FitLines() {
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) fitAll();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
