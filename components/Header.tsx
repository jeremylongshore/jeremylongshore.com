'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/brand', label: 'Brand' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Site-wide bar: the wordmark at one edge, the page links and the booking action at the other, over a five-point rule. */
export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-bar">
      <div className="container site-bar__inner">
        <Link href="/" className="wordmark" aria-label="Jeremy Longshore, home">
          Jeremy Longshore
        </Link>
        <nav aria-label="Site" className="site-nav">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={site.bookingUrl} className="btn" target="_blank" rel="noopener noreferrer">
            Book a call
          </a>
        </nav>
      </div>
    </header>
  );
}
