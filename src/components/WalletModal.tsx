'use client';

import { useEffect, useRef } from 'react';
import { useConnect } from 'wagmi';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connect, isPending } = useConnect();
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter unique connectors
  const uniqueConnectors = connectors.filter((connector, index, self) =>
    index === self.findIndex((c) => c.name === connector.name)
  );

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleConnect = (connector: typeof connectors[0]) => {
    connect({ connector });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 id="wallet-modal-title" className="text-lg font-semibold">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 space-y-2">
          {uniqueConnectors.map((connector) => {
            const icon = getWalletIcon(connector.name);
            const colors = getWalletColors(connector.name);
            
            return (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-xl
                  transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${colors}
                `}
              >
                <span className="text-xl">{icon}</span>
                <span className="font-medium">{connector.name}</span>
                {isPending && (
                  <svg
                    className="ml-auto animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 pt-0">
          <p className="text-center text-xs text-gray-500">
            By connecting, you agree to the Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

function getWalletIcon(name: string): string {
  if (name.includes('Coinbase')) return '💙';
  if (name.includes('MetaMask')) return '🦊';
  if (name.includes('Rabby')) return '🐰';
  if (name.includes('Phantom')) return '👻';
  if (name.includes('Backpack')) return '🎒';
  return '🔗';
}

function getWalletColors(name: string): string {
  if (name.includes('Coinbase')) {
    return 'bg-blue-500 hover:bg-blue-600 text-white';
  }
  if (name.includes('MetaMask') || name.includes('Rabby')) {
    return 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white';
  }
  if (name.includes('Phantom')) {
    return 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white';
  }
  return 'bg-white/10 hover:bg-white/15 text-white border border-white/10';
}
