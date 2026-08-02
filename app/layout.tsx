import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jeremylongshore.com'),
  title: 'Jeremy Longshore — I Make Teams AI-Native',
  description:
    'I build AI systems that ship and train teams to work with coding agents — Claude, Codex, Gemini, whatever moves the needle. 20+ years ops, self-taught dev, 60+ repos with real GitHub stars.',
  openGraph: {
    title: 'Jeremy Longshore — I Make Teams AI-Native',
    description:
      'AI systems that ship. Claude Code Plugins creator. Marine. 20 years ops → self-taught dev → AI architect.',
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
        {children}
        {umamiSrc && umamiWebsiteId && (
          <script defer src={umamiSrc} data-website-id={umamiWebsiteId} />
        )}
      </body>
    </html>
  );
}
