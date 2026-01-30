'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi';
import { useCapabilities, useWriteContracts, useCallsStatus } from 'wagmi/experimental';
import { 
  COINFLIP_ABI, 
  getContractAddress, 
  isSupportedChain,
  SUPPORTED_CHAIN_ID,
} from '@/config/contract';
import { 
  prepareGameTx, 
  prepareSponsoredGameTx,
  isSponsorshipAvailable,
  getSponsorshipStatus,
  type TxMode,
} from '@/lib/tx';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Coin } from './Coin';
import { CountdownTimer } from './CountdownTimer';
import { Confetti } from './Confetti';
import { ShareButton } from './ShareButton';
import { FlipsRemaining } from './FlipsRemaining';

// UX Decision: Explicit game states for clear user feedback
type GameState = 
  | 'idle'           // Ready to choose
  | 'choosing'       // Player selected a side
  | 'pending'        // Waiting for wallet confirmation
  | 'confirming'     // Transaction submitted, waiting for confirmation
  | 'flipping'       // Animation playing
  | 'result';        // Showing result

type Choice = 'heads' | 'tails' | null;

export function CoinFlipGame() {
  const { address, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  
  const [choice, setChoice] = useState<Choice>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [lastResult, setLastResult] = useState<{ won: boolean; result: 'heads' | 'tails' } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [txMode, setTxMode] = useState<TxMode>('regular');

  // Get contract address for current chain (mainnet only)
  const contractAddress = chain?.id ? getContractAddress(chain.id) : null;
  const isWrongNetwork = !chain?.id || !isSupportedChain(chain.id);

  // Check wallet capabilities for paymaster support
  const { data: capabilities } = useCapabilities({
    account: address,
  });

  // Determine if sponsorship is available
  const sponsorshipAvailable = useMemo(() => {
    return isSponsorshipAvailable(capabilities);
  }, [capabilities]);

  const sponsorshipStatus = useMemo(() => {
    return getSponsorshipStatus(capabilities);
  }, [capabilities]);

  // Get player stats including flips remaining
  const { data: playerStats, refetch: refetchStats } = useReadContract({
    address: contractAddress || '0x0000000000000000000000000000000000000000',
    abi: COINFLIP_ABI,
    functionName: 'getPlayerStats',
    args: [address!],
    query: {
      enabled: !!address && !!contractAddress && !isWrongNetwork,
    },
  });

  // Extract flips remaining from stats (index 5 in new contract)
  const flipsRemaining = playerStats && playerStats[5] !== undefined 
    ? Number(playerStats[5]) 
    : 3;
  const canFlip = flipsRemaining > 0;

  // Calculate next flip timestamp (approx 24h from now)
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const nextFlipTime = !canFlip ? BigInt(nowInSeconds + 86400) : undefined;

  // ============================================================================
  // REGULAR TRANSACTION (user pays gas)
  // ============================================================================
  const { 
    writeContract, 
    data: regularHash, 
    isPending: isRegularPending, 
    error: regularError, 
    reset: resetRegularWrite 
  } = useWriteContract();
  
  const { 
    isLoading: isRegularConfirming, 
    isSuccess: isRegularSuccess 
  } = useWaitForTransactionReceipt({ hash: regularHash });

  // ============================================================================
  // SPONSORED TRANSACTION (gasless via paymaster)
  // ============================================================================
  const { 
    writeContracts, 
    data: sponsoredCallsId,
    isPending: isSponsoredPending, 
    error: sponsoredError,
    reset: resetSponsoredWrite,
  } = useWriteContracts();

  const { 
    data: callsStatus,
  } = useCallsStatus({
    id: sponsoredCallsId as string,
    query: {
      enabled: !!sponsoredCallsId,
      refetchInterval: (data) => 
        data.state.data?.status === 'CONFIRMED' ? false : 1000,
    },
  });

  const isSponsoredConfirming = callsStatus?.status === 'PENDING';
  const isSponsoredSuccess = callsStatus?.status === 'CONFIRMED';

  // Unified pending/confirming/success states
  const isPending = txMode === 'sponsored' ? isSponsoredPending : isRegularPending;
  const isConfirming = txMode === 'sponsored' ? isSponsoredConfirming : isRegularConfirming;
  const isSuccess = txMode === 'sponsored' ? isSponsoredSuccess : isRegularSuccess;
  const error = txMode === 'sponsored' ? sponsoredError : regularError;

  // Handle transaction state changes
  useEffect(() => {
    if (isPending && gameState === 'choosing') {
      setGameState('pending');
    }
  }, [isPending, gameState]);

  useEffect(() => {
    if (isConfirming && gameState === 'pending') {
      setGameState('confirming');
    }
  }, [isConfirming, gameState]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && (gameState === 'confirming' || gameState === 'pending')) {
      setGameState('flipping');
      
      // After animation completes, show result
      setTimeout(() => {
        const coinResult = Math.random() > 0.5;
        const resultSide = coinResult ? 'heads' : 'tails';
        const won = choice === resultSide;
        
        setLastResult({ won, result: resultSide });
        setGameState('result');
        refetchStats();
        
        // Trigger confetti on win!
        if (won) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3500);
        }
      }, 2000);
    }
  }, [isSuccess, gameState, choice, refetchStats]);

  // Handle errors with graceful fallback
  useEffect(() => {
    if (error) {
      let message = 'Transaction failed';
      let shouldFallback = false;
      
      if (error.message.includes('rejected')) {
        message = 'Transaction was rejected';
      } else if (error.message.includes('insufficient funds')) {
        message = 'Insufficient funds for gas';
      } else if (error.message.includes('already flipped')) {
        message = 'You already flipped today';
      } else if (error.message.includes('paymaster') || error.message.includes('sponsor')) {
        // Paymaster error — offer fallback to regular mode
        message = 'Gas sponsorship unavailable. You can try again with regular transaction.';
        shouldFallback = true;
      }
      
      setErrorMessage(message);
      setGameState('idle');
      
      // If sponsored failed, suggest regular mode
      if (shouldFallback && txMode === 'sponsored') {
        setTxMode('regular');
      }
    }
  }, [error, txMode]);

  const handleChoose = (selection: Choice) => {
    setChoice(selection);
    setGameState('choosing');
    setErrorMessage(null);
  };

  // Centralized flip handler with mode selection
  const handleFlip = useCallback(async () => {
    if (!choice || !chain?.id) return;
    setErrorMessage(null);

    // Determine mode: use sponsored if available, otherwise regular
    const mode: TxMode = sponsorshipAvailable ? 'sponsored' : 'regular';
    setTxMode(mode);

    try {
      if (mode === 'sponsored') {
        // Sponsored transaction (gasless)
        const txParams = prepareSponsoredGameTx({
          chooseHeads: choice === 'heads',
          chainId: chain.id,
        });
        
        if (!txParams) {
          // Fallback to regular if sponsored prep fails
          console.warn('[flip] Sponsored prep failed, falling back to regular');
          setTxMode('regular');
          const regularParams = prepareGameTx({
            chooseHeads: choice === 'heads',
            chainId: chain.id,
          });
          if (regularParams) {
            writeContract(regularParams);
          }
          return;
        }

        writeContracts({
          contracts: txParams.contracts,
          capabilities: txParams.capabilities,
        });
      } else {
        // Regular transaction (user pays gas)
        const txParams = prepareGameTx({
          chooseHeads: choice === 'heads',
          chainId: chain.id,
        });
        
        if (!txParams) {
          setErrorMessage('Contract not available');
          return;
        }

        writeContract(txParams);
      }
    } catch (err) {
      console.error('Flip error:', err);
      setErrorMessage('Failed to start transaction');
      setGameState('idle');
    }
  }, [choice, writeContract, writeContracts, chain?.id, sponsorshipAvailable]);

  const handlePlayAgain = () => {
    setChoice(null);
    setLastResult(null);
    setGameState('idle');
    setErrorMessage(null);
    setShowConfetti(false);
    resetRegularWrite();
    resetSponsoredWrite();
    setTimeout(() => refetchStats(), 500);
  };

  const handleRetry = () => {
    setErrorMessage(null);
    resetRegularWrite();
    resetSponsoredWrite();
    if (choice) {
      setGameState('choosing');
    } else {
      setGameState('idle');
    }
  };

  // Contract not deployed for this network
  if (!contractAddress && chain?.id && isSupportedChain(chain.id)) {
    return (
      <Card className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Contract Not Deployed</h3>
        <p className="text-gray-400 text-sm">
          Contract is not deployed on Base yet.
        </p>
      </Card>
    );
  }

  // Wrong network - offer to switch to Base Mainnet only
  if (isWrongNetwork) {
    return (
      <Card className="text-center">
        <div className="text-4xl mb-4">🔗</div>
        <h3 className="text-lg font-semibold mb-2">Switch to Base</h3>
        <p className="text-gray-400 text-sm mb-4">
          You're on <span className="text-yellow-400">{chain?.name || 'Unknown'}</span>.
          <br />
          Please switch to <span className="text-blue-400">Base</span> to play.
        </p>
        <Button
          onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}
          isLoading={isSwitching}
          aria-label="Switch to Base network"
        >
          🔵 Switch to Base
        </Button>
      </Card>
    );
  }

  // Test mode - simulate win/lose for development
  const handleTestFlip = (forceWin: boolean) => {
    setChoice('heads');
    setGameState('flipping');
    
    setTimeout(() => {
      const result = forceWin ? 'heads' : 'tails';
      setLastResult({ won: forceWin, result });
      setGameState('result');
      
      if (forceWin) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
      }
    }, 2000);
  };

  // No flips remaining today
  if (!canFlip && gameState === 'idle' && !lastResult) {
    return (
      <Card className="text-center">
        <div className="mb-6">
          <Coin state="heads" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Come Back Tomorrow!</h3>
        <p className="text-gray-400 text-sm mb-4">
          You've used all 3 free flips today.
        </p>
        <FlipsRemaining remaining={0} />
        <div className="mt-4">
          {nextFlipTime && <CountdownTimer nextFlipTime={nextFlipTime} />}
        </div>
        
        {/* Dev test buttons - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-3">🛠 Dev Mode</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleTestFlip(true)}
                className="px-3 py-2 text-xs rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                Test Win 🎉
              </button>
              <button
                onClick={() => handleTestFlip(false)}
                className="px-3 py-2 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                Test Lose 😔
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Determine coin state for animation
  const coinState = 
    gameState === 'flipping' ? 'flipping' :
    gameState === 'result' && lastResult ? lastResult.result :
    'idle';

  return (
    <Card>
      {/* Flips remaining indicator */}
      <div className="mb-4">
        <FlipsRemaining remaining={flipsRemaining} />
      </div>

      {/* Gas sponsorship status */}
      {gameState === 'idle' && (
        <div className={`text-center text-xs mb-3 ${sponsorshipAvailable ? 'text-green-400' : 'text-gray-500'}`}>
          {sponsorshipAvailable ? '⛽ Free gas — sponsored!' : '⛽ Gas required'}
        </div>
      )}

      {/* Coin Display */}
      <div className="flex justify-center mb-6">
        <Coin 
          state={coinState} 
          won={lastResult?.won}
          selectedSide={choice}
        />
      </div>

      {/* Confetti celebration */}
      <Confetti isActive={showConfetti} />

      {/* Result Message */}
      {gameState === 'result' && lastResult && (
        <div 
          className="text-center mb-6 animate-slide-up"
          role="alert"
          aria-live="assertive"
        >
          <p className={`text-2xl font-bold ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}>
            {lastResult.won ? '🎉 You Won!' : '😔 You Lost'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            You picked {choice === 'heads' ? '👑 Heads' : '🦅 Tails'} • 
            Result was {lastResult.result === 'heads' ? '👑 Heads' : '🦅 Tails'}
          </p>
          
          {/* Share button */}
          <div className="mt-4">
            <ShareButton won={lastResult.won} result={lastResult.result} />
          </div>
        </div>
      )}

      {/* Choice Selection */}
      {(gameState === 'idle' || gameState === 'choosing') && (
        <div className="mb-6">
          <p className="text-center text-gray-400 text-sm mb-4">Choose your side:</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleChoose('heads')}
              className={`
                flex-1 py-4 rounded-xl font-semibold transition-all duration-200
                ${choice === 'heads'
                  ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50 scale-[1.02]'
                  : 'bg-white/5 text-gray-300 border-2 border-transparent hover:bg-white/10'
                }
              `}
              aria-pressed={choice === 'heads'}
              aria-label="Choose Heads"
            >
              👑 Heads
            </button>
            <button
              onClick={() => handleChoose('tails')}
              className={`
                flex-1 py-4 rounded-xl font-semibold transition-all duration-200
                ${choice === 'tails'
                  ? 'bg-gray-400/20 text-gray-300 border-2 border-gray-400/50 scale-[1.02]'
                  : 'bg-white/5 text-gray-300 border-2 border-transparent hover:bg-white/10'
                }
              `}
              aria-pressed={choice === 'tails'}
              aria-label="Choose Tails"
            >
              🦅 Tails
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div 
          className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
          role="alert"
        >
          <p className="text-red-400 text-sm">{errorMessage}</p>
          <button 
            onClick={handleRetry}
            className="text-red-300 text-sm underline mt-1 hover:text-red-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {gameState === 'result' ? (
          <Button
            onClick={handlePlayAgain}
            variant={flipsRemaining > 0 ? 'primary' : 'secondary'}
            size="lg"
            className="w-full"
          >
            {flipsRemaining > 0 ? `🪙 Play Again (${flipsRemaining} left)` : 'Done for Today'}
          </Button>
        ) : (
          <Button
            onClick={handleFlip}
            disabled={!choice || gameState !== 'choosing'}
            isLoading={gameState === 'pending' || gameState === 'confirming' || gameState === 'flipping'}
            size="lg"
            className="w-full"
            aria-label={choice ? `Flip coin with ${choice} selected` : 'Select a side first'}
          >
            {gameState === 'pending' ? 'Confirm in Wallet...' :
             gameState === 'confirming' ? 'Confirming...' :
             gameState === 'flipping' ? 'Flipping...' :
             sponsorshipAvailable ? '🪙 Flip (Free Gas!)' : '🪙 Flip Coin!'}
          </Button>
        )}
      </div>

      {/* Status hint */}
      {(gameState === 'pending' || gameState === 'confirming') && (
        <p className="text-center text-gray-500 text-xs mt-3 animate-pulse">
          {gameState === 'pending' 
            ? 'Please confirm the transaction in your wallet'
            : 'Waiting for blockchain confirmation...'}
        </p>
      )}
    </Card>
  );
}
