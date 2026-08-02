'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Fades + rises children 2rem on first scroll into view (IntersectionObserver,
 * threshold 0.15, fires once — 000-docs/001 §8). Renders content visible
 * immediately when `prefers-reduced-motion` is set or `IntersectionObserver`
 * is unavailable, so nothing ever depends on JS to become visible.
 */

export interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

export function SectionReveal({ children, className = '' }: SectionRevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[var(--duration-reveal)] ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
