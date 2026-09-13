import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Header } from '@/components/Header';
import { KofiWidget } from '@/components/KofiWidget';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jeremylongshore.com'),
  title: 'Jeremy Longshore — I Make Teams AI-Native',
  description:
    'I build agentic systems that ship and help teams operate them. Public proof includes 57.4K Skills.sh installs and 44 merged contributions across 17 external repositories.',
  openGraph: {
    title: 'Jeremy Longshore — I Make Teams AI-Native',
    description:
      'Agentic systems that ship. Tons of Skills creator. Marine. 20 years ops → self-taught dev → AI architect.',
    url: 'https://jeremylongshore.com',
    siteName: 'Jeremy Longshore',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Umami beacon for this site itself — emitted only when configured
  // (NEXT_PUBLIC_UMAMI_SRC + NEXT_PUBLIC_UMAMI_WEBSITE_ID on the VPS).
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        {children}
        {umamiSrc && umamiWebsiteId && (
          <script defer src={umamiSrc} data-website-id={umamiWebsiteId} />
        )}
        <KofiWidget />
      </body>
    </html>
  );
}
