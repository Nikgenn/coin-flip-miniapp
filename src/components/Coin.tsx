'use client';

// UX Decision: Dedicated Coin component with proper 3D CSS animation
// Shows clear visual state: idle, flipping, heads result, tails result

type CoinState = 'idle' | 'flipping' | 'heads' | 'tails';

interface CoinProps {
  state: CoinState;
  won?: boolean;
  selectedSide?: 'heads' | 'tails' | null;
}

export function Coin({ state, won, selectedSide }: CoinProps) {
  // Determine which side to show when idle
  const showSide = state === 'idle' ? (selectedSide || 'heads') : 
                   state === 'flipping' ? 'heads' : state;

  const isFlipping = state === 'flipping';
  const isResult = state === 'heads' || state === 'tails';
  
  return (
    <div 
      className="coin-container"
      role="img"
      aria-label={
        isFlipping ? 'Coin is flipping...' :
        isResult ? `Result: ${state === 'heads' ? 'Heads' : 'Tails'}${won !== undefined ? (won ? ' - You won!' : ' - You lost') : ''}` :
        'Coin ready to flip'
      }
    >
      <div 
        className={`
          coin
          ${isFlipping ? 'coin-flipping' : ''}
          ${isResult ? `coin-result-${state}` : ''}
          ${isResult && won === true ? 'coin-win' : ''}
          ${isResult && won === false ? 'coin-lose' : ''}
        `}
      >
        {/* Heads side */}
        <div className="coin-face coin-heads">
          <span role="img" aria-hidden="true">👑</span>
        </div>
        
        {/* Tails side */}
        <div className="coin-face coin-tails">
          <span role="img" aria-hidden="true">🦅</span>
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
