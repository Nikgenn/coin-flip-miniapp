'use client';

import { useReadContract } from 'wagmi';
import { COINFLIP_ABI, COINFLIP_ADDRESS } from '@/config/contract';

interface PlayerStatsProps {
  address: `0x${string}`;
}

export function PlayerStats({ address }: PlayerStatsProps) {
  const { data: stats, isLoading } = useReadContract({
    address: COINFLIP_ADDRESS,
    abi: COINFLIP_ABI,
    functionName: 'getPlayerStats',
    args: [address],
    query: {
      enabled: !!address && COINFLIP_ADDRESS !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000, // Обновляем каждые 10 секунд
    },
  });

  // Если контракт не настроен
  if (COINFLIP_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const [totalFlips, totalWins, currentStreak, bestStreak, canFlip] = stats || [
    BigInt(0),
    BigInt(0),
    BigInt(0),
    BigInt(0),
    true,
  ];

  const winRate =
    Number(totalFlips) > 0
      ? Math.round((Number(totalWins) / Number(totalFlips)) * 100)
      : 0;

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Your Stats</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            canFlip
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {canFlip ? '✓ Ready to flip' : '⏰ Flipped today'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {Number(totalFlips)}
          </p>
          <p className="text-xs text-gray-400">Flips</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">
            {Number(totalWins)}
          </p>
          <p className="text-xs text-gray-400">Wins</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{winRate}%</p>
          <p className="text-xs text-gray-400">Win Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {Number(currentStreak)}
          </p>
          <p className="text-xs text-gray-400">Streak</p>
        </div>
      </div>

      {Number(bestStreak) > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 text-center">
          <p className="text-sm text-gray-400">
            Best streak: <span className="text-yellow-400 font-bold">{Number(bestStreak)}</span> wins
          </p>
        </div>
      )}
    </div>
  );
}
