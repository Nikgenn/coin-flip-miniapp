/**
 * Transaction Layer — Centralized transaction sending
 * 
 * This module provides a single point for all game transactions,
 * preparing for future gas sponsorship / paymaster integration.
 * 
 * CURRENT STATE: Regular wagmi transactions
 * FUTURE STATE: Can be extended for sponsored/AA transactions
 */

import { COINFLIP_ABI, SUPPORTED_CHAIN_ID, getContractAddress } from '@/config/contract';

// =============================================================================
// TYPES
// =============================================================================

/** Transaction mode — regular now, sponsored in future */
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

/** Result from preparing a transaction */
export interface PreparedGameTx {
  address: `0x${string}`;
  abi: typeof COINFLIP_ABI;
  functionName: 'flip';
  args: [boolean];
  chainId: number;
}

// =============================================================================
// TRANSACTION HELPERS
// =============================================================================

/**
 * Prepare game transaction parameters for wagmi writeContract
 * 
 * This centralizes transaction preparation for future sponsorship support.
 * Currently returns standard wagmi params; can be extended for AA/paymaster.
 * 
 * @example
 * const txParams = prepareGameTx({ chooseHeads: true });
 * writeContract(txParams);
 */
export function prepareGameTx(params: GameTxParams): PreparedGameTx | null {
  const { mode = 'regular', chainId = SUPPORTED_CHAIN_ID, chooseHeads } = params;
  
  const contractAddress = getContractAddress(chainId);
  
  if (!contractAddress) {
    console.error('[tx] Contract address not available for chain:', chainId);
    return null;
  }
  
  // TODO: When mode === 'sponsored', prepare for paymaster/AA
  // For now, both modes use regular transactions
  if (mode === 'sponsored') {
    console.info('[tx] Sponsored mode requested but not yet implemented, falling back to regular');
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
 * Check if sponsorship is available
 * 
 * Placeholder for future integration.
 * Will check paymaster balance, user eligibility, etc.
 */
export function isSponsorshipAvailable(): boolean {
  // TODO: Implement when paymaster is integrated
  // - Check paymaster contract balance
  // - Check user eligibility
  // - Check daily limits
  return false;
}

/**
 * Get recommended transaction mode
 * 
 * Returns 'sponsored' if available and beneficial, otherwise 'regular'.
 */
export function getRecommendedTxMode(): TxMode {
  return isSponsorshipAvailable() ? 'sponsored' : 'regular';
}

// =============================================================================
// FUTURE: SPONSORSHIP HOOKS (placeholder)
// =============================================================================

/**
 * Placeholder for future sponsored transaction preparation
 * 
 * When implementing paymaster/AA:
 * 1. Replace this with actual UserOperation building
 * 2. Add bundler interaction
 * 3. Add paymaster signature fetching
 */
// export async function prepareSponsoredTx(params: GameTxParams) {
//   // Future: Build UserOperation for ERC-4337
//   // Future: Get paymaster signature
//   // Future: Submit to bundler
// }
