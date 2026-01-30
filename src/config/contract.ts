// ABI контракта CoinFlip (v2 - 3 flips per day)
// ⚠️ НЕ ИЗМЕНЯТЬ ABI — это интерфейс контракта
export const COINFLIP_ABI = [
  {
    "inputs": [{ "internalType": "bool", "name": "chooseHeads", "type": "bool" }],
    "name": "flip",
    "outputs": [{ "internalType": "bool", "name": "won", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
    "name": "canFlipToday",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
    "name": "getFlipsRemaining",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
    "name": "getPlayerStats",
    "outputs": [
      { "internalType": "uint256", "name": "totalFlips", "type": "uint256" },
      { "internalType": "uint256", "name": "totalWins", "type": "uint256" },
      { "internalType": "uint256", "name": "currentStreak", "type": "uint256" },
      { "internalType": "uint256", "name": "bestStreak", "type": "uint256" },
      { "internalType": "bool", "name": "canFlip", "type": "bool" },
      { "internalType": "uint256", "name": "flipsRemaining", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
    "name": "getWinRate",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalGlobalFlips",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalGlobalWins",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DAILY_FREE_FLIPS",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalPlayers",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "limit", "type": "uint256" }],
    "name": "getLeaderboard",
    "outputs": [
      { "internalType": "address[]", "name": "addresses", "type": "address[]" },
      { "internalType": "uint256[]", "name": "wins", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "flips", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "streaks", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "chosenHeads", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "result", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "won", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "totalFlips", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalWins", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "currentStreak", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "flipsRemaining", "type": "uint256" }
    ],
    "name": "CoinFlipped",
    "type": "event"
  }
] as const;

// =============================================================================
// CHAIN CONFIGURATION — MAINNET-ONLY (user-facing)
// =============================================================================

/** Primary supported chain — Base Mainnet */
export const SUPPORTED_CHAIN_ID = 8453;

/** Legacy chain IDs (kept for backward compatibility, hidden from users) */
export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532; // Legacy/dev only

// =============================================================================
// CONTRACT ADDRESSES
// =============================================================================

/** Contract addresses by chainId */
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  [BASE_MAINNET_CHAIN_ID]: '0x1fdE97Dff11Ff6d190cCC645a3302aaa482E4302',
  // Legacy Sepolia address (hidden from users, for dev/testing only)
  [BASE_SEPOLIA_CHAIN_ID]: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x616bFC72D71A1CdEe22cEf26c8c8dB9B0eFf230c',
};

/** Default chain for production */
export const DEFAULT_CHAIN_ID = SUPPORTED_CHAIN_ID;

/**
 * Get contract address for a chain
 * @param chainId - defaults to SUPPORTED_CHAIN_ID (mainnet)
 */
export function getContractAddress(chainId: number = SUPPORTED_CHAIN_ID): `0x${string}` | null {
  const address = CONTRACT_ADDRESSES[chainId];
  
  // Runtime guard for mainnet
  if (chainId === SUPPORTED_CHAIN_ID && (!address || address.startsWith('0x0'))) {
    console.warn('[contract] Base Mainnet contract address not configured');
    return null;
  }
  
  return address || null;
}

// =============================================================================
// CHAIN HELPERS
// =============================================================================

/** User-facing supported chain IDs (mainnet only) */
export const SUPPORTED_CHAIN_IDS = [SUPPORTED_CHAIN_ID];

/** Legacy: all known chain IDs (for internal/dev use) */
export const ALL_CHAIN_IDS = [BASE_MAINNET_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID];

/**
 * Check if chain is supported for users (mainnet only)
 */
export function isSupportedChain(chainId: number): boolean {
  return chainId === SUPPORTED_CHAIN_ID;
}

/**
 * Check if chain is known (mainnet or legacy sepolia)
 * For internal/dev use only
 */
export function isKnownChain(chainId: number): boolean {
  return ALL_CHAIN_IDS.includes(chainId);
}

// =============================================================================
// EXPLORER HELPERS
// =============================================================================

/**
 * Get Basescan transaction URL
 */
export function getBasescanTxUrl(txHash: string, chainId: number = SUPPORTED_CHAIN_ID): string {
  const baseUrl = chainId === BASE_SEPOLIA_CHAIN_ID 
    ? 'https://sepolia.basescan.org' 
    : 'https://basescan.org';
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get Basescan address URL
 */
export function getBasescanAddressUrl(address: string, chainId: number = SUPPORTED_CHAIN_ID): string {
  const baseUrl = chainId === BASE_SEPOLIA_CHAIN_ID 
    ? 'https://sepolia.basescan.org' 
    : 'https://basescan.org';
  return `${baseUrl}/address/${address}`;
}

// =============================================================================
// LEGACY EXPORTS (backward compatibility)
// =============================================================================

export const COINFLIP_ADDRESS = CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID];
export const CHAIN_ID = DEFAULT_CHAIN_ID;

// =============================================================================
// GAME CONSTANTS
// =============================================================================

export const DAILY_FREE_FLIPS = 3;
