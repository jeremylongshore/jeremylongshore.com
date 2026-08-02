'use client';

import { useId, useRef, type ReactNode, type RefObject } from 'react';
import './gradient-cycle.css';
import { ACCENT_GRADIENT_VARS, getLayerDelay } from './gradient-cycle';
import { CursorShimmer, useCursorShimmer } from './CursorShimmer';

/**
 * The reference system's 3-layer card sandwich (000-docs/001 §6): a resting
 * silver frame, an accent-gradient overlay that crossfades through all 12
 * accents on hover (§8), and a white content well. The whole card lifts
 * `-translate-y-1` on hover (transform only — no layout shift). An optional
 * cursor shimmer can be embedded in the well via `shimmer`.
 */

export type GradientCardVariant = 'default' | 'angled' | 'reverse';

export interface GradientCardProps {
  children: ReactNode;
  /** Outer silver-frame treatment (000-docs/001 §3: default/angled/reverse). */
  variant?: GradientCardVariant;
  /** Renders the whole card as an anchor when set. */
  href?: string;
  /** Embed the cursor-shimmer highlight inside the content well. */
  shimmer?: boolean;
  /** Deterministic per-instance offset input for the accent cycle; falls back to useId(). */
  seed?: string;
  className?: string;
}

const SILVER_BACKGROUND: Record<GradientCardVariant, string> = {
  default: 'var(--gradient-silver)',
  angled: 'var(--gradient-silver-angled)',
  reverse: 'var(--gradient-silver-reverse)',
};

export function GradientCard({
  children,
  variant = 'default',
  href,
  shimmer = false,
  seed,
  className = '',
}: GradientCardProps): React.ReactElement {
  const reactId = useId();
  const instanceSeed = seed ?? reactId;
  const containerRef = useRef<HTMLElement>(null);

  useCursorShimmer(containerRef);

  const wrapperClassName =
    `group relative block overflow-hidden rounded-3xl p-3 transition-transform duration-[var(--duration-hover)] ease-out hover:-translate-y-1 ${className}`.trim();
  const wrapperStyle: React.CSSProperties = { backgroundImage: SILVER_BACKGROUND[variant] };

  const content = (
    <>
      {/* Layer 2: accent-gradient overlay, full box, crossfades in on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-0 transition-opacity duration-[var(--duration-hover)] ease-out group-hover:opacity-100"
      >
        {ACCENT_GRADIENT_VARS.map((varName, index) => (
          <span
            key={varName}
            className="jl-accent-layer"
            style={{ backgroundImage: `var(${varName})`, animationDelay: getLayerDelay(index, instanceSeed) }}
          />
        ))}
      </span>

      {/* Layer 3: white content well — covers the center, leaves the p-3 frame visible. */}
      <span className="relative block overflow-hidden rounded-xl border bg-white" style={{ borderColor: 'var(--color-well-border)' }}>
        {children}
        {shimmer ? <CursorShimmer /> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={containerRef as RefObject<HTMLAnchorElement>}
        href={href}
        className={wrapperClassName}
        style={wrapperStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <div ref={containerRef as RefObject<HTMLDivElement>} className={wrapperClassName} style={wrapperStyle}>
      {content}
    </div>
  );
}
