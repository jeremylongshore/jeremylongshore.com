import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Jeremy Longshore — I Make Teams AI-Native';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG card: neutral base, silver frame, amber accent bar — the design
 * system's two-metal story in a static 1200x630.
 */
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
          background: '#ffffff',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 180,
            height: 10,
            borderRadius: 9999,
            background: 'linear-gradient(to right, #f59e0b, #d97706, #b45309)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 500, color: '#4d4d4d', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            I make teams AI-native.
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 34, color: 'rgba(77,77,77,0.8)' }}>
            Jeremy Longshore — AI systems that ship. I build what I sell.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 28, color: 'rgba(77,77,77,0.6)' }}>jeremylongshore.com</div>
          <div
            style={{
              display: 'flex',
              width: 64,
              height: 64,
              borderRadius: 9999,
              background: 'linear-gradient(to bottom, #fcfcfc, #b9b9b9)',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 500,
              color: '#4d4d4d',
            }}
          >
            JL
          </div>
        </div>
      </div>
    ),
    size
  );
}
