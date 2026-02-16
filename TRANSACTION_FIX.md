# Исправление проблем с транзакциями

## Проблемы, которые были найдены:

### 1. ❌ Paymaster не настроен
**Проблема**: Газлесс-транзакции не работают, потому что `NEXT_PUBLIC_PAYMASTER_URL` закомментирован в `.env`

**Решение**:
1. Перейдите на [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/bundler-and-paymaster)
2. Создайте новый Paymaster для Base Mainnet
3. Добавьте в whitelist адрес контракта: `0x1fdE97Dff11Ff6d190cCC645a3302aaa482E4302`
4. Скопируйте Paymaster URL и добавьте в `.env`:
```env
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY
```

### 2. ✅ ИСПРАВЛЕНО: Отсутствие таймаутов
**Проблема**: Транзакции могли зависать бесконечно без обратной связи пользователю

**Что исправлено**:
- Добавлен 2-минутный таймаут для `useWaitForTransactionReceipt`
- Добавлен лимит retry (120 попыток) для `useCallsStatus` 
- Добавлен автоматический таймаут-хендлер, который показывает ошибку если транзакция подтверждается >2 минут
- Улучшена обработка ошибок для receipt errors

### 3. ✅ ИСПРАВЛЕНО: Форматирование в index.ts
**Проблема**: Отсутствовали переносы строк между exports, что могло вызывать проблемы с импортами

**Что исправлено**: Добавлены правильные переносы строк между группами exports

## Рекомендации для тестирования:

### В браузере:
1. Откройте DevTools (F12)
2. Перейдите на вкладку Console
3. Следите за логами с префиксом `[CoinFlip]` и `[tx]`
4. При ошибке транзакции проверьте полное сообщение

### В Base App (мобильное приложение):
1. Убедитесь, что используете Coinbase Smart Wallet
2. Проверьте баланс ETH (если paymaster не настроен, нужен ETH для газа)
3. Проверьте сеть - должна быть Base Mainnet (Chain ID: 8453)

## Возможные причины зависания транзакций:

### 1. Недостаточно газа
- **Симптом**: Транзакция отправлена, но не подтверждается
- **Решение**: Убедитесь что на кошельке есть ETH для газа (~0.001 ETH)

### 2. RPC endpoint медленный
- **Симптом**: Долгое ожидание после отправки транзакции
- **Решение**: Используйте платный RPC (Alchemy, Infura, QuickNode)
```env
NEXT_PUBLIC_BASE_RPC=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### 3. Контракт не allowlisted в Paymaster
- **Симптом**: Ошибка "Gas sponsorship failed"
- **Решение**: Добавьте адрес контракта в whitelist в CDP Portal

### 4. Nonce collision
- **Симптом**: Транзакция зависает с "pending"
- **Решение**: Отмените pending транзакции в кошельке или подождите

### 5. Низкий gas price
- **Симптом**: Транзакция долго в mempool
- **Решение**: Wagmi автоматически устанавливает gas price, но можно увеличить multiplier

## Дополнительные улучшения (опционально):

### Добавить retry logic для failed transactions:
```typescript
// В CoinFlipGame.tsx можно добавить автоматический retry
const MAX_RETRIES = 3;
const [retryCount, setRetryCount] = useState(0);

// При ошибке:
if (error && retryCount < MAX_RETRIES) {
  setTimeout(() => {
    setRetryCount(prev => prev + 1);
    handleFlip(); // Повторить попытку
  }, 2000);
}
```

### Показывать ссылку на Basescan для pending транзакций:
```typescript
// Уже реализовано! При клике на результат показывается ссылка на Basescan
```

## Проверка статуса после исправлений:

1. ✅ Форматирование exports исправлено
2. ✅ Добавлены таймауты для транзакций
3. ✅ Улучшена обработка ошибок
4. ⚠️ Требуется настроить Paymaster URL для газлесс-транзакций
5. ⚠️ Рекомендуется использовать платный RPC для лучшей производительности

## Контакты для поддержки:

- Base Discord: https://discord.gg/buildonbase
- CDP Documentation: https://docs.cdp.coinbase.com
- Basescan: https://basescan.org
