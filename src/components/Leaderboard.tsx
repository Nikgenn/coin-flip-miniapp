'use client';

import { useState } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { COINFLIP_ABI, getContractAddress, isSupportedChain } from '@/config/contract';
import { Card } from './ui/Card';

// UX Decision: Collapsible leaderboard - clean UI by default
// Expands on click to show full rankings

export function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useAccount();
  const contractAddress = chain?.id ? getContractAddress(chain.id) : null;
  const isSupported = chain?.id ? isSupportedChain(chain.id) : false;

  const { data, isLoading, error } = useReadContract({
    address: contractAddress || '0x0000000000000000000000000000000000000000',
    abi: COINFLIP_ABI,
    functionName: 'getLeaderboard',
    args: [BigInt(10)], // Top 10
    query: {
      enabled: !!contractAddress && isSupported,
      refetchInterval: 30000, // Refresh every 30s
      retry: false, // Don't retry on error
    },
  });

  const { data: totalPlayers } = useReadContract({
    address: contractAddress || '0x0000000000000000000000000000000000000000',
    abi: COINFLIP_ABI,
    functionName: 'getTotalPlayers',
    query: {
      enabled: !!contractAddress && isSupported,
      retry: false,
    },
  });

  // If contract call fails, don't crash - just hide leaderboard
  if (error) {
    console.error('Leaderboard error:', error);
    return null;
  }

  if (!contractAddress || !isSupported) {
    return null;
  }

  const [addresses, wins, flips, streaks] = data || [[], [], [], []];
  const playerCount = totalPlayers ? Number(totalPlayers) : 0;

  // Network name for display
  const networkName = chain?.id === 8453 ? 'Base' : 'Base Sepolia';

  return (
    <Card noPadding className="overflow-hidden">
      {/* Clickable header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between p-4
          hover:bg-white/5 transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset
        "
        aria-expanded={isOpen}
        aria-controls="leaderboard-content"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="font-semibold">Leaderboard</span>
          <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full">
            {networkName}
          </span>
          {playerCount > 0 && (
            <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full">
              {playerCount} players
            </span>
          )}
        </div>
        
        {/* Arrow indicator */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        id="leaderboard-content"
        className={`
          transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          overflow-hidden
        `}
      >
        <div className="px-4 pb-4 border-t border-white/10">
          {isLoading ? (
            <div className="py-4 space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : !addresses || addresses.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-400 text-sm">
                No players yet on {networkName}. Be the first! 🎯
              </p>
            </div>
          ) : (
            <div className="pt-4 space-y-2">
              {addresses.map((address, index) => (
                <LeaderboardRow
                  key={address}
                  rank={index + 1}
                  address={address}
                  wins={Number(wins[index])}
                  flips={Number(flips[index])}
                  bestStreak={Number(streaks[index])}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface LeaderboardRowProps {
  rank: number;
  address: string;
  wins: number;
  flips: number;
  bestStreak: number;
}

function LeaderboardRow({ rank, address, wins, flips, bestStreak }: LeaderboardRowProps) {
  const winRate = flips > 0 ? Math.round((wins / flips) * 100) : 0;
  
  const getRankDisplay = (r: number) => {
    switch (r) {
      case 1: return { emoji: '🥇', style: 'bg-yellow-500/10 border-yellow-500/30' };
      case 2: return { emoji: '🥈', style: 'bg-gray-400/10 border-gray-400/30' };
      case 3: return { emoji: '🥉', style: 'bg-amber-600/10 border-amber-600/30' };
      default: return { emoji: `#${r}`, style: 'bg-white/5 border-white/10' };
    }
  };

  const { emoji, style } = getRankDisplay(rank);

  return (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-xl border
        ${style}
        transition-all duration-200 hover:scale-[1.01]
      `}
    >
      {/* Rank */}
      <div className="w-8 text-center font-bold text-sm">
        {emoji}
      </div>

      {/* Address */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm text-gray-300 truncate">
          {formatAddress(address)}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm">
        <div className="text-center min-w-[40px]">
          <p className="font-bold text-green-400">{wins}</p>
          <p className="text-[10px] text-gray-500">wins</p>
        </div>
        <div className="text-center min-w-[40px]">
          <p className="font-bold text-blue-400">{winRate}%</p>
          <p className="text-[10px] text-gray-500">rate</p>
        </div>
        {bestStreak > 0 && (
          <div className="text-center min-w-[40px]">
            <p className="font-bold text-yellow-400">{bestStreak}🔥</p>
            <p className="text-[10px] text-gray-500">best</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
