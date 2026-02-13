'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi';
import { useCapabilities, useWriteContracts, useCallsStatus } from 'wagmi/experimental';
import { 
  COINFLIP_ABI, 
  getContractAddress, 
  isSupportedChain,
  SUPPORTED_CHAIN_ID,
  getBasescanTxUrl,
} from '@/config/contract';
import { 
  prepareGameTx, 
  prepareSponsoredGameTx,
  isSponsorshipAvailable,
  type TxMode,
} from '@/lib/tx';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Coin } from './Coin';
import { CountdownTimer } from './CountdownTimer';
import { Confetti } from './Confetti';
import { ShareButton } from './ShareButton';
import { FlipsRemaining } from './FlipsRemaining';

// Transaction states for clear user feedback
type GameState = 
  | 'idle'           // Ready to choose
  | 'choosing'       // Player selected a side
  | 'submitting'     // Wallet popup open, waiting for signature
  | 'confirming'     // Transaction submitted, waiting for confirmation
  | 'flipping'       // Animation playing
  | 'result';        // Showing result

type Choice = 'heads' | 'tails' | null;

// Gas mode badge component - Base Mini App Guidelines: softer copy
function GasBadge({ sponsored }: { sponsored: boolean }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${sponsored 
          ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' 
          : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20'
        }
      `}>
        <span>{sponsored ? '✨' : '⚡'}</span>
        <span>{sponsored ? 'Free transaction' : 'Network fee may apply'}</span>
      </span>
      {!sponsored && (
        <span className="text-[10px] text-gray-500 dark:text-gray-500">
          Some wallets support free transactions
        </span>
      )}
    </div>
  );
}

export function CoinFlipGame() {
  const { address, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  
  const [choice, setChoice] = useState<Choice>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [lastResult, setLastResult] = useState<{ won: boolean; result: 'heads' | 'tails' } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [txMode, setTxMode] = useState<TxMode>('regular');
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

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
    data: sponsoredCallsData,
    isPending: isSponsoredPending,
    error: sponsoredError,
    reset: resetSponsoredWrite,
  } = useWriteContracts();

  // Extract id from sponsoredCallsData (can be string or object with id)
  const sponsoredCallsId = typeof sponsoredCallsData === 'string' 
    ? sponsoredCallsData 
    : sponsoredCallsData?.id;

  // Track sponsored tx status
  const { 
    data: callsStatus,
  } = useCallsStatus({
    id: sponsoredCallsId as string,
    query: {
      enabled: !!sponsoredCallsId,
      refetchInterval: (data) => {
        const status = data.state.data?.status;
        return status === 'success' || status === 'failure' ? false : 1000;
      },
    },
  });

  // Sponsored tx states
  const isSponsoredConfirming = !!sponsoredCallsId && callsStatus?.status !== 'success' && callsStatus?.status !== 'failure';
  const isSponsoredSuccess = callsStatus?.status === 'success';
  const isSponsoredFailed = callsStatus?.status === 'failure';

  // Extract tx hash from sponsored calls receipts
  const sponsoredTxHash = callsStatus?.receipts?.[0]?.transactionHash;

  // Unified states
  const isPending = txMode === 'sponsored' ? isSponsoredPending : isRegularPending;
  const isConfirming = txMode === 'sponsored' ? isSponsoredConfirming : isRegularConfirming;
  const isSuccess = txMode === 'sponsored' ? isSponsoredSuccess : isRegularSuccess;
  const isFailed = txMode === 'sponsored' ? isSponsoredFailed : false;
  const error = txMode === 'sponsored' ? sponsoredError : regularError;
  const txHash = txMode === 'sponsored' ? sponsoredTxHash : regularHash;

  // Update lastTxHash when we get a hash
  useEffect(() => {
    if (txHash) {
      setLastTxHash(txHash);
    }
  }, [txHash]);

  // Handle transaction state changes
  useEffect(() => {
    if (isPending && gameState === 'choosing') {
      setGameState('submitting');
    }
  }, [isPending, gameState]);

  useEffect(() => {
    if (isConfirming && (gameState === 'submitting' || gameState === 'choosing')) {
      setGameState('confirming');
    }
  }, [isConfirming, gameState]);

  // For sponsored tx: move to confirming when we get callsId
  useEffect(() => {
    if (txMode === 'sponsored' && sponsoredCallsId && gameState === 'submitting') {
      setGameState('confirming');
    }
  }, [txMode, sponsoredCallsId, gameState]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && (gameState === 'confirming' || gameState === 'submitting')) {
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

  // Handle sponsored tx failure
  useEffect(() => {
    if (isFailed && gameState === 'confirming') {
      setErrorMessage('Transaction failed on chain');
      setGameState('idle');
    }
  }, [isFailed, gameState]);

  // Handle errors with graceful fallback
  useEffect(() => {
    if (error) {
      let message = 'Transaction failed';
      let shouldFallback = false;
      
      const errorMsg = error.message?.toLowerCase() || '';
      
      if (errorMsg.includes('rejected') || errorMsg.includes('denied') || errorMsg.includes('user rejected')) {
        message = 'Transaction cancelled';
      } else if (errorMsg.includes('insufficient funds') || errorMsg.includes('not enough')) {
        if (txMode === 'sponsored') {
          message = 'Gas sponsorship failed. Paymaster may be out of funds or contract not allowlisted.';
        } else {
          message = 'Insufficient ETH for gas fee';
        }
      } else if (errorMsg.includes('already flipped') || errorMsg.includes('daily limit')) {
        message = 'Daily limit reached';
      } else if (errorMsg.includes('paymaster') || errorMsg.includes('sponsor') || errorMsg.includes('bundler')) {
        message = 'Gas sponsorship unavailable. Check paymaster settings.';
        shouldFallback = true;
      } else if (errorMsg.includes('execution reverted') || errorMsg.includes('revert')) {
        message = 'Transaction reverted. Please try again.';
      } else {
        // Log full error for debugging
        console.error('[CoinFlip] Transaction error:', error);
        message = 'Transaction failed. Please try again.';
      }
      
      setErrorMessage(message);
      setGameState('idle');
      
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
    setLastTxHash(null);

    // Determine mode: use sponsored if available, otherwise regular
    const mode: TxMode = sponsorshipAvailable ? 'sponsored' : 'regular';
    setTxMode(mode);

    try {
      if (mode === 'sponsored') {
        const txParams = prepareSponsoredGameTx({
          chooseHeads: choice === 'heads',
          chainId: chain.id,
        });
        
        if (!txParams) {
          // Fallback to regular if sponsored prep fails
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
    setLastTxHash(null);
    resetRegularWrite();
    resetSponsoredWrite();
    setTimeout(() => refetchStats(), 500);
  };

  const handleRetry = () => {
    setErrorMessage(null);
    setLastTxHash(null);
    resetRegularWrite();
    resetSponsoredWrite();
    if (choice) {
      setGameState('choosing');
    } else {
      setGameState('idle');
    }
  };

  // ============================================================================
  // RENDER: Network Guard
  // ============================================================================
  if (isWrongNetwork) {
    return (
      <Card className="text-center">
        <div className="text-4xl mb-4">🔗</div>
        <h3 className="text-lg font-semibold mb-2">Switch to Base Mainnet</h3>
        <p className="text-gray-400 text-sm mb-4">
          This app only works on <span className="text-blue-400">Base Mainnet</span> (Chain ID: 8453).
          <br />
          <span className="text-yellow-400">Current: {chain?.name || 'Not connected'}</span>
        </p>
        <Button
          onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}
          isLoading={isSwitching}
          aria-label="Switch to Base Mainnet"
        >
          🔵 Switch Network
        </Button>
      </Card>
    );
  }

  // Contract not deployed
  if (!contractAddress && chain?.id && isSupportedChain(chain.id)) {
    return (
      <Card className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Contract Not Available</h3>
        <p className="text-gray-400 text-sm">
          The game contract is not deployed yet.
        </p>
      </Card>
    );
  }

  // No flips remaining today - softer copy per Base guidelines
  if (!canFlip && gameState === 'idle' && !lastResult) {
    return (
      <Card className="text-center">
        <div className="mb-6">
          <Coin state="heads" />
        </div>
        <h3 className="text-lg font-semibold mb-2">See you tomorrow!</h3>
        <p className="text-gray-400 text-sm mb-4">
          Free plays reset in:
        </p>
        <div className="mb-4">
          {nextFlipTime && <CountdownTimer nextFlipTime={nextFlipTime} />}
        </div>
        <FlipsRemaining remaining={0} />
      </Card>
    );
  }

  // Determine coin state for animation
  const coinState = 
    gameState === 'flipping' ? 'flipping' :
    gameState === 'result' && lastResult ? lastResult.result :
    'idle';

  // Get status text for transaction states
  const getStatusText = () => {
    switch (gameState) {
      case 'submitting':
        return 'Submitting…';
      case 'confirming':
        return 'Confirming…';
      case 'flipping':
        return 'Flipping…';
      default:
        return null;
    }
  };

  return (
    <Card>
      {/* Flips remaining + Gas badge */}
      <div className="flex items-center justify-between mb-4">
        <FlipsRemaining remaining={flipsRemaining} />
        <GasBadge sponsored={sponsorshipAvailable} />
      </div>

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

      {/* Result Message - Premium victory/defeat styling */}
      {gameState === 'result' && lastResult && (
        <div 
          className="text-center mb-6 animate-slide-up"
          role="alert"
          aria-live="assertive"
        >
          {/* Victory/Defeat text with glow effect */}
          <p className={`
            text-3xl font-black tracking-wide
            ${lastResult.won 
              ? 'text-transparent bg-clip-text bg-gradient-to-b from-green-300 via-green-400 to-green-500 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]' 
              : 'text-transparent bg-clip-text bg-gradient-to-b from-red-300 via-red-400 to-red-500 drop-shadow-[0_0_20px_rgba(248,113,113,0.5)]'
            }
          `}>
            {lastResult.won ? 'You Won!' : 'You Lost'}
          </p>
          <p className="text-gray-300 text-sm mt-3">
            You picked <span className="font-semibold text-white">{choice === 'heads' ? 'Heads' : 'Tails'}</span> – 
            Result was <span className="font-semibold text-white">{lastResult.result === 'heads' ? 'Heads' : 'Tails'}</span>
          </p>
          
          {/* Basescan link */}
          {lastTxHash && (
            <a 
              href={getBasescanTxUrl(lastTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
            >
              View on Basescan ↗
            </a>
          )}
          
          {/* Share buttons */}
          <div className="mt-5">
            <ShareButton won={lastResult.won} result={lastResult.result} />
          </div>
        </div>
      )}

      {/* Choice Selection - Premium button styles with light/dark support */}
      {(gameState === 'idle' || gameState === 'choosing') && (
        <div className="mb-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">Choose your side:</p>
          <div className="flex gap-3">
            {/* Heads - Gold gradient when selected */}
            <button
              onClick={() => handleChoose('heads')}
              className={`
                flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${choice === 'heads'
                  ? 'bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/30 scale-[1.02] border-2 border-yellow-300/50'
                  : 'bg-gray-200 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700/80 hover:border-gray-400 dark:hover:border-gray-500/50'
                }
              `}
              aria-pressed={choice === 'heads'}
              aria-label="Choose Heads"
            >
              Heads
            </button>
            {/* Tails - Silver gradient when selected */}
            <button
              onClick={() => handleChoose('tails')}
              className={`
                flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${choice === 'tails'
                  ? 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/30 scale-[1.02] border-2 border-gray-200/50'
                  : 'bg-gray-200 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700/80 hover:border-gray-400 dark:hover:border-gray-500/50'
                }
              `}
              aria-pressed={choice === 'tails'}
              aria-label="Choose Tails"
            >
              Tails
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

      {/* Action Buttons - Premium styling */}
      <div className="space-y-3">
        {gameState === 'result' ? (
          <Button
            onClick={handlePlayAgain}
            variant={flipsRemaining > 0 ? 'primary' : 'secondary'}
            size="lg"
            className="w-full"
          >
            {flipsRemaining > 0 ? (
              <>
                <span className="text-xl">🪙</span>
                <span>Play Again ({flipsRemaining} left)</span>
              </>
            ) : 'Done for Today'}
          </Button>
        ) : (
          <Button
            onClick={handleFlip}
            disabled={!choice || gameState !== 'choosing'}
            isLoading={gameState === 'submitting' || gameState === 'confirming' || gameState === 'flipping'}
            size="lg"
            className="w-full"
            aria-label={choice ? `Flip coin with ${choice} selected` : 'Select a side first'}
          >
            {getStatusText() || (
              <>
                <span className="text-xl">🪙</span>
                <span>{choice ? 'Start Playing' : 'Flip Coin!'}</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status hint */}
      {(gameState === 'submitting' || gameState === 'confirming') && (
        <p className="text-center text-gray-500 text-xs mt-3 animate-pulse">
          {gameState === 'submitting' 
            ? 'Please confirm in your wallet…'
            : 'Waiting for blockchain confirmation…'}
        </p>
      )}
    </Card>
  );
}
