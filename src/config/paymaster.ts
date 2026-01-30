/**
 * Paymaster Configuration
 * 
 * Gas sponsorship via CDP Paymaster (ERC-7677)
 * Only works with Smart Wallet (Coinbase Wallet in smart mode)
 */

import { SUPPORTED_CHAIN_ID } from './contract';

// =============================================================================
// PAYMASTER CONFIG
// =============================================================================

/**
 * Get Paymaster URL from environment
 * 
 * Set NEXT_PUBLIC_PAYMASTER_URL in .env to enable sponsorship
 * Get your URL from: https://portal.cdp.coinbase.com/products/bundler-and-paymaster
 */
export function getPaymasterUrl(): string | null {
  return process.env.NEXT_PUBLIC_PAYMASTER_URL || null;
}

/**
 * Check if paymaster is configured
 */
export function isPaymasterConfigured(): boolean {
  const url = getPaymasterUrl();
  return !!url && url.length > 0;
}

/**
 * Build paymaster service capability object for wagmi
 * 
 * @returns Capabilities object for useWriteContracts, or empty object if not configured
 */
export function getPaymasterCapabilities(chainId: number = SUPPORTED_CHAIN_ID): Record<number, { paymasterService?: { url: string } }> {
  const url = getPaymasterUrl();
  
  if (!url) {
    return {};
  }
  
  return {
    [chainId]: {
      paymasterService: {
        url,
      },
    },
  };
}

/**
 * Check if a wallet supports paymaster (Smart Wallet)
 * 
 * @param capabilities - Result from useCapabilities hook
 * @param chainId - Chain to check
 */
export function walletSupportsPaymaster(
  capabilities: Record<number, Record<string, { supported?: boolean }>> | undefined,
  chainId: number = SUPPORTED_CHAIN_ID
): boolean {
  if (!capabilities) return false;
  
  const chainCapabilities = capabilities[chainId];
  if (!chainCapabilities) return false;
  
  return chainCapabilities['paymasterService']?.supported === true;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** 
 * Sponsorship is only available for specific contract calls
 * Add your contract to allowlist in CDP Portal
 */
export const SPONSORSHIP_INFO = {
  provider: 'Coinbase Developer Platform',
  docsUrl: 'https://docs.cdp.coinbase.com/paymaster/introduction/welcome',
  portalUrl: 'https://portal.cdp.coinbase.com/products/bundler-and-paymaster',
} as const;
