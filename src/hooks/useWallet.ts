'use client';
import { useState, useEffect, useCallback } from 'react';
import freighter from '@stellar/freighter-api';
import { WalletState, Transaction, SendPaymentParams } from '@/types';
import { getBalance, getTransactions, buildPaymentTransaction, sendPayment, fundTestAccount } from '@/lib/stellar';
import { cache } from '@/lib/cache';

const BALANCE_TTL = 30000;
const TX_TTL = 60000;

const defaultState: WalletState = {
  address: '',
  balance: '0.00',
  isConnected: false,
  network: '',
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshBalance = useCallback(async (address: string) => {
    const cacheKey = `balance_${address}`;
    const cached = cache.get<string>(cacheKey);
    if (cached) {
      setWalletState(prev => ({ ...prev, balance: cached }));
      return;
    }
    try {
      const balance = await getBalance(address);
      cache.set(cacheKey, balance, BALANCE_TTL);
      setWalletState(prev => ({ ...prev, balance }));
      setLastUpdated(new Date());
    } catch {
      setError('Failed to fetch balance');
    }
  }, []);

  const connectWallet = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const connectionResult = await freighter.isConnected();
    if (!connectionResult.isConnected) {
      throw new Error('Freighter wallet not found. Please install it.');
    }

    const addressResult = await freighter.getAddress();
    console.log('Freighter address result:', addressResult); // debug log

    if (!addressResult || !addressResult.address) {
      throw new Error('Could not get wallet address. Make sure Freighter is unlocked.');
    }

    const address = addressResult.address;
    console.log('Got address:', address); // debug log

    const balance = await getBalance(address);
    cache.set(`balance_${address}`, balance, BALANCE_TTL);
    setWalletState({ address, balance, isConnected: true, network: 'TESTNET' });
    setLastUpdated(new Date());
  } catch (e: any) {
    console.error('Connect error:', e);
    setError(e.message || 'Failed to connect wallet');
  } finally {
    setIsLoading(false);
  }
};

  const disconnectWallet = () => {
    setWalletState(defaultState);
    setTransactions([]);
    setError(null);
  };

  const fetchTransactions = useCallback(async (address: string) => {
    const cacheKey = `tx_${address}`;
    const cached = cache.get<Transaction[]>(cacheKey);
    if (cached) { setTransactions(cached); return; }
    setTxLoading(true);
    try {
      const txs = await getTransactions(address);
      cache.set(cacheKey, txs, TX_TTL);
      setTransactions(txs);
    } catch {
      setError('Failed to fetch transactions');
    } finally {
      setTxLoading(false);
    }
  }, []);

  const handleSendPayment = async (params: SendPaymentParams) => {
    setIsSending(true);
    setError(null);
    try {
      const xdr = await buildPaymentTransaction(walletState.address, params.destination, params.amount, params.memo);
      const signed = await freighter.signTransaction(xdr, { networkPassphrase: 'Test SDF Network ; September 2015' });
      const signedXdr = signed.signedTxXdr;
      const hash = await sendPayment(signedXdr);
      cache.clear(`balance_${walletState.address}`);
      cache.clear(`tx_${walletState.address}`);
      await refreshBalance(walletState.address);
      await fetchTransactions(walletState.address);
      return hash;
    } catch (e: any) {
      setError(e.message || 'Payment failed');
      throw e;
    } finally {
      setIsSending(false);
    }
  };

  const handleFundAccount = async () => {
    setIsLoading(true);
    try {
      await fundTestAccount(walletState.address);
      setTimeout(() => refreshBalance(walletState.address), 3000);
    } catch {
      setError('Friendbot funding failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!walletState.isConnected) return;
    fetchTransactions(walletState.address);
    const interval = setInterval(() => refreshBalance(walletState.address), 30000);
    return () => clearInterval(interval);
  }, [walletState.isConnected, walletState.address, fetchTransactions, refreshBalance]);

  return {
    walletState, isLoading, isSending, error, transactions, txLoading,
    lastUpdated, connectWallet, disconnectWallet, refreshBalance: () => refreshBalance(walletState.address),
    sendPayment: handleSendPayment, fetchTransactions: () => fetchTransactions(walletState.address),
    fundAccount: handleFundAccount,
  };
}
