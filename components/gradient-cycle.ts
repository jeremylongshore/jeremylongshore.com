/**
 * Shared math for the 12-accent gradient cycle used by GradientCard,
 * PillButton, and AvatarRing (000-docs/001 §8, §3). Each accent gradient
 * holds a 2s "on" window inside a shared 24s loop; a per-instance hash
 * offset keeps multiple components on the page from cycling in lockstep.
 */

/** CSS variable names for the 12 accent gradients, in spec order (§3). */
export const ACCENT_GRADIENT_VARS = [
  '--gradient-sunset',
  '--gradient-emerald',
  '--gradient-twilight',
  '--gradient-neon',
  '--gradient-coral',
  '--gradient-ocean',
  '--gradient-citrus',
  '--gradient-aurora',
  '--gradient-amber',
  '--gradient-peach',
  '--gradient-cosmos',
  '--gradient-prism',
] as const;

/** Seconds each accent gradient stays fully visible before crossfading out. */
export const ACCENT_STEP_SECONDS = 2;

/** Full loop length: 12 accents x 2s each = 24s (§8). */
export const ACCENT_LOOP_SECONDS = ACCENT_GRADIENT_VARS.length * ACCENT_STEP_SECONDS;

/**
 * Deterministic 0..1 hash of a string (FNV-1a). Used only to derive a
 * per-instance animation-delay offset — not for anything security-sensitive.
 */
export function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) / 0xffffffff;
}

/** Per-instance offset (seconds) into the shared 24s accent loop. */
export function getCycleOffsetSeconds(seed: string): number {
  return hashSeed(seed) * ACCENT_LOOP_SECONDS;
}

/**
 * `animation-delay` (as a CSS length string) for accent layer `index` of a
 * component keyed by `seed`. Layers are 2s apart intrinsically; the seed
 * offset shifts the whole stack together so instances never sync.
 */
export function getLayerDelay(index: number, seed: string): string {
  return `${index * ACCENT_STEP_SECONDS + getCycleOffsetSeconds(seed)}s`;
}
