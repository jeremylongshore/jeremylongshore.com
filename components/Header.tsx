import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/brand', label: 'Brand' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Site-wide header: JL monogram + wordmark left, page nav right. */
export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-3" aria-label="Jeremy Longshore — home">
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
                className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:text-black dark:hover:text-white"
                style={{ color: 'var(--color-body)' }}
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
