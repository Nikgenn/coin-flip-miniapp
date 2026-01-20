'use client';

// UX Decision: Easy share to X/Twitter and Warpcast after flipping
// Pre-filled text with emoji for engagement

interface ShareButtonProps {
  won: boolean;
  result: 'heads' | 'tails';
}

export function ShareButton({ won, result }: ShareButtonProps) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  const text = won
    ? `🎉 I just won a coin flip on Base! 🪙${result === 'heads' ? '👑' : '🦅'}\n\nTry your luck – 3 free flips per day!`
    : `😅 Lost my coin flip on Base... ${result === 'heads' ? '👑' : '🦅'}\n\nTomorrow I'm coming back! Try your luck:`;

  const handleShareX = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleShareWarpcast = () => {
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`;
    window.open(warpcastUrl, '_blank', 'width=550,height=620');
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* X/Twitter */}
      <button
        onClick={handleShareX}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-xl
          bg-black hover:bg-gray-900 
          border border-white/20 hover:border-white/30
          text-white text-sm font-medium
          transition-all duration-200
          hover:scale-105 active:scale-95
        "
        aria-label="Share result on X (Twitter)"
      >
        <XLogo />
        <span>Share</span>
      </button>

      {/* Warpcast */}
      <button
        onClick={handleShareWarpcast}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-xl
          bg-purple-600 hover:bg-purple-700
          text-white text-sm font-medium
          transition-all duration-200
          hover:scale-105 active:scale-95
        "
        aria-label="Share result on Warpcast"
      >
        <WarpcastLogo />
        <span>Cast</span>
      </button>
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
