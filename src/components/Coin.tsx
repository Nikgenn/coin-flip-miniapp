'use client';

import Image from 'next/image';

// UX Decision: Dedicated Coin component with proper 3D CSS animation
// Shows clear visual state: idle, flipping, heads result, tails result
// When user selects a side, coin flips to show that side
// Uses custom generated coin images for premium look

type CoinState = 'idle' | 'flipping' | 'heads' | 'tails';

interface CoinProps {
  state: CoinState;
  won?: boolean;
  selectedSide?: 'heads' | 'tails' | null;
}

export function Coin({ state, won, selectedSide }: CoinProps) {
  // Determine which side to show
  const showSide = state === 'idle' ? (selectedSide || 'heads') : 
                   state === 'flipping' ? 'heads' : state;

  const isFlipping = state === 'flipping';
  const isResult = state === 'heads' || state === 'tails';
  
  // Show tails when selected or when result is tails
  const showTails = showSide === 'tails';
  
  return (
    <div 
      className="coin-container"
      role="img"
      aria-label={
        isFlipping ? 'Coin is flipping...' :
        isResult ? `Result: ${state === 'heads' ? 'Heads' : 'Tails'}${won !== undefined ? (won ? ' - You won!' : ' - You lost') : ''}` :
        selectedSide ? `Selected: ${selectedSide === 'heads' ? 'Heads' : 'Tails'}` :
        'Coin ready to flip'
      }
    >
      <div 
        className={`
          coin coin-image
          ${isFlipping ? 'coin-flipping' : ''}
          ${!isFlipping && showTails ? 'coin-show-tails' : ''}
          ${isResult ? `coin-result-${state}` : ''}
          ${isResult && won === true ? 'coin-win' : ''}
          ${isResult && won === false ? 'coin-lose' : ''}
        `}
      >
        {/* Heads side - Gold coin with crown */}
        <div className="coin-face coin-face-image coin-heads-img">
          <Image 
            src="/coin-heads.png" 
            alt="Heads - Gold coin with crown"
            fill
            sizes="160px"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* Tails side - Silver coin with eagle */}
        <div className="coin-face coin-face-image coin-tails-img">
          <Image 
            src="/coin-tails.png" 
            alt="Tails - Silver coin with eagle"
            fill
            sizes="160px"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      
      {/* Label below coin */}
      {isResult && (
        <div 
          className="mt-4 text-center animate-fade-in"
          aria-live="polite"
        >
          <p className={`text-lg font-semibold ${
            state === 'heads' ? 'text-yellow-400' : 'text-gray-300'
          }`}>
            {state === 'heads' ? '👑 Heads' : '🦅 Tails'}
          </p>
        </div>
      )}
    </div>
  );
}
