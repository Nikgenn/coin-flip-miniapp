'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/Button';
import { WalletModal } from './WalletModal';
import { CHAIN_ID } from '@/config/contract';

/**
 * ConnectWallet - handles wallet connection UI
 * Base Mini App Guidelines: 
 * - CTA says "Start Playing" not "Connect Wallet"
 * - Address hidden, shown as "You" with copy option
 */

export function ConnectWallet() {
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy address to clipboard
  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

        {/* User indicator - shows "You" instead of 0x address */}
        <button
          onClick={handleCopyAddress}
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm
            bg-white/5 border border-white/10
            hover:bg-white/10 transition-colors
            cursor-pointer
          "
          title={`Click to copy: ${address}`}
          aria-label="Copy your wallet address"
        >
          <span className="text-gray-300">
            {copied ? '✓ Copied!' : '👤 You'}
          </span>
        </button>

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
          aria-label="Disconnect"
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

  // Disconnected state - "Start Playing" button
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="lg"
        className="w-full max-w-xs"
        aria-label="Start playing the coin flip game"
      >
        🎮 Start Playing
      </Button>
      
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

// Compact user indicator for use in other places
export function UserIndicator({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="font-medium text-gray-400 hover:text-gray-300 transition-colors"
      title={`Click to copy: ${address}`}
    >
      {copied ? '✓ Copied!' : 'You'}
    </button>
  );
}
