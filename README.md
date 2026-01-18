# 🪙 Coin Flip - Base Mini App

Простое и социальное приложение для подбрасывания монетки на Base. Без реальных ставок - просто веселье onchain!

## Возможности

- ✅ 1 бесплатный бросок в день на кошелёк
- ✅ Статистика: всего бросков, побед, текущая серия
- ✅ Onchain события для каждого броска
- ✅ Мобильный интерфейс
- ✅ Интеграция с Base Smart Wallet

## Технологии

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Blockchain**: Solidity 0.8.24, Hardhat
- **Web3**: wagmi, viem, OnchainKit
- **Network**: Base Sepolia (тест), Base Mainnet (прод)

## Быстрый старт

### 1. Установка зависимостей

```bash
cd coin-flip-miniapp
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env` и заполните:

```bash
copy .env.example .env
```

Отредактируйте `.env`:

```env
# Base Sepolia RPC (можно оставить по умолчанию)
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org

# Приватный ключ для деплоя (НЕ КОММИТИТЬ!)
PRIVATE_KEY=your_private_key_here

# После деплоя контракта заполните этот адрес
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Опционально: для верификации на Basescan
BASESCAN_API_KEY=
```

### 3. Получение тестовых ETH

Для деплоя на Base Sepolia нужны тестовые ETH:

1. Перейдите на [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Или используйте [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)

### 4. Деплой смарт-контракта

```bash
# Компиляция
npm run compile

# Деплой на Base Sepolia
npm run deploy
```

После деплоя скопируйте адрес контракта в `.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234...
```

### 5. Запуск приложения

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Деплой на Vercel

### 1. Push в GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/coin-flip-miniapp.git
git push -u origin main
```

### 2. Импорт в Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте репозиторий
4. Добавьте Environment Variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = адрес вашего контракта
   - `NEXT_PUBLIC_BASE_SEPOLIA_RPC` = https://sepolia.base.org

### 3. Настройка манифеста Farcaster

После деплоя обновите `public/.well-known/farcaster.json`:

1. Замените `your-domain.com` на ваш домен Vercel
2. Создайте accountAssociation через [Warpcast Developer Tools](https://warpcast.com/~/developers)
3. Загрузите иконки в `public/`:
   - `icon.png` (200x200)
   - `og-image.png` (1200x630)
   - `splash.png` (200x200)

## Структура проекта

```
coin-flip-miniapp/
├── contracts/
│   └── CoinFlip.sol          # Смарт-контракт
├── scripts/
│   └── deploy.js             # Скрипт деплоя
├── src/
│   ├── app/
│   │   ├── api/webhook/      # Webhook для Farcaster
│   │   ├── globals.css       # Глобальные стили
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Главная страница
│   ├── components/
│   │   ├── CoinFlipGame.tsx  # Игровой компонент
│   │   ├── ConnectWallet.tsx # Подключение кошелька
│   │   ├── PlayerStats.tsx   # Статистика игрока
│   │   └── Providers.tsx     # React providers
│   └── config/
│       ├── contract.ts       # ABI и адрес контракта
│       └── wagmi.ts          # Конфигурация wagmi
├── public/
│   ├── .well-known/
│   │   └── farcaster.json    # Манифест Farcaster
│   └── manifest.json         # PWA манифест
├── hardhat.config.js         # Конфигурация Hardhat
└── package.json
```

## Смарт-контракт

### Основные функции

```solidity
// Бросок монеты (1 раз в день)
function flip(bool chooseHeads) external returns (bool won);

// Проверка доступности броска
function canFlipToday(address player) external view returns (bool);

// Получение статистики игрока
function getPlayerStats(address player) external view returns (
    uint256 totalFlips,
    uint256 totalWins,
    uint256 currentStreak,
    uint256 bestStreak,
    bool canFlip
);
```

### События

```solidity
event CoinFlipped(
    address indexed player,
    bool chosenHeads,    // Выбор игрока
    bool result,         // Результат броска
    bool won,            // Победа
    uint256 totalFlips,
    uint256 totalWins,
    uint256 currentStreak
);
```

## Безопасность

⚠️ **Важно**: Псевдослучайность в контракте НЕ подходит для реальных ставок!

Для продакшена с реальными деньгами используйте:
- [Chainlink VRF](https://docs.chain.link/vrf)
- [Gelato VRF](https://docs.gelato.network/web3-services/vrf)

## Лицензия

MIT

## Ссылки

- [Base Mini App Docs](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit](https://onchainkit.xyz)
- [wagmi Docs](https://wagmi.sh)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
