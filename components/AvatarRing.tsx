'use client';

import Image from 'next/image';
import { useId } from 'react';
import './gradient-cycle.css';
import { ACCENT_GRADIENT_VARS, getLayerDelay } from './gradient-cycle';
import { StatusChip } from './StatusChip';

/**
 * Circular avatar wrapper (000-docs/001 §7). Rest state is the metallic
 * silver-to-dark ring (`--gradient-button` + `--metallic-bevel` inset
 * bevels, 4px padding). Hover — or the `active` prop, for a
 * permanently-"on" state — cycles the ring through the shared 12-accent
 * crossfade (§8). An optional warm light-leak overlay screens over the
 * photo, and an optional `chip` pins a StatusChip to the bottom-right.
 */

export interface AvatarRingProps {
  src: string;
  alt: string;
  /** Ring diameter in px (applies to both width and height). */
  size?: number;
  /** Force the accent-cycle ring on regardless of hover. */
  active?: boolean;
  lightLeak?: boolean;
  /** Deterministic per-instance offset input for the accent cycle; falls back to useId(). */
  seed?: string;
  chip?: { label: string; active: boolean };
  className?: string;
}

export function AvatarRing({
  src,
  alt,
  size = 96,
  active = false,
  lightLeak = false,
  seed,
  chip,
  className = '',
}: AvatarRingProps): React.ReactElement {
  const reactId = useId();
  const instanceSeed = seed ?? reactId;

  const overlayVisibility = active
    ? 'jl-cycle-active opacity-100'
    : 'opacity-0 transition-opacity duration-[var(--duration-hover)] ease-out group-hover:opacity-100';

  return (
    <div
      className={`group relative inline-block shrink-0 rounded-full p-1 ${className}`.trim()}
      style={{
        width: size,
        height: size,
        backgroundImage: 'var(--gradient-button)',
        boxShadow: 'var(--metallic-bevel)',
      }}
    >
      {/* Accent-cycle ring: full box, sits behind the opaque photo below. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden rounded-full ${overlayVisibility}`}
      >
        {ACCENT_GRADIENT_VARS.map((varName, index) => (
          <span
            key={varName}
            className="jl-accent-layer"
            style={{ backgroundImage: `var(${varName})`, animationDelay: getLayerDelay(index, instanceSeed) }}
          />
        ))}
      </span>

      <span className="relative block h-full w-full overflow-hidden rounded-full">
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
        {lightLeak ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'var(--light-leak)', mixBlendMode: 'screen' }}
          />
        ) : null}
      </span>

      {chip ? (
        <span className="absolute -bottom-1 -right-1">
          <StatusChip label={chip.label} active={chip.active} />
        </span>
      ) : null}
    </div>
  );
}
