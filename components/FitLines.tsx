'use client';

import { useEffect } from 'react';

/**
 * Fits every `.fit` line to its `.fit-block`.
 *
 * Each line ships with a measured `--fit` (in cqi), so it already fills its
 * measure on first paint and without script. This pass only corrects for what
 * that constant cannot know (a fallback face, zoom, a rounding edge): a line
 * wider than its block is scaled down to its measured width, so it is never
 * clipped. Each pass starts again from the designed size, so a line shrunk for a
 * fallback face grows back once the real face arrives, and a line set smaller on
 * purpose stays put.
 *
 * It must not depend on the CSS Font Loading API. When web fonts are blocked
 * (iOS Lockdown Mode, some content blockers) `document.fonts` can be missing;
 * the old `document.fonts.ready.then(...)` then threw before fitting anything,
 * the headline rendered in a wide system face and its last letters were clipped
 * ("I MAKE TEA", 2026-11-25). So it fits on mount, again when fonts settle if
 * that API exists, and on resize/rotation, and no error can escape.
 */
function fitAll() {
  const range = document.createRange();
  document.querySelectorAll<HTMLElement>('.fit-block .fit').forEach((line) => {
    const block = line.closest<HTMLElement>('.fit-block');
    if (!block) return;
    if (!line.dataset.fitBase) {
      const designed = parseFloat(getComputedStyle(line).getPropertyValue('--fit'));
      if (!designed) return;
      line.dataset.fitBase = String(designed);
    }
    const base = parseFloat(line.dataset.fitBase);
    const room = block.clientWidth * 0.995;
    let size = base;
    line.style.setProperty('--fit', String(size));
    // Text width is not exactly linear in font size (glyph advances round per size), so a single
    // proportional step can land a few pixels wide. Re-measure and correct; it converges in 1-3.
    for (let pass = 0; pass < 4; pass += 1) {
      range.selectNodeContents(line);
      const width = range.getBoundingClientRect().width;
      if (!width || width <= room) break;
      size = Math.floor(((size * room) / width) * 100) / 100;
      line.style.setProperty('--fit', String(size));
    }
  });
}

function safeFit() {
  try {
    fitAll();
  } catch {
    // A fitting failure must never take the page down; the designed size stays.
  }
}

export function FitLines() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const run = () => {
      if (cancelled) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(safeFit);
    };
    run();
    try {
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      fonts?.ready?.then(run, () => {});
    } catch {
      // No Font Loading API: the mount and resize passes still fit the lines.
    }
    window.addEventListener('load', run);
    window.addEventListener('resize', run);
    window.addEventListener('orientationchange', run);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('load', run);
      window.removeEventListener('resize', run);
      window.removeEventListener('orientationchange', run);
    };
  }, []);
  return null;
}
