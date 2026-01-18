'use client';

import { useAccount } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import { CoinFlipGame } from '@/components/CoinFlipGame';
import { PlayerStats } from '@/components/PlayerStats';

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      {/* Заголовок */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-yellow-400">🪙</span> Coin Flip
        </h1>
        <p className="text-gray-400 text-sm">
          Free daily flip on Base
        </p>
      </div>

      {/* Основной контент */}
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <div className="coin coin-heads mb-4">
            <span>?</span>
          </div>
          <p className="text-gray-400 text-center max-w-xs">
            Connect your wallet to start flipping!
            <br />
            <span className="text-sm">1 free flip per day</span>
          </p>
          <ConnectWallet />
        </div>
      ) : (
        <div className="w-full max-w-md space-y-6">
          {/* Статистика игрока */}
          <PlayerStats address={address!} />
          
          {/* Игра */}
          <CoinFlipGame />
        </div>
      )}

      {/* Футер */}
      <footer className="mt-auto pt-8 pb-4 text-center text-gray-500 text-xs">
        <p>Built on Base • No real money involved</p>
      </footer>
    </main>
  );
}
