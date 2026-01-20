'use client';

import { DAILY_FREE_FLIPS } from '@/config/contract';

// UX Decision: Visual indicator showing remaining daily flips
// Makes it clear how many chances the user has left

interface FlipsRemainingProps {
  remaining: number;
}

export function FlipsRemaining({ remaining }: FlipsRemainingProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-gray-400">Flips today:</span>
      <div className="flex gap-1">
        {Array.from({ length: DAILY_FREE_FLIPS }, (_, i) => {
          const isUsed = i >= remaining;
          return (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${isUsed 
                  ? 'bg-gray-600' 
                  : 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm shadow-yellow-500/30'
                }
              `}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <span className={`text-sm font-medium ${remaining > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
        {remaining}/{DAILY_FREE_FLIPS}
      </span>
    </div>
  );
}
