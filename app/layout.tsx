import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sony WH-1000XM6 | Silence, perfected.',
  description:
    'Flagship wireless noise cancelling, re-engineered for a world that never stops. Experience studio-grade clarity, adaptive noise cancellation, and unprecedented comfort.',
  keywords: [
    'Sony',
    'WH-1000XM6',
    'Noise Cancelling',
    'Headphones',
    'Hi-Res Audio',
    'Flagship Headphones',
    'Audiophile',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#050505] text-white">
      <body className="bg-[#050505] text-white antialiased min-h-screen selection:bg-accent-blue/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
