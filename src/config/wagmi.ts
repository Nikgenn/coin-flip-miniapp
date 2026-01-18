import { http, createConfig } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

// Конфигурация для Base Mini App
export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    // Универсальный injected (MetaMask, Rabby, и другие)
    injected(),
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'Coin Flip',
      preference: 'all',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
    [base.id]: http('https://mainnet.base.org'),
  },
  ssr: true,
});

// Экспортируем chains для удобства
export { baseSepolia, base };
