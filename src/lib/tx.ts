/**
 * Transaction Layer — Centralized transaction sending
 * 
 * This module provides a single point for all game transactions,
 * with support for gas sponsorship via CDP Paymaster.
 * 
 * MODES:
 * - 'regular': Standard transaction (user pays gas)
 * - 'sponsored': Gasless via paymaster (if wallet supports it)
 */

import { COINFLIP_ABI, SUPPORTED_CHAIN_ID, getContractAddress } from '@/config/contract';
import { isPaymasterConfigured, getPaymasterCapabilities, walletSupportsPaymaster } from '@/config/paymaster';

// =============================================================================
// TYPES
// =============================================================================

/** Transaction mode */
export type TxMode = 'regular' | 'sponsored';

/** Parameters for game transactions */
export interface GameTxParams {
  /** Transaction mode (default: 'regular') */
  mode?: TxMode;
  /** Chain ID (default: SUPPORTED_CHAIN_ID) */
  chainId?: number;
  /** Player's choice: true = heads, false = tails */
  chooseHeads: boolean;
}

/** Result from preparing a transaction for regular writeContract */
export interface PreparedGameTx {
  address: `0x${string}`;
  abi: typeof COINFLIP_ABI;
  functionName: 'flip';
  args: [boolean];
  chainId: number;
}

/** Contract call for writeContracts (sponsored mode) */
export interface ContractCall {
  address: `0x${string}`;
  abi: typeof COINFLIP_ABI;
  functionName: 'flip';
  args: [boolean];
}

/** Result from preparing a sponsored transaction for writeContracts */
export interface PreparedSponsoredTx {
  contracts: ContractCall[];
  capabilities: Record<number, { paymasterService?: { url: string } }>;
  chainId: number;
}

// =============================================================================
// TRANSACTION HELPERS
// =============================================================================

/**
 * Prepare game transaction for regular wagmi writeContract
 * 
 * @example
 * const txParams = prepareGameTx({ chooseHeads: true });
 * writeContract(txParams);
 */
export function prepareGameTx(params: GameTxParams): PreparedGameTx | null {
  const { chainId = SUPPORTED_CHAIN_ID, chooseHeads } = params;
  
  const contractAddress = getContractAddress(chainId);
  
  if (!contractAddress) {
    console.error('[tx] Contract address not available for chain:', chainId);
    return null;
  }
  
  return {
    address: contractAddress,
    abi: COINFLIP_ABI,
    functionName: 'flip',
    args: [chooseHeads],
    chainId,
  };
}

/**
 * Prepare game transaction for sponsored mode (writeContracts)
 * 
 * Uses CDP Paymaster for gasless transactions.
 * Only works with Smart Wallet (Coinbase Wallet).
 * 
 * @example
 * const txParams = prepareSponsoredGameTx({ chooseHeads: true });
 * writeContracts(txParams);
 */
export function prepareSponsoredGameTx(params: GameTxParams): PreparedSponsoredTx | null {
  const { chainId = SUPPORTED_CHAIN_ID, chooseHeads } = params;
  
  const contractAddress = getContractAddress(chainId);
  
  if (!contractAddress) {
    console.error('[tx] Contract address not available for chain:', chainId);
    return null;
  }
  
  if (!isPaymasterConfigured()) {
    console.warn('[tx] Paymaster URL not configured');
    return null;
  }
  
  return {
    contracts: [{
      address: contractAddress,
      abi: COINFLIP_ABI,
      functionName: 'flip',
      args: [chooseHeads],
    }],
    capabilities: getPaymasterCapabilities(chainId),
    chainId,
  };
}

// =============================================================================
// SPONSORSHIP CHECKS
// =============================================================================

/**
 * Check if sponsorship is available
 * 
 * Requires:
 * 1. Paymaster URL configured in env
 * 2. Wallet supports paymasterService capability (Smart Wallet)
 * 
 * @param walletCapabilities - Result from useCapabilities hook
 */
export function isSponsorshipAvailable(
  walletCapabilities?: Record<number, Record<string, { supported?: boolean }>>
): boolean {
  // Check if paymaster URL is configured
  if (!isPaymasterConfigured()) {
    return false;
  }
  
  // Check if wallet supports paymaster
  if (!walletSupportsPaymaster(walletCapabilities)) {
    return false;
  }
  
  return true;
}

/**
 * Get recommended transaction mode based on wallet capabilities
 * 
 * @param walletCapabilities - Result from useCapabilities hook
 */
export function getRecommendedTxMode(
  walletCapabilities?: Record<number, Record<string, { supported?: boolean }>>
): TxMode {
  return isSponsorshipAvailable(walletCapabilities) ? 'sponsored' : 'regular';
}

/**
 * Get human-readable sponsorship status
 */
export function getSponsorshipStatus(
  walletCapabilities?: Record<number, Record<string, { supported?: boolean }>>
): { available: boolean; reason: string } {
  if (!isPaymasterConfigured()) {
    return { 
      available: false, 
      reason: 'Gas sponsorship not configured by app' 
    };
  }
  
  if (!walletSupportsPaymaster(walletCapabilities)) {
    return { 
      available: false, 
      reason: 'Your wallet does not support gasless transactions. Use Coinbase Wallet (Smart Wallet) for free gas.' 
    };
  }
  
  return { 
    available: true, 
    reason: 'Gas sponsored — free to play!' 
  };
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export { isPaymasterConfigured, getPaymasterCapabilities } from '@/config/paymaster';
