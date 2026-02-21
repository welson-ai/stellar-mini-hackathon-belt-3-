import { Transaction } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function TransactionHistory({ 
  transactions, 
  txLoading, 
  onRefresh 
}: {
  transactions: Transaction[];
  txLoading: boolean;
  onRefresh: () => void;
}) {
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-20 h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="w-16 h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const truncateAddress = (addr?: string) => 
    addr ? `${addr.slice(0, 8)}...${addr.slice(-8)}` : '';

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button
          onClick={onRefresh}
          disabled={txLoading}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {txLoading ? <LoadingSpinner size="sm" /> : null}
          Refresh
        </button>
      </div>

      {txLoading ? (
        <LoadingSkeleton />
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-400">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    tx.type === 'sent' ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'
                  }`}>
                    {tx.type === 'sent' ? '↑' : '↓'}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {tx.amount} {tx.asset}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tx.type === 'sent' ? 'To: ' : 'From: '}
                      {truncateAddress(tx.type === 'sent' ? tx.to : tx.from)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{tx.date}</div>
                  {tx.memo && (
                    <div className="text-xs text-gray-500 mt-1">{tx.memo}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
