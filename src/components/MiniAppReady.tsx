'use client';

import { useEffect } from 'react';

/**
 * MiniAppReady - Signals to Farcaster/Base App that the Mini App is ready
 * Must be mounted in layout.tsx to work on all pages
 */
export function MiniAppReady() {
  useEffect(() => {
    // Log mount immediately
    console.log('[miniapp] mounted', window.location.href);

    const sendReady = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk');

        // Check if sdk.actions.ready exists
        if (!sdk?.actions?.ready) {
          console.warn('[miniapp] sdk.actions.ready not available');
          return;
        }

        // Send ready signal
        await sdk.actions.ready();
        console.log('[miniapp] ready sent');
      } catch (error) {
        console.error('[miniapp] ready failed', error);
      }
    };

    // Delay to ensure DOM and context are fully initialized
    const timer = setTimeout(sendReady, 200);

    return () => clearTimeout(timer);
  }, []);

  // This component renders nothing
  return null;
}
