'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/brand', label: 'Brand' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Site-wide header: JL monogram + wordmark left, page nav right. */
export function Header() {
  const pathname = usePathname();
  return (
    <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6 sm:py-6">
      <Link href="/" className="flex min-h-11 min-w-11 items-center gap-3" aria-label="Jeremy Longshore — home">
        <Image src="/jl-monogram.svg" alt="" width={36} height={36} priority />
        <span
          className="hidden text-base font-medium tracking-tight sm:inline"
          style={{ color: 'var(--color-brand)' }}
        >
          Jeremy Longshore
        </span>
      </Link>
      <nav aria-label="Site">
        <ul className="flex items-center gap-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="site-nav-link inline-flex min-h-11 items-center rounded-full px-2 text-sm font-medium transition-colors duration-[var(--duration-micro)] sm:px-3"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
