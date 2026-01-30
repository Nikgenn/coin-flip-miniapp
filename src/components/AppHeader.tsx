'use client';

import { useAccount } from 'wagmi';
import { isSupportedChain, SUPPORTED_CHAIN_ID } from '@/config/contract';
import { APP_NAME, APP_TAGLINE } from '@/config/app';

/**
 * AppHeader - Displays app branding and network context
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
    <header className="w-full px-4 pt-4 pb-2">
      <div className="max-w-[480px] mx-auto flex items-center justify-between">
        {/* App branding */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🪙</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">{APP_TAGLINE}</p>
          </div>
        </div>

        {/* Network indicator (only when connected) */}
        {isConnected && chain && (
          <div 
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
              ${isSupported 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }
            `}
            role="status"
            aria-label={`Connected to ${networkName}`}
          >
            <span 
              className={`w-1.5 h-1.5 rounded-full ${isSupported ? 'bg-blue-400' : 'bg-yellow-400'}`}
              aria-hidden="true"
            />
            <span>{networkName}</span>
            {!isSupported && <span className="text-yellow-300">⚠️</span>}
          </div>
        )}
      </div>
    </header>
  );
}
