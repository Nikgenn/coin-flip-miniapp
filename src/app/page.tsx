'use client';

import { useAccount } from 'wagmi';
import { AppHeader } from '@/components/AppHeader';
import { Onboarding } from '@/components/Onboarding';
import { ConnectWallet } from '@/components/ConnectWallet';
import { CoinFlipGame } from '@/components/CoinFlipGame';
import { PlayerStats } from '@/components/PlayerStats';
import { Leaderboard } from '@/components/Leaderboard';

// UX Decision: Centered card layout (max 480px) with clear visual hierarchy
// Mobile-first design with proper safe areas and touch targets

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* App Header with branding and network */}
      <AppHeader />

      {/* Wallet connection (when connected) */}
      {isConnected && (
        <div className="px-4 pb-2">
          <div className="max-w-[480px] mx-auto flex justify-end">
            <ConnectWallet />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-[480px] space-y-6">
          
          {/* Disconnected State - Onboarding */}
          {!isConnected && <Onboarding />}

          {/* Connected State - Game */}
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
      </main>

      {/* Footer */}
      <footer className="p-4 text-center" role="contentinfo">
        <p className="text-gray-600 text-xs">
          No real money involved • Just for fun • Built on Base
        </p>
      </footer>
    </div>
  );
}
