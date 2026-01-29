/**
 * App Identity Configuration
 * Single source of truth for app metadata, manifest, and SEO
 */

export const APP_NAME = 'Coin Flip';
export const APP_TAGLINE = 'Flip a coin onchain';
export const APP_DESCRIPTION = 'Onchain coin flip game on Base. 3 free flips per day. No real money — just fun!';

// Production URL with localhost fallback for development
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Branding
export const APP_THEME_COLOR = '#0A0B0D';
export const APP_BACKGROUND_COLOR = '#0A0B0D';

// Social
export const APP_TWITTER_HANDLE = '@base';

// Networks
export const SUPPORTED_NETWORKS = ['Base', 'Base Sepolia'] as const;

// Contract (current deployment)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Asset paths
export const ASSETS = {
  icon: '/icon.png',
  ogImage: '/og.png',
  splash: '/splash.png',
  favicon: '/icon.png', // Using icon.png as favicon
} as const;

// Full URLs for external use
export const getAssetUrl = (path: string) => `${APP_URL}${path}`;
