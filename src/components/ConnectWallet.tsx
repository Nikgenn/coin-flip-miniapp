'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/Button';
import { WalletModal } from './WalletModal';
import { CHAIN_ID } from '@/config/contract';

// UX Decision: Single connect button that opens modal with wallet options
// Cleaner UI, less overwhelming for new users

export function ConnectWallet() {
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected && address) {
    const isCorrectNetwork = chain?.id === CHAIN_ID;
    
    return (
      <div className="flex items-center gap-2">
        {/* Network indicator */}
        <div 
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm
            ${isCorrectNetwork 
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }
          `}
          aria-label={isCorrectNetwork ? 'Connected to Base' : `Connected to ${chain?.name || 'Unknown network'}`}
        >
          <span 
            className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-blue-400' : 'bg-yellow-400'}`}
            aria-hidden="true"
          />
          <span className="font-medium">
            {isCorrectNetwork ? 'Base' : chain?.name || 'Wrong'}
          </span>
        </div>

        {/* Address display */}
        <div
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm
            bg-white/5 border border-white/10
          "
        >
          <span className="text-gray-300 font-mono">
            {formatAddress(address)}
          </span>
        </div>

        {/* Disconnect button */}
        <button
          onClick={() => disconnect()}
          className="
            p-2 rounded-xl text-sm
            bg-white/5 hover:bg-red-500/20 
            border border-white/10 hover:border-red-500/30
            text-gray-400 hover:text-red-400
            transition-all duration-200
          "
          aria-label="Disconnect wallet"
          title="Disconnect"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  // Disconnected state - single button that opens modal
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="lg"
        className="w-full max-w-xs"
        aria-label="Connect your crypto wallet"
      >
        🔗 Connect Wallet
      </Button>
      
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

// Compact address display component for use in other places
export function WalletAddress({ address }: { address: string }) {
  return (
    <span className="font-mono text-gray-400">
      {formatAddress(address)}
    </span>
  );
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
