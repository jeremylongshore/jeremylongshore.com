import Image from 'next/image';

/**
 * Image in the silver-frame treatment (000-docs/001 §7): an 8px-padded
 * silver-gradient container, an inner 1px border on the photo, an optional
 * warm light-leak screen overlay, and an optional 1.05x hover zoom. Hover
 * zoom is pure CSS (`group-hover:scale-105`), so this stays server-renderable.
 */

export interface LightLeakImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  lightLeak?: boolean;
  zoomOnHover?: boolean;
  className?: string;
}

export function LightLeakImage({
  src,
  alt,
  width,
  height,
  lightLeak = false,
  zoomOnHover = false,
  className = '',
}: LightLeakImageProps): React.ReactElement {
  return (
    <div
      className={`group inline-block rounded-2xl p-2 ${className}`.trim()}
      style={{ backgroundImage: 'var(--gradient-silver)' }}
    >
      <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-well-border)' }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`h-auto w-full object-cover transition-transform duration-[var(--duration-hover)] ease-out ${
            zoomOnHover ? 'group-hover:scale-105' : ''
          }`}
        />
        {lightLeak ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'var(--light-leak)', mixBlendMode: 'screen' }}
          />
        ) : null}
      </div>
    </div>
  );
}
