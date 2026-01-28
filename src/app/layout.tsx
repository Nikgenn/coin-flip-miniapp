import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { BaseMetaTag } from '@/components/BaseMetaTag';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  APP_THEME_COLOR,
  APP_TWITTER_HANDLE,
  ASSETS,
} from '@/config/app';

// UX Decision: Outfit is a modern geometric sans-serif that feels 
// friendly yet professional — perfect for a consumer crypto app
const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// SEO & OpenGraph metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
  title: {
    default: `${APP_NAME} — Base Mini App`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: ['coin flip', 'base', 'onchain', 'mini app', 'farcaster', 'game', 'crypto', 'web3'],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  
  // Canonical URL
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },

  // OpenGraph
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [
      {
        url: ASSETS.ogImage,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — ${APP_TAGLINE}`,
      },
    ],
    locale: 'en_US',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [ASSETS.ogImage],
    creator: APP_TWITTER_HANDLE,
  },

  // Icons
  icons: {
    icon: ASSETS.favicon,
    apple: ASSETS.icon,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
  },

  // Other
  manifest: '/manifest.json',
  other: {
    'base:app_id': '697a5f552dbd4b464042aea2',
  },
  };
}

// Mobile viewport optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: APP_THEME_COLOR,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} text-white min-h-screen min-h-dvh antialiased`}>
        <BaseMetaTag />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
