export interface WalletState {
  address: string;
  balance: string;
  isConnected: boolean;
  network: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  asset: string;
  to?: string;
  from?: string;
  date: string;
  memo?: string;
}

export interface SendPaymentParams {
  destination: string;
  amount: string;
  memo?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
