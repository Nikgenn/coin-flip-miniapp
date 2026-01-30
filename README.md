# 🪙 Coin Flip — Base Mini App

**Onchain coin flip game on Base. 3 free flips per day. No real money — just fun!**

## 🌐 Live URL

**Production:** https://coin-flip-miniapp-ten.vercel.app

## ✨ Features

- ✅ **3 free flips per day** per wallet
- ✅ **Onchain game** — every flip is recorded on Base
- ✅ **Leaderboard** — compete with other players
- ✅ **Stats tracking** — wins, streaks, win rate
- ✅ **Confetti celebration** on wins 🎊
- ✅ **Share results** — X, Warpcast, or clipboard
- ✅ **Mobile-first** responsive design
- ✅ **Coinbase Wallet + MetaMask** support

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
- **Web3:** wagmi, viem, OnchainKit
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

# RPC (optional — defaults to public endpoints)
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org

# Legacy/dev (optional)
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=0x616bFC72D71A1CdEe22cEf26c8c8dB9B0eFf230c

# Deployment
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_api_key_here
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Mainnet (optional)

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
│   │   ├── Onboarding.tsx     # 3-step onboarding
│   │   ├── CoinFlipGame.tsx   # Main game logic
│   │   ├── ShareButton.tsx    # Social share + clipboard
│   │   └── ...
│   ├── config/
│   │   ├── app.ts             # App identity (single source)
│   │   ├── contract.ts        # Contract ABI & address
│   │   └── wagmi.ts           # Wagmi configuration
│   └── lib/
│       └── tx.ts              # Transaction layer (sponsorship-ready)
├── public/
│   ├── .well-known/
│   │   └── farcaster.json     # Farcaster manifest
│   ├── og.png                 # OpenGraph image (1200×630)
│   ├── icon.png               # App icon (512×512)
│   ├── robots.txt
│   └── sitemap.xml
└── hardhat.config.js
```

## ⛽ Gas Sponsorship

This app supports **gasless transactions** via CDP Paymaster. Users with Coinbase Wallet (Smart Wallet) can flip for free!

### How It Works

1. App checks if wallet supports `paymasterService` capability
2. If supported, transactions are sponsored (user pays $0 gas)
3. If not supported, falls back to regular transactions

### Setup (for developers)

1. **Create CDP Account**
   - Go to [Coinbase Developer Platform](https://coinbase.com/developer-platform)
   - Sign up or sign in

2. **Get Paymaster URL**
   - Navigate to [Onchain Tools > Paymaster](https://portal.cdp.coinbase.com/products/bundler-and-paymaster)
   - Select **Base** network
   - Copy the **Paymaster & Bundler endpoint**

3. **Whitelist Contract**
   - In CDP Portal, go to **Contract allowlist**
   - Add: `0x1fdE97Dff11Ff6d190cCC645a3302aaa482E4302`
   - Function: `flip`

4. **Configure Environment**
   ```env
   NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY
   ```

5. **Fund Paymaster**
   - Deposit ETH to your paymaster balance in CDP Portal

### Supported Wallets

| Wallet | Gas Sponsorship |
|--------|-----------------|
| Coinbase Wallet (Smart) | ✅ Supported |
| MetaMask | ❌ Regular tx only |
| Other Injected | ❌ Regular tx only |

### Graceful Fallback

If sponsorship fails or is unavailable:
- App automatically falls back to regular transactions
- User sees clear message about gas requirement
- No transaction is lost

## ⚠️ Disclaimer

- **Entertainment only** — this is a game, not gambling
- **Pseudo-random** — uses block data for randomness (not Chainlink VRF)
- **No real stakes** — play for fun, not profit
- For production with real stakes, use [Chainlink VRF](https://docs.chain.link/vrf)

## 📋 Submission Checklist

Before submitting to Base Mini App directory:

- [x] Contract deployed to Base Mainnet
- [x] `NEXT_PUBLIC_APP_URL` set to production URL
- [x] `/og.png` (1200×630) created
- [x] `/icon.png` (512×512) created  
- [x] `/splash.png` (512×512) created
- [x] `/.well-known/farcaster.json` validated
- [ ] OG tags verified (use [opengraph.xyz](https://opengraph.xyz))
- [ ] Mobile tested in Coinbase Wallet
- [ ] Gas sponsorship enabled (optional)

## 📚 Resources

- [Base Mini App Docs](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit](https://onchainkit.xyz)
- [wagmi Docs](https://wagmi.sh)
- [Base Explorer](https://basescan.org)

## 📄 License

MIT
