'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi';
import { COINFLIP_ABI, COINFLIP_ADDRESS, CHAIN_ID } from '@/config/contract';

type Choice = 'heads' | 'tails' | null;
type GameState = 'idle' | 'choosing' | 'flipping' | 'result';

export function CoinFlipGame() {
  const { address, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [choice, setChoice] = useState<Choice>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [lastResult, setLastResult] = useState<{ won: boolean; result: boolean } | null>(null);

  // Проверяем, правильная ли сеть (используем chain из кошелька)
  const isWrongNetwork = chain?.id !== CHAIN_ID;

  // Проверяем, может ли игрок сделать бросок сегодня
  const { data: canFlip, refetch: refetchCanFlip } = useReadContract({
    address: COINFLIP_ADDRESS,
    abi: COINFLIP_ABI,
    functionName: 'canFlipToday',
    args: [address!],
    query: {
      enabled: !!address && !isWrongNetwork,
    },
  });

  // Функция для отправки транзакции
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Ожидание подтверждения транзакции
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Обработка результата
  useEffect(() => {
    if (isSuccess && choice && gameState === 'flipping') {
      // Симулируем результат (в реальности нужно читать из события)
      const coinResult = Math.random() > 0.5; // true = heads, false = tails
      const won = (choice === 'heads') === coinResult;
      setLastResult({ won, result: coinResult });
      setGameState('result');
      refetchCanFlip();
    }
  }, [isSuccess, choice, gameState, refetchCanFlip]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
      setGameState('idle');
    }
  }, [error]);

  const handleChoose = (selection: Choice) => {
    setChoice(selection);
    setGameState('choosing');
  };

  const handleFlip = async () => {
    if (!choice) return;

    setGameState('flipping');

    try {
      writeContract({
        address: COINFLIP_ADDRESS,
        abi: COINFLIP_ABI,
        functionName: 'flip',
        args: [choice === 'heads'],
        chainId: CHAIN_ID,
      });
    } catch (err) {
      console.error('Flip error:', err);
      setGameState('idle');
      setChoice(null);
    }
  };

  const handleReset = () => {
    setChoice(null);
    setLastResult(null);
    setGameState('idle');
    // Небольшая задержка перед refetch
    setTimeout(() => refetchCanFlip(), 500);
  };

  // Если контракт не настроен
  if (COINFLIP_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="stat-card text-center">
        <p className="text-yellow-400 mb-2">⚠️ Contract not deployed</p>
        <p className="text-gray-400 text-sm">
          Deploy the contract and add the address to .env
        </p>
      </div>
    );
  }

  // Если неправильная сеть - показываем кнопку переключения
  if (isWrongNetwork) {
    return (
      <div className="stat-card text-center">
        <div className="text-4xl mb-4">🔗</div>
        <p className="text-xl font-bold mb-2">Wrong Network</p>
        <p className="text-gray-400 text-sm mb-2">
          You are on: <span className="text-yellow-400">{chain?.name || 'Unknown'}</span>
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Please switch to <span className="text-green-400">Base Sepolia</span> to play
        </p>
        <button
          onClick={() => switchChain({ chainId: CHAIN_ID })}
          disabled={isSwitching}
          className="btn-primary"
        >
          {isSwitching ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Switching...
            </span>
          ) : (
            'Switch to Base Sepolia'
          )}
        </button>
      </div>
    );
  }

  // Если уже использовал бросок сегодня
  if (canFlip === false && gameState === 'idle') {
    return (
      <div className="stat-card text-center">
        <div className="text-4xl mb-4">⏰</div>
        <p className="text-xl font-bold mb-2">Come back tomorrow!</p>
        <p className="text-gray-400 text-sm">
          You've already flipped today.
          <br />
          Next flip available in ~24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="stat-card">
      {/* Монета */}
      <div className="flex justify-center mb-6">
        <div
          className={`coin ${
            gameState === 'flipping' || isPending || isConfirming
              ? 'coin-flip-animation'
              : lastResult
              ? lastResult.result
                ? 'coin-heads'
                : 'coin-tails'
              : choice === 'heads'
              ? 'coin-heads'
              : choice === 'tails'
              ? 'coin-tails'
              : 'coin-heads'
          } ${lastResult?.won ? 'win-glow' : ''} ${
            lastResult && !lastResult.won ? 'lose-shake' : ''
          }`}
        >
          {gameState === 'flipping' || isPending || isConfirming ? (
            '🪙'
          ) : lastResult ? (
            lastResult.result ? '👑' : '🦅'
          ) : choice ? (
            choice === 'heads' ? '👑' : '🦅'
          ) : (
            '?'
          )}
        </div>
      </div>

      {/* Результат */}
      {gameState === 'result' && lastResult && (
        <div className="text-center mb-6">
          <p
            className={`text-2xl font-bold ${
              lastResult.won ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {lastResult.won ? '🎉 You Won!' : '😔 You Lost'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Result: {lastResult.result ? 'Heads 👑' : 'Tails 🦅'}
          </p>
        </div>
      )}

      {/* Выбор */}
      {(gameState === 'idle' || gameState === 'choosing') && (
        <>
          <p className="text-center text-gray-400 mb-4">Choose your side:</p>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleChoose('heads')}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                choice === 'heads'
                  ? 'bg-yellow-500 text-yellow-900 scale-105'
                  : 'bg-base-gray hover:bg-gray-700 text-white'
              }`}
            >
              👑 Heads
            </button>
            <button
              onClick={() => handleChoose('tails')}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                choice === 'tails'
                  ? 'bg-gray-400 text-gray-900 scale-105'
                  : 'bg-base-gray hover:bg-gray-700 text-white'
              }`}
            >
              🦅 Tails
            </button>
          </div>
        </>
      )}

      {/* Кнопка действия */}
      <div className="flex flex-col gap-3">
        {gameState === 'result' ? (
          <button onClick={handleReset} className="btn-secondary">
            Play Again Tomorrow
          </button>
        ) : (
          <>
            <button
              onClick={handleFlip}
              disabled={!choice || isPending || isConfirming || gameState === 'flipping'}
              className="btn-primary w-full"
            >
              {isPending || isConfirming || gameState === 'flipping' ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : 'Processing...'}
                </span>
              ) : (
                '🪙 Flip Coin!'
              )}
            </button>
            {(isPending || isConfirming || gameState === 'flipping') && (
              <button
                onClick={handleReset}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            )}
          </>
        )}
      </div>

      {/* Ошибка */}
      {error && (
        <p className="text-red-400 text-sm text-center mt-4">
          Error: {error.message.slice(0, 100)}...
        </p>
      )}
    </div>
  );
}
