'use client';

import Script from 'next/script';

/**
 * Ko-fi floating support button.
 *
 * Third-party, and the only one on the site besides the Umami beacon. It is
 * loaded with `lazyOnload` so it waits for the browser to go idle rather than
 * competing with the page's own ISR-fetched content.
 *
 * The overlay script exposes `kofiWidgetOverlay` only after it has run, so the
 * draw call lives in `onLoad` rather than in a second inline script — an inline
 * script cannot be deferred, so it would execute during parse and reference the
 * global before it exists.
 *
 * On the colour: the button carries white label text, so its background needs
 * 4.5:1 against white. `--color-accent` (#d97706) is 3.19:1 and fails; the
 * darker `--color-accent-strong` (#b45309) is 5.02:1 and passes. Same rule the
 * rest of the design system follows — the light accent draws, the dark one
 * writes. Ko-fi's own suggested colours (#00b9fe at 2.24:1, #72a4f2 at 2.53:1)
 * are both well under the threshold.
 *
 * The value is hardcoded rather than read from the token layer because this
 * string is passed into a third-party script at runtime, not applied as CSS —
 * a `var(--color-accent-strong)` would reach Ko-fi as a literal and render
 * transparent. Keep it in step with globals.css by hand.
 */
const KOFI_USERNAME = 'jeremylongshore';
const BUTTON_BACKGROUND = '#b45309'; // = --color-accent-strong
const BUTTON_TEXT = '#ffffff';

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: Record<string, string>) => void;
    };
  }
}

export function KofiWidget() {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="lazyOnload"
      onLoad={() => {
        window.kofiWidgetOverlay?.draw(KOFI_USERNAME, {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': BUTTON_BACKGROUND,
          'floating-chat.donateButton.text-color': BUTTON_TEXT,
        });
      }}
    />
  );
}
