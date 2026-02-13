'use client';

import { useAccount } from 'wagmi';
import { isSupportedChain, SUPPORTED_CHAIN_ID } from '@/config/contract';
import { APP_NAME, APP_TAGLINE } from '@/config/app';
import { ThemeToggle } from './ThemeProvider';

/**
 * AppHeader - Displays app branding, network context, and theme toggle
 * Shows current network status for connected users (Base Mainnet only)
 */
export function AppHeader() {
  const { isConnected, chain } = useAccount();
  
  const getNetworkInfo = (chainId: number | undefined) => {
    if (!chainId) return { name: 'Unknown', isSupported: false };
    
    if (chainId === SUPPORTED_CHAIN_ID) {
      return { name: 'Base', isSupported: true };
    }
    
    return { name: chain?.name || 'Unknown', isSupported: false };
  };

  const { name: networkName, isSupported } = getNetworkInfo(chain?.id);

  return (
    <header className="w-full px-4 pt-4 pb-3">
      <div className="max-w-[480px] mx-auto flex items-center justify-between">
        {/* App branding - Premium gold style like OG image */}
        <div className="flex items-center gap-3">
          {/* Dual coins with glow */}
          <div className="relative flex items-center">
            {/* Gold coin */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-md" aria-hidden="true" />
              <img 
                src="/coin-heads.png" 
                alt="" 
                className="relative w-9 h-9 rounded-full shadow-lg shadow-yellow-500/30"
                aria-hidden="true"
              />
            </div>
            {/* Silver coin (overlapping) */}
            <div className="relative -ml-3">
              <div className="absolute inset-0 bg-gray-300/30 rounded-full blur-md" aria-hidden="true" />
              <img 
                src="/coin-tails.png" 
                alt="" 
                className="relative w-9 h-9 rounded-full shadow-lg shadow-gray-400/30"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black leading-tight tracking-wide uppercase">
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(250,204,21,0.4)]">
                {APP_NAME}
              </span>
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">3 Free Plays Daily</p>
          </div>
        </div>

        {/* Right side: Network + Theme toggle */}
        <div className="flex items-center gap-2">
          {/* Network indicator (only when connected) */}
          {isConnected && chain && (
            <div 
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                ${isSupported 
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' 
                  : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                }
              `}
              role="status"
              aria-label={`Connected to ${networkName}`}
            >
              <span 
                className={`w-2 h-2 rounded-full ${isSupported ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'}`}
                aria-hidden="true"
              />
              <span>{networkName}</span>
              {!isSupported && <span className="text-yellow-300">⚠️</span>}
            </div>
          )}
          
          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
