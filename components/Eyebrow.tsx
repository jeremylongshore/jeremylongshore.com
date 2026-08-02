import type { ReactNode } from 'react';

/**
 * Section eyebrow label: 14px medium, uppercase, wide tracking, low-emphasis
 * eyebrow gray (000-docs/001 §4). Pure server component.
 */

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps): React.ReactElement {
  return (
    <p
      className={`text-sm font-medium uppercase tracking-wide ${className}`.trim()}
      style={{ color: 'var(--color-eyebrow)' }}
    >
      {children}
    </p>
  );
}
