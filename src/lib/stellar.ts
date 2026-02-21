import * as StellarSdk from '@stellar/stellar-sdk';
import { Transaction } from '@/types';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

export function isValidAddress(address: string): boolean {
  try {
    StellarSdk.Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getBalance(address: string): Promise<string> {
  const account = await server.loadAccount(address);
  const xlm = account.balances.find((b: any) => b.asset_type === 'native');
  return xlm ? parseFloat(xlm.balance).toFixed(2) : '0.00';
}

export async function getTransactions(address: string): Promise<Transaction[]> {
  const payments = await server.payments().forAccount(address).limit(10).order('desc').call();
  return payments.records
    .filter((p: any) => p.type === 'payment' || p.type === 'create_account')
    .map((p: any) => ({
      id: p.id,
      type: p.to === address ? 'received' : 'sent',
      amount: p.amount || p.starting_balance || '0',
      asset: p.asset_type === 'native' ? 'XLM' : p.asset_code || 'XLM',
      to: p.to,
      from: p.from || p.funder,
      date: new Date(p.created_at).toLocaleDateString(),
      memo: '',
    }));
}

export async function fundTestAccount(address: string): Promise<void> {
  await fetch(`https://friendbot.stellar.org?addr=${address}`);
}

export async function sendPayment(
  signedXdr: string
): Promise<string> {
  const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

export async function buildPaymentTransaction(
  sourceAddress: string,
  destination: string,
  amount: string,
  memo?: string
): Promise<string> {
  const account = await server.loadAccount(sourceAddress);
  let builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount,
      })
    )
    .setTimeout(30);

  if (memo) builder = builder.addMemo(StellarSdk.Memo.text(memo));
  return builder.build().toXDR();
}
