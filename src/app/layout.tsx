import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coin Flip | Base Mini App',
  description: 'Flip a coin onchain! Free daily flip on Base.',
  openGraph: {
    title: 'Coin Flip | Base Mini App',
    description: 'Flip a coin onchain! Free daily flip on Base.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-base-dark text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
