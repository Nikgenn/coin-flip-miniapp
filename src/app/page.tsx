'use client';

import { useAccount } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import { CoinFlipGame } from '@/components/CoinFlipGame';
import { PlayerStats } from '@/components/PlayerStats';
import { Leaderboard } from '@/components/Leaderboard';
import { Card } from '@/components/ui/Card';
import { Coin } from '@/components/Coin';

// UX Decision: Centered card layout (max 480px) with clear visual hierarchy
// Mobile-first design with proper safe areas and touch targets

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <main className="min-h-screen min-h-dvh flex flex-col">
      {/* Header with wallet connection */}
      <header className="p-4 flex justify-end">
        {isConnected && <ConnectWallet />}
      </header>

      {/* Main content - centered card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-[480px] space-y-6">
          
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Coin Flip
              </span>
            </h1>
            <p className="text-gray-400">
              3 free flips per day on Base
            </p>
          </div>

          {/* Disconnected State */}
          {!isConnected && (
            <Card className="text-center py-10">
              {/* Animated coin preview */}
              <div className="mb-8">
                <Coin state="idle" selectedSide="heads" />
              </div>

              {/* Value proposition */}
              <h2 className="text-xl font-semibold mb-2">
                Ready to test your luck?
              </h2>
              <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                Connect your wallet and flip. 
                <br />
                3 free chances every day!
              </p>

              {/* Connect CTA */}
              <div className="flex justify-center">
                <ConnectWallet />
              </div>

              {/* Trust signals */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">✓</span> Free
                  </span>
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">⚡</span> No Gas
                  </span>
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">🔵</span> Built on Base
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Connected State */}
          {isConnected && address && (
            <>
              {/* Player Stats (compact) */}
              <PlayerStats address={address} />
              
              {/* Main Game */}
              <CoinFlipGame />
              
              {/* Leaderboard */}
              <Leaderboard />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-gray-600 text-xs">
          No real money involved • Just for fun
        </p>
      </footer>
    </main>
  );
}
