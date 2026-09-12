'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Progressive enhancement: content is visible in server HTML. Animate once
 * on entry, unless reduced motion is requested. Long sections need only
 * intersect the viewport; they never need 15% of their height on screen.
 */

export interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

export function SectionReveal({ children, className = '' }: SectionRevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    let animation: Animation | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              const styles = getComputedStyle(node);
              animation = node.animate(
                [{ opacity: 0.7, transform: 'translateY(1rem)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: parseFloat(styles.getPropertyValue('--duration-reveal')) || 700, easing: styles.getPropertyValue('--ease-soft').trim() || 'ease-out' },
              );
            }
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => { observer.disconnect(); animation?.cancel(); };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}
