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
        {/* App branding - Premium style */}
        <div className="flex items-center gap-3">
          {/* Coin icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-lg" aria-hidden="true" />
            <img 
              src="/coin-heads.png" 
              alt="" 
              className="relative w-10 h-10 rounded-full shadow-lg shadow-yellow-500/20"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="text-xl font-black leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                {APP_NAME}
              </span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{APP_TAGLINE}</p>
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
