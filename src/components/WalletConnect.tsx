import LoadingSpinner from './LoadingSpinner';

export default function WalletConnect({ onConnect, isLoading, error }: {
  onConnect: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-auto text-center">
      <div className="text-6xl mb-4">💫</div>
      <h2 className="text-2xl font-bold mb-2">Stellar Wallet</h2>
      <p className="text-gray-400 mb-6">
        Connect your Freighter wallet to manage XLM on the Stellar testnet. 
        Send payments, check balance, and view transaction history.
      </p>
      
      <button
        onClick={onConnect}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            Connecting...
          </>
        ) : (
          'Connect Freighter Wallet'
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
          {error.includes('not found') && (
            <a 
              href="https://freighter.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2 text-blue-400 hover:text-blue-300 underline"
            >
              Install Freighter →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
