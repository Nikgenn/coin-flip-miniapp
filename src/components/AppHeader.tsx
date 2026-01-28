'use client';

import { useAccount } from 'wagmi';
import { CHAIN_ID } from '@/config/contract';
import { APP_NAME, APP_TAGLINE } from '@/config/app';

/**
 * AppHeader - Displays app branding and network context
 * Shows current network status for connected users
 */
export function AppHeader() {
  const { isConnected, chain } = useAccount();
  
  const networkName = chain?.id === CHAIN_ID 
    ? 'Base Sepolia' 
    : chain?.id === 8453 
      ? 'Base' 
      : chain?.name;

  const isCorrectNetwork = chain?.id === CHAIN_ID;

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
              ${isCorrectNetwork 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }
            `}
            role="status"
            aria-label={`Connected to ${networkName}`}
          >
            <span 
              className={`w-1.5 h-1.5 rounded-full ${isCorrectNetwork ? 'bg-blue-400' : 'bg-yellow-400'}`}
              aria-hidden="true"
            />
            <span>{networkName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
