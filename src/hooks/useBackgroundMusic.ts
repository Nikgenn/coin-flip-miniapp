/**
 * Background Music Hook
 * 
 * Provides a shared background music system with:
 * - Single HTMLAudioElement instance
 * - localStorage persistence
 * - Mobile autoplay policy compliance (unlock on first gesture)
 * - Mute/unmute toggle
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'bgm_enabled';
const AUDIO_PATH = '/audio/background.mp3';

// Shared audio instance (singleton)
let sharedAudio: HTMLAudioElement | null = null;
let isUnlocked = false;

/**
 * Get or create the shared audio instance
 */
function getAudioInstance(): HTMLAudioElement {
  if (typeof window === 'undefined') {
    // SSR guard
    return null as any;
  }

  if (!sharedAudio) {
    sharedAudio = new Audio(AUDIO_PATH);
    sharedAudio.loop = true;
    sharedAudio.volume = 0.3;
    sharedAudio.preload = 'auto';
  }

  return sharedAudio;
}

/**
 * Read enabled state from localStorage
 */
function readStoredState(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

/**
 * Write enabled state to localStorage
 */
function writeStoredState(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (err) {
    console.warn('[BGM] Failed to persist state:', err);
  }
}

/**
 * Background Music Hook
 * 
 * Usage:
 * ```tsx
 * const { enabled, toggle, unlock } = useBackgroundMusic();
 * 
 * // In first user interaction:
 * onClick={() => {
 *   unlock(); // Unlock audio context
 *   // ... rest of handler
 * }}
 * ```
 */
export function useBackgroundMusic() {
  // Initialize from localStorage (default: false/muted)
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const stored = readStoredState();
    setEnabled(stored);
    setIsReady(true);
  }, []);

  /**
   * Unlock audio on first user gesture
   * This makes future play() calls work reliably
   */
  const unlock = useCallback(async () => {
    if (isUnlocked) return;

    const audio = getAudioInstance();
    if (!audio) return;

    try {
      // Attempt to play and immediately pause
      // This "unlocks" the audio context for iOS/Android
      audio.muted = true; // Safety: ensure no sound during unlock
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      }
      
      isUnlocked = true;
      console.log('[BGM] Audio unlocked');
    } catch (err) {
      console.warn('[BGM] Unlock failed (may retry on next interaction):', err);
    }
  }, []);

  /**
   * Enable music (unmute)
   */
  const enable = useCallback(async () => {
    if (!isReady) return;

    const audio = getAudioInstance();
    if (!audio) return;

    // Unlock if needed
    if (!isUnlocked) {
      await unlock();
    }

    setEnabled(true);
    writeStoredState(true);

    // Start playing
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[BGM] Play failed:', err);
          // Revert state if play failed
          if (isMountedRef.current) {
            setEnabled(false);
            writeStoredState(false);
          }
        });
      }
    } catch (err) {
      console.warn('[BGM] Play error:', err);
    }
  }, [isReady, unlock]);

  /**
   * Disable music (mute)
   */
  const disable = useCallback(() => {
    if (!isReady) return;

    const audio = getAudioInstance();
    if (!audio) return;

    setEnabled(false);
    writeStoredState(false);

    // Pause music
    try {
      audio.pause();
    } catch (err) {
      console.warn('[BGM] Pause error:', err);
    }
  }, [isReady]);

  /**
   * Toggle music on/off
   */
  const toggle = useCallback(() => {
    if (enabled) {
      disable();
    } else {
      enable();
    }
  }, [enabled, enable, disable]);

  // Sync audio state when enabled changes externally
  useEffect(() => {
    if (!isReady) return;

    const audio = getAudioInstance();
    if (!audio) return;

    if (enabled && audio.paused) {
      // Restore playback if enabled but paused
      enable();
    } else if (!enabled && !audio.paused) {
      // Pause if disabled but playing
      audio.pause();
    }
  }, [enabled, isReady, enable]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    enabled,
    isReady,
    toggle,
    enable,
    disable,
    unlock,
  };
}
