import { isValidAddress } from '@/lib/stellar';

jest.mock('@stellar/stellar-sdk', () => ({
  Keypair: {
    fromPublicKey: (key: string) => {
      if (!key || key === 'invalid-address' || key.length < 10) {
        throw new Error('Invalid key');
      }
      return { publicKey: () => key };
    },
  },
  Horizon: { Server: jest.fn() },
  Networks: { TESTNET: 'Test SDF Network ; September 2015' },
  Asset: { native: jest.fn() },
  TransactionBuilder: jest.fn(),
  Operation: { payment: jest.fn() },
  Memo: { text: jest.fn() },
  BASE_FEE: '100',
}));

describe('Stellar Utils', () => {
  it('should return true for a valid Stellar address', () => {
    expect(isValidAddress('GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN')).toBe(true);
  });

  it('should return false for an invalid address', () => {
    expect(isValidAddress('invalid-address')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidAddress('')).toBe(false);
  });
});
