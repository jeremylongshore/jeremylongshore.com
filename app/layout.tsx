import type { Metadata } from 'next';
import { Six_Caps, Bevan, Archivo_Narrow } from 'next/font/google';
import { Header } from '@/components/Header';
import { KofiWidget } from '@/components/KofiWidget';
import './globals.css';

// Broadside's three faces, self-hosted at build time by next/font (no runtime Google request).
const sixCaps = Six_Caps({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-six-caps' });
const bevan = Bevan({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-bevan' });
const archivoNarrow = Archivo_Narrow({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo-narrow',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jeremylongshore.com'),
  title: 'Jeremy Longshore: I make teams AI-native',
  description:
    'I build agentic systems that ship and help teams operate them. Public proof includes about 56K Skills.sh installs and 45 merged contributions across 17 external repositories.',
  openGraph: {
    title: 'Jeremy Longshore: I make teams AI-native',
    description:
      'Agentic systems that ship. Tons of Skills creator. Marine. Twenty years in operations, then a self-taught developer, now an AI architect.',
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
    <html lang="en" className={`${sixCaps.variable} ${bevan.variable} ${archivoNarrow.variable}`}>
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
