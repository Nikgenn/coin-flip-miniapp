# 🪙 Coin Flip — Base Mini App

**Onchain coin flip game on Base. 3 free flips per day. No real money — just fun!**

## 🌐 Live URL

**Production:** https://coin-flip-miniapp-ten.vercel.app

## ✨ Features

- ✅ **3 free flips per day** per wallet
- ✅ **Onchain game** — every flip is recorded on Base
- ✅ **Gas sponsorship** — free transactions with Coinbase Wallet
- ✅ **Leaderboard** — compete with other players
- ✅ **Stats tracking** — wins, streaks, win rate
- ✅ **Confetti celebration** on wins 🎊
- ✅ **Share results** — X, Warpcast, or clipboard
- ✅ **Mobile-first** responsive design

## 🔗 Network

| Network | Chain ID | Status |
|---------|----------|--------|
| **Base Mainnet** | 8453 | ✅ Active |

## 📜 Smart Contract

| Network | Address | Explorer |
|---------|---------|----------|
| Base Mainnet | `0x1fdE97Dff11Ff6d190cCC645a3302aaa482E4302` | [View on Basescan](https://basescan.org/address/0x1fdE97Dff11Ff6d190cCC645a3302aaa482E4302#code) |

### Key Functions

```solidity
function flip(bool chooseHeads) external returns (bool won);
function getFlipsRemaining(address player) external view returns (uint256);
function getLeaderboard(uint256 limit) external view returns (...);
```

## ⛽ Gas Sponsorship

This app supports **gasless transactions** via CDP Paymaster.

### How It Works

1. App detects if wallet supports `paymasterService` capability
2. **Coinbase Wallet (Smart Wallet)**: Gas is sponsored — user pays $0
3. **Other wallets (MetaMask, etc.)**: User pays gas (~$0.001)

### UI Indicators

- **"Gas sponsored"** badge = Transactions are free
- **"Gas required"** badge = User pays gas
- Button shows **"Flip (Free Gas!)"** when sponsored

### Fallback Behavior

If sponsorship fails (paymaster error, network issue):
- App automatically falls back to regular transaction
- User sees clear error message
- No funds are lost

## 🔗 Indexing & Discoverability

| Asset | Path |
|-------|------|
| Farcaster Manifest | `/.well-known/farcaster.json` |
| OG Image | `/og.png` (1200×630) |
| App Icon | `/icon.png` (512×512) |
| Splash | `/splash.png` |
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Blockchain:** Solidity 0.8.24, Hardhat
- **Web3:** wagmi, viem, wagmi/experimental
- **Sponsorship:** CDP Paymaster (ERC-7677)
- **Hosting:** Vercel

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
```

Environment variables:

```env
# Required
NEXT_PUBLIC_APP_URL=http://localhost:3000

# RPC (optional — defaults to public endpoint)
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org

# Gas Sponsorship (optional)
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY

# Deployment
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_api_key_here
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy contract (optional)

```bash
npm run compile
npx hardhat run scripts/deploy.js --network baseMainnet
```

## 📁 Project Structure

```
coin-flip-miniapp/
├── contracts/
│   └── CoinFlip.sol           # Smart contract
├── src/
│   ├── app/                   # Next.js app router
│   ├── components/            # React components
│   │   ├── AppHeader.tsx      # App branding & network
│   │   ├── CoinFlipGame.tsx   # Main game logic + sponsorship
│   │   └── ...
│   ├── config/
│   │   ├── app.ts             # App identity
│   │   ├── contract.ts        # Contract ABI & address
│   │   ├── paymaster.ts       # Paymaster config
│   │   └── wagmi.ts           # Wagmi configuration
│   └── lib/
│       └── tx.ts              # Transaction layer
├── public/
│   ├── .well-known/
│   │   └── farcaster.json     # Farcaster manifest
│   ├── og.png                 # OpenGraph image
│   └── icon.png               # App icon
└── hardhat.config.js
```

## ⚠️ Disclaimer

- **Entertainment only** — this is a game, not gambling
- **Pseudo-random** — uses block data for randomness (not Chainlink VRF)
- **No real stakes** — play for fun, not profit
- For production with real stakes, use [Chainlink VRF](https://docs.chain.link/vrf)

## 📋 Checklist

- [x] Contract deployed to Base Mainnet
- [x] Contract verified on Basescan
- [x] Gas sponsorship configured
- [x] Farcaster manifest validated
- [x] OG tags configured
- [ ] Mobile tested in Coinbase Wallet

## 📚 Resources

- [Base Mini App Docs](https://docs.base.org/builderkits/minikit/overview)
- [CDP Paymaster Docs](https://docs.cdp.coinbase.com/paymaster/introduction/welcome)
- [wagmi Docs](https://wagmi.sh)
- [Base Explorer](https://basescan.org)

## 📄 License

MIT
