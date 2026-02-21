import { Cache } from '@/lib/cache';

describe('Wallet Cache Integration', () => {
  it('should cache balance and return it', () => {
    const cache = new Cache();
    cache.set('balance_GTEST', '100.00', 30000);
    expect(cache.get('balance_GTEST')).toBe('100.00');
  });

  it('should cache transactions array', () => {
    const cache = new Cache();
    const txs = [{ id: '1', type: 'sent', amount: '10', asset: 'XLM', date: '2024-01-01' }];
    cache.set('tx_GTEST', txs, 60000);
    expect(cache.get('tx_GTEST')).toEqual(txs);
  });

  it('should invalidate cache after TTL', () => {
    const cache = new Cache();
    cache.set('balance_GEXPIRED', '50.00', -1);
    expect(cache.get('balance_GEXPIRED')).toBeNull();
  });
});
