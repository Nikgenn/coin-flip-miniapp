'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { connectors, connect, isPending } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm text-gray-400">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Фильтруем уникальные коннекторы по имени
  const uniqueConnectors = connectors.filter((connector, index, self) =>
    index === self.findIndex((c) => c.name === connector.name)
  );

  return (
    <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
      {uniqueConnectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
            connector.name.includes('MetaMask') || connector.name.includes('Rabby')
              ? 'bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white'
              : 'bg-base-blue hover:bg-blue-600 text-white'
          }`}
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {connector.name.includes('Coinbase') ? '💙 ' : '🔗 '}
              {connector.name}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
