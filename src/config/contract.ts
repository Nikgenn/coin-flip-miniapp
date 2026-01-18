// ABI контракта CoinFlip
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
    "name": "getPlayerStats",
    "outputs": [
      { "internalType": "uint256", "name": "totalFlips", "type": "uint256" },
      { "internalType": "uint256", "name": "totalWins", "type": "uint256" },
      { "internalType": "uint256", "name": "currentStreak", "type": "uint256" },
      { "internalType": "uint256", "name": "bestStreak", "type": "uint256" },
      { "internalType": "bool", "name": "canFlip", "type": "bool" }
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
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "chosenHeads", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "result", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "won", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "totalFlips", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalWins", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "currentStreak", "type": "uint256" }
    ],
    "name": "CoinFlipped",
    "type": "event"
  }
] as const;

// Адрес контракта (заполнить после деплоя)
export const COINFLIP_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// Chain ID для Base Sepolia
export const CHAIN_ID = 84532;
