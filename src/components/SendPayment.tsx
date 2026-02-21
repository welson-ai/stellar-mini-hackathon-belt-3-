import { useState, useEffect } from 'react';
import { SendPaymentParams } from '@/types';
import { isValidAddress } from '@/lib/stellar';
import LoadingSpinner from './LoadingSpinner';

export default function SendPayment({ 
  onSend, 
  isSending, 
  walletAddress 
}: {
  onSend: (params: SendPaymentParams) => Promise<string>;
  isSending: boolean;
  walletAddress: string;
}) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isValidDest, setIsValidDest] = useState<boolean | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (destination === '') {
      setIsValidDest(null);
      return;
    }
    setIsValidDest(isValidAddress(destination));
  }, [destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidDest || !amount) return;

    try {
      setError(null);
      setSuccess(null);
      const hash = await onSend({ destination, amount, memo });
      setSuccess(hash);
      setDestination('');
      setAmount('');
      setMemo('');
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    }
  };

  const getProgressStep = () => {
    if (success) return 3;
    if (isSending) return 2;
    return 1;
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Send Payment</h3>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
            getProgressStep() >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            1
          </div>
          <span className={`text-sm ${getProgressStep() >= 1 ? 'text-white' : 'text-gray-400'}`}>
            Sign
          </span>
        </div>
        <div className="flex-1 h-1 bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
            getProgressStep() >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            2
          </div>
          <span className={`text-sm ${getProgressStep() >= 2 ? 'text-white' : 'text-gray-400'}`}>
            Submit
          </span>
        </div>
        <div className="flex-1 h-1 bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
            getProgressStep() >= 3 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            3
          </div>
          <span className={`text-sm ${getProgressStep() >= 3 ? 'text-white' : 'text-gray-400'}`}>
            Confirmed
          </span>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-900/40 border border-green-700 rounded-lg text-green-300 text-sm">
          ✅ Payment sent! 
          <a 
            href={`https://stellar.expert/explorer/testnet/tx/${success}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 text-blue-400 hover:text-blue-300 underline"
          >
            View transaction →
          </a>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Destination Address</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isValidDest === true ? 'border border-green-500' : 
              isValidDest === false ? 'border border-red-500' : 
              'border border-gray-700'
            }`}
            placeholder="G..."
            disabled={isSending}
          />
          {isValidDest === false && (
            <p className="text-xs text-red-400 mt-1">Invalid Stellar address</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount (XLM)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.1"
            min="0.0000001"
            step="0.0000001"
            disabled={isSending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Memo (optional)</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Payment memo"
            disabled={isSending}
          />
        </div>

        <button
          type="submit"
          disabled={!isValidDest || !amount || isSending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <LoadingSpinner size="sm" />
              Sending...
            </>
          ) : (
            'Send Payment'
          )}
        </button>
      </form>
    </div>
  );
}
