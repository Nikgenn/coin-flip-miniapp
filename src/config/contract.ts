// ABI контракта CoinFlip (v2 - 3 flips per day)
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

// Chain IDs
export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// Contract addresses for each network
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  [BASE_MAINNET_CHAIN_ID]: '0x1fdE97Dff11Ff6d190cCC645a3302aaa482E4302', // Base Mainnet
  [BASE_SEPOLIA_CHAIN_ID]: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x616bFC72D71A1CdEe22cEf26c8c8dB9B0eFf230c', // Base Sepolia
};

// Default to mainnet for production
export const DEFAULT_CHAIN_ID = BASE_MAINNET_CHAIN_ID;

// Helper function to get contract address for a chain
export function getContractAddress(chainId: number): `0x${string}` | null {
  return CONTRACT_ADDRESSES[chainId] || null;
}

// Supported chain IDs
export const SUPPORTED_CHAIN_IDS = [BASE_MAINNET_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID];

// Check if chain is supported
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

// Legacy exports for backward compatibility
export const COINFLIP_ADDRESS = CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID];
export const CHAIN_ID = DEFAULT_CHAIN_ID;

// Количество бесплатных флипов в день
export const DAILY_FREE_FLIPS = 3;
