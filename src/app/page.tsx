'use client';
import { useWallet } from '@/hooks/useWallet';
import WalletConnect from '@/components/WalletConnect';
import BalanceCard from '@/components/BalanceCard';
import SendPayment from '@/components/SendPayment';
import TransactionHistory from '@/components/TransactionHistory';

export default function Home() {
  const wallet = useWallet();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">💫 Stellar Wallet</h1>
        {wallet.walletState.isConnected && (
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">● TESTNET</span>
            <button onClick={wallet.disconnectWallet} className="text-sm text-gray-400 hover:text-white">Disconnect</button>
          </div>
        )}
      </header>

      {wallet.error && (
        <div className="mx-6 mt-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
          {wallet.error}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!wallet.walletState.isConnected ? (
          <div className="flex items-center justify-center min-h-[70vh]">
            <WalletConnect
              onConnect={wallet.connectWallet}
              isLoading={wallet.isLoading}
              error={wallet.error}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <BalanceCard
                walletState={wallet.walletState}
                onRefresh={wallet.refreshBalance}
                onFund={wallet.fundAccount}
                isLoading={wallet.isLoading}
                lastUpdated={wallet.lastUpdated}
              />
              <SendPayment
                onSend={wallet.sendPayment}
                isSending={wallet.isSending}
                walletAddress={wallet.walletState.address}
              />
            </div>
            <TransactionHistory
              transactions={wallet.transactions}
              txLoading={wallet.txLoading}
              onRefresh={wallet.fetchTransactions}
            />
          </div>
        )}
      </div>
    </main>
  );
}
