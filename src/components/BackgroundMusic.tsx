/**
 * Background Music Component
 * 
 * Provides a floating toggle button for background music control.
 * Positioned bottom-right, doesn't interfere with header or gameplay.
 */

'use client';

import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

export function BackgroundMusic() {
  const { enabled, isReady, toggle } = useBackgroundMusic();

  if (!isReady) {
    // Don't render until we've read from localStorage
    return null;
  }

  return (
    <button
      onClick={toggle}
      className="
        fixed bottom-6 right-4 z-50
        w-12 h-12
        flex items-center justify-center
        rounded-full
        bg-gray-800/80 dark:bg-gray-700/80
        border-2 border-gray-600/50
        backdrop-blur-sm
        text-2xl
        transition-all duration-300
        hover:scale-110 hover:bg-gray-700/90 dark:hover:bg-gray-600/90
        active:scale-95
        shadow-lg
      "
      aria-label={enabled ? 'Mute background music' : 'Unmute background music'}
      title={enabled ? 'Music On' : 'Music Off'}
    >
      {enabled ? '🎵' : '🔇'}
    </button>
  );
}

/**
 * Hook wrapper for unlocking audio on user interaction
 * Use this in components that need to unlock audio (e.g., game buttons)
 */
export function useAudioUnlock() {
  const { unlock } = useBackgroundMusic();
  return unlock;
}
