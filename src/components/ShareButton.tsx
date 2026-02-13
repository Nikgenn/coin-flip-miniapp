'use client';

import { useState } from 'react';
import { APP_URL } from '@/config/app';

/**
 * ShareButton - Share game results
 * Base Mini App Guidelines: Client-agnostic, no Farcaster/Warpcast links
 * Uses generic share options: X (Twitter) + clipboard
 */

interface ShareButtonProps {
  won: boolean;
  result: 'heads' | 'tails';
}

export function ShareButton({ won, result }: ShareButtonProps) {
  const [copied, setCopied] = useState<'result' | 'link' | null>(null);
  
  const appUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : APP_URL;
  
  const resultText = won
    ? `🎉 I just won a coin flip on Base! 🪙${result === 'heads' ? '👑' : '🦅'}`
    : `😅 Lost my coin flip on Base... ${result === 'heads' ? '👑' : '🦅'}`;

  const fullShareText = `${resultText}\n\nTry your luck – 3 free plays daily!\n${appUrl}`;

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied('result');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied('link');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareX = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(resultText)}&url=${encodeURIComponent(appUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  // Native share API (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Coin Flip Result',
          text: resultText,
          url: appUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled');
      }
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="space-y-3">
      {/* Main share buttons - Premium dark style */}
      <div className="flex items-center justify-center gap-3">
        {/* Share button */}
        <button
          onClick={canNativeShare ? handleNativeShare : handleCopyResult}
          className="
            flex-1 max-w-[140px] inline-flex items-center justify-center gap-2 
            px-5 py-3 rounded-xl
            bg-gray-800/90 hover:bg-gray-700/90
            border border-gray-600/50 hover:border-gray-500/50
            text-white text-sm font-semibold
            transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
            shadow-lg shadow-black/20
            focus:outline-none focus:ring-2 focus:ring-white/20
          "
          aria-label="Share result"
        >
          <ShareIcon />
          <span>{copied === 'result' ? 'Copied!' : 'Share'}</span>
        </button>

        {/* Post (X/Twitter) button */}
        <button
          onClick={handleShareX}
          className="
            flex-1 max-w-[140px] inline-flex items-center justify-center gap-2 
            px-5 py-3 rounded-xl
            bg-gray-800/90 hover:bg-gray-700/90
            border border-gray-600/50 hover:border-gray-500/50
            text-white text-sm font-semibold
            transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
            shadow-lg shadow-black/20
            focus:outline-none focus:ring-2 focus:ring-white/20
          "
          aria-label="Post on X"
        >
          <MegaphoneIcon />
          <span>Post</span>
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 10v4c0 1.1.9 2 2 2h3l5 4V4L8 8H5c-1.1 0-2 .9-2 2zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
