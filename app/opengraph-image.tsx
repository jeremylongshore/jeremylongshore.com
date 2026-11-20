import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Jeremy Longshore: I make teams AI-native';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/*
 * OG card in the site's printed-bill system. next/og (satori) cannot read CSS
 * custom properties or oklch, so the three tokens from app/tokens.css are
 * mirrored here as sRGB hex: paper oklch(92% 0.028 88), ink oklch(18% 0.01 50),
 * vermilion oklch(53% 0.19 33).
 */
const PAPER = '#ebe3cf';
const INK = '#1b1513';
const VERMILION = '#c0361c';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          padding: 64,
          fontFamily: 'sans-serif',
          borderTop: `16px solid ${INK}`,
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: INK, letterSpacing: '0.02em' }}>
          JEREMY LONGSHORE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, color: INK, lineHeight: 0.95 }}>
            I MAKE TEAMS
          </div>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, color: VERMILION, lineHeight: 0.95 }}>
            AI-NATIVE.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `5px solid ${INK}`,
            paddingTop: 24,
            fontSize: 30,
            color: INK,
          }}
        >
          <div style={{ display: 'flex' }}>AI systems that ship. I build what I sell.</div>
          <div style={{ display: 'flex' }}>jeremylongshore.com</div>
        </div>
      </div>
    ),
    size
  );
}
