import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

// UX Decision: Outfit is a modern geometric sans-serif that feels 
// friendly yet professional — perfect for a consumer crypto app
const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Coin Flip | Base Mini App',
  description: 'Flip a coin onchain! Free daily flip on Base.',
  openGraph: {
    title: 'Coin Flip | Base Mini App',
    description: 'Flip a coin onchain! Free daily flip on Base.',
    images: ['/og-image.png'],
  },
};

// Mobile viewport optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} text-white min-h-screen min-h-dvh antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
