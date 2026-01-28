'use client';

import { useState } from 'react';
import { APP_URL } from '@/config/app';

// UX Decision: Multiple share options - social + clipboard
// Clipboard is most reliable for all platforms

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

  const fullShareText = `${resultText}\n\nTry your luck – 3 free flips per day!\n${appUrl}`;

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

  const handleShareWarpcast = () => {
    const text = `${resultText}\n\nTry your luck – 3 free flips per day!`;
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(appUrl)}`;
    window.open(warpcastUrl, '_blank', 'width=550,height=620');
  };

  return (
    <div className="space-y-3">
      {/* Social share buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleShareX}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-xl
            bg-black hover:bg-gray-900 
            border border-white/20 hover:border-white/30
            text-white text-sm font-medium
            transition-all duration-200
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-white/20
          "
          aria-label="Share result on X (Twitter)"
        >
          <XLogo />
          <span>Share</span>
        </button>

        <button
          onClick={handleShareWarpcast}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-xl
            bg-purple-600 hover:bg-purple-700
            text-white text-sm font-medium
            transition-all duration-200
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-purple-400/50
          "
          aria-label="Share result on Warpcast"
        >
          <WarpcastLogo />
          <span>Cast</span>
        </button>
      </div>

      {/* Copy buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleCopyResult}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-white/5 hover:bg-white/10
            border border-white/10 hover:border-white/20
            text-gray-400 hover:text-white text-xs font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-white/20
          "
          aria-label="Copy result to clipboard"
        >
          {copied === 'result' ? (
            <>
              <CheckIcon />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>Copy result</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyLink}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-white/5 hover:bg-white/10
            border border-white/10 hover:border-white/20
            text-gray-400 hover:text-white text-xs font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-white/20
          "
          aria-label="Copy app link to clipboard"
        >
          {copied === 'link' ? (
            <>
              <CheckIcon />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
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

function WarpcastLogo() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.5 2h17a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2Zm2.75 4L5 10.5h2l.75-2.5h1.5L10 10.5h2L10.75 6h-4.5Zm8 0L13 10.5h2l.75-2.5h1.5L18 10.5h2L18.75 6h-4.5ZM6.25 13.5 5 18h2l.75-2.5h1.5L10 18h2l-1.25-4.5h-4.5Zm8 0L13 18h2l.75-2.5h1.5L18 18h2l-1.25-4.5h-4.5Z"/>
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
