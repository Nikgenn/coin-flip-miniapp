import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

// =============================================================================
// RPC CONFIGURATION
// =============================================================================

/**
 * Get Base Mainnet RPC URL with fallback chain
 * Priority: NEXT_PUBLIC_BASE_RPC → NEXT_PUBLIC_BASE_MAINNET_RPC → default
 */
function getBaseMainnetRpcUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_RPC ||
    process.env.NEXT_PUBLIC_BASE_MAINNET_RPC ||
    'https://mainnet.base.org'
  );
}

/**
 * Get Base Sepolia RPC URL (legacy/dev fallback)
 * Priority: NEXT_PUBLIC_BASE_SEPOLIA_RPC → default
 */
function getBaseSepoliaRpcUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
}

// =============================================================================
// WAGMI CONFIG — MAINNET-FIRST
// =============================================================================

/**
 * Wagmi configuration
 * - Base Mainnet is the primary user-facing chain
 * - Base Sepolia kept as hidden fallback for dev/testing only
 */
export const config = createConfig({
  // Mainnet first — this is the default for users
  chains: [base, baseSepolia],
  connectors: [
    // Universal injected (MetaMask, Rabby, etc.)
    injected(),
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'Coin Flip',
      preference: 'all',
    }),
  ],
  transports: {
    [base.id]: http(getBaseMainnetRpcUrl()),
    [baseSepolia.id]: http(getBaseSepoliaRpcUrl()),
  },
  ssr: true,
});

// =============================================================================
// EXPORTS
// =============================================================================

// Re-export chains for convenience (components should use config constants instead)
export { base, baseSepolia };

// Export RPC helpers for potential external use
export { getBaseMainnetRpcUrl, getBaseSepoliaRpcUrl };
