import { NextRequest, NextResponse } from 'next/server';

/**
 * Dynamic route handler for /.well-known/farcaster.json
 * Generates manifest with absolute URLs based on environment/request
 */

function getSiteUrl(request: NextRequest): string {
  // Priority 1: Explicit site URL from env
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  // Priority 2: Vercel URL (production/preview)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Priority 3: Request host header
  const host = request.headers.get('host');
  if (host) {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
  }

  // Fallback: hardcoded production URL
  return 'https://coin-flip-miniapp-ten.vercel.app';
}

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl(request);

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjQyNjI4NCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDQ2ODI5Mjc0Mzk2NTk2OTkyYzFDRmY2ZjkzNkY2NmJiQ2I3YjYwNTAifQ",
      payload: "eyJkb21haW4iOiJjb2luLWZsaXAtbWluaWFwcC10ZW4udmVyY2VsLmFwcCJ9",
      signature: "3KfyHtQR+3EsiD86mtYjs4dSR3SPHhzrRKXgjFRN2qxash/cvs/SHuqgH4HQ9m4DbHv4L/d41LTgkdf5HP401Bs="
    },
    frame: {
      version: "1",
      name: "Coin Flip",
      iconUrl: `${siteUrl}/icon.png`,
      homeUrl: siteUrl,
      imageUrl: `${siteUrl}/og.png`,
      buttonTitle: "Flip Now!",
      splashImageUrl: `${siteUrl}/splash.png`,
      splashBackgroundColor: "#0A0B0D",
      webhookUrl: `${siteUrl}/api/webhook`
    },
    miniapp: {
      version: "1",
      name: "Coin Flip",
      homeUrl: siteUrl,
      iconUrl: `${siteUrl}/icon.png`,
      imageUrl: `${siteUrl}/og.png`,
      splashImageUrl: `${siteUrl}/splash.png`,
      splashBackgroundColor: "#0A0B0D",
      primaryCategory: "games",
      tags: ["games", "base", "coinflip", "entertainment"],
      tagline: "3 free flips per day on Base",
      subtitle: "Flip a coin onchain",
      description: "Onchain coin flip game on Base. 3 free flips per day. No real money — just fun!",
      heroImageUrl: `${siteUrl}/og.png`,
      coverImageUrl: `${siteUrl}/og.png`,
      screenshotUrls: [
        `${siteUrl}/screenshot-1.png`,
        `${siteUrl}/screenshot-2.png`,
        `${siteUrl}/screenshot-3.png`
      ],
      ogTitle: "Coin Flip — Base Mini App",
      ogDescription: "3 free flips per day on Base. No real money — just fun!",
      ogImageUrl: `${siteUrl}/og.png`
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// Support HEAD requests for validation
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
