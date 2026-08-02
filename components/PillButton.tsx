'use client';

import { useId, type ReactNode } from 'react';
import './gradient-cycle.css';
import { ACCENT_GRADIENT_VARS, getLayerDelay } from './gradient-cycle';

/**
 * Fully-rounded pill button/link (000-docs/001 §8). `primary` fills with the
 * silver-to-dark button gradient; `cta` fills with Sunset. Both carry a
 * signature ring: the shared 12-accent crossfade (§8) wrapped in a
 * continuously spinning group (4s linear), subtle at rest and brighter on
 * hover. Active press state scales to 0.97; all transitions are 200ms micro.
 *
 * Deviation note: the spec calls this a "conic accent gradient ring." A true
 * CSS `conic-gradient()` needs literal color stops, which would mean
 * re-hardcoding hex values that already live in the `--gradient-*` tokens —
 * against this component's no-hardcoded-hex rule. Instead the ring rotates
 * the same token-driven 12-accent stack used by GradientCard/AvatarRing as a
 * single spinning unit, which reads as the same "orbiting accent ring" while
 * keeping every color sourced from a CSS variable.
 */

export type PillButtonVariant = 'primary' | 'cta';

export interface PillButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: PillButtonVariant;
  /** Deterministic per-instance offset input for the accent cycle; falls back to useId(). */
  seed?: string;
  className?: string;
  type?: 'button' | 'submit';
  /** Opens an `href` link in a new tab with `rel="noopener noreferrer"`. No-op without `href`. */
  external?: boolean;
}

const FILL_GRADIENT: Record<PillButtonVariant, string> = {
  primary: 'var(--gradient-button)',
  cta: 'var(--gradient-sunset)',
};

export function PillButton({
  children,
  href,
  onClick,
  variant = 'primary',
  seed,
  className = '',
  type = 'button',
  external = false,
}: PillButtonProps): React.ReactElement {
  const reactId = useId();
  const instanceSeed = seed ?? reactId;

  const wrapperClassName = `group relative inline-flex rounded-full ${className}`.trim();

  const ring = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[2px] overflow-hidden rounded-full opacity-40 transition-opacity duration-[var(--duration-hover)] ease-out group-hover:opacity-90"
    >
      <span className="jl-conic-spin absolute inset-0">
        {ACCENT_GRADIENT_VARS.map((varName, index) => (
          <span
            key={varName}
            className="jl-accent-layer"
            style={{ backgroundImage: `var(${varName})`, animationDelay: getLayerDelay(index, instanceSeed) }}
          />
        ))}
      </span>
    </span>
  );

  const fill = (
    <span
      className="relative z-10 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white transition-transform duration-[var(--duration-micro)] ease-out group-active:scale-[0.97]"
      style={{ backgroundImage: FILL_GRADIENT[variant] }}
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className={wrapperClassName}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {ring}
        {fill}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={wrapperClassName}>
      {ring}
      {fill}
    </button>
  );
}
