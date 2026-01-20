'use client';

import { useState, useEffect } from 'react';

// UX Decision: Show clear countdown until next flip is available
// Updates every second for real-time feedback

interface CountdownTimerProps {
  // Unix timestamp (in seconds) when next flip is available
  nextFlipTime?: bigint;
}

export function CountdownTimer({ nextFlipTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!nextFlipTime) return;

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const target = Number(nextFlipTime);
      const diff = target - now;

      if (diff <= 0) {
        return null;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Clear interval when countdown reaches 0
      if (!newTimeLeft) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextFlipTime]);

  if (!timeLeft) {
    return null;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="text-center" role="timer" aria-live="polite">
      <p className="text-gray-400 text-sm mb-2">Next flip available in</p>
      <div className="flex items-center justify-center gap-1 text-2xl font-bold countdown-digit">
        <TimeBlock value={pad(timeLeft.hours)} label="h" />
        <span className="text-gray-500">:</span>
        <TimeBlock value={pad(timeLeft.minutes)} label="m" />
        <span className="text-gray-500">:</span>
        <TimeBlock value={pad(timeLeft.seconds)} label="s" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline">
      <span className="text-white">{value}</span>
      <span className="text-gray-500 text-sm ml-0.5">{label}</span>
    </div>
  );
}
