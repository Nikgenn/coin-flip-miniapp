'use client';

import { useReadContract, useAccount } from 'wagmi';
import { COINFLIP_ABI, getContractAddress, isSupportedChain } from '@/config/contract';
import { StatCard } from './ui/Card';

// UX Decision: Compact stats display that doesn't distract from main game
// but provides satisfying progress tracking

interface PlayerStatsProps {
  address: `0x${string}`;
}

export function PlayerStats({ address }: PlayerStatsProps) {
  const { chain } = useAccount();
  const contractAddress = chain?.id ? getContractAddress(chain.id) : null;
  const isSupported = chain?.id ? isSupportedChain(chain.id) : false;

  const { data: stats, isLoading } = useReadContract({
    address: contractAddress || '0x0000000000000000000000000000000000000000',
    abi: COINFLIP_ABI,
    functionName: 'getPlayerStats',
    args: [address],
    query: {
      enabled: !!address && !!contractAddress && isSupported,
      refetchInterval: 10000,
    },
  });

  // Don't show if contract not configured or unsupported network
  if (!contractAddress || !isSupported) {
    return null;
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  const [totalFlips, totalWins, currentStreak, bestStreak] = stats || [
    BigInt(0), BigInt(0), BigInt(0), BigInt(0), true, BigInt(3),
  ];

  const winRate = Number(totalFlips) > 0
    ? Math.round((Number(totalWins) / Number(totalFlips)) * 100)
    : 0;

  // Don't show stats if player hasn't played yet
  if (Number(totalFlips) === 0) {
    return null;
  }

  return (
    <div 
      className="grid grid-cols-4 gap-2"
      role="region"
      aria-label="Your game statistics"
    >
      <StatCard 
        label="Flips" 
        value={Number(totalFlips)} 
        valueColor="text-white"
      />
      <StatCard 
        label="Wins" 
        value={Number(totalWins)} 
        valueColor="text-green-400"
      />
      <StatCard 
        label="Win %" 
        value={`${winRate}%`} 
        valueColor="text-blue-400"
      />
      <StatCard 
        label="Streak" 
        value={Number(currentStreak)} 
        valueColor={Number(currentStreak) > 0 ? 'text-yellow-400' : 'text-gray-400'}
      />
    </div>
  );
}
