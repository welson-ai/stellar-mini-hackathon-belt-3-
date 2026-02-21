import { WalletState } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function BalanceCard({ 
  walletState, 
  onRefresh, 
  onFund, 
  isLoading, 
  lastUpdated 
}: {
  walletState: WalletState;
  onRefresh: () => void;
  onFund: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
}) {
  const copyAddress = () => {
    navigator.clipboard.writeText(walletState.address);
  };

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 8)}...${addr.slice(-8)}`;

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Your Balance</h3>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-blue-400">
          {walletState.balance} <span className="text-xl text-gray-400">XLM</span>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Address:</span>
          <button
            onClick={copyAddress}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            title="Click to copy"
          >
            {truncateAddress(walletState.address)}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-green-400">TESTNET</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          Refresh Balance
        </button>
        <button
          onClick={onFund}
          disabled={isLoading}
          className="flex-1 bg-green-800 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          Fund with Friendbot
        </button>
      </div>

      {lastUpdated && (
        <div className="text-xs text-gray-500 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
