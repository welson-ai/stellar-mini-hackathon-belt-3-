import { Cache } from '@/lib/cache';

describe('Cache', () => {
  it('should store and retrieve data', () => {
    const cache = new Cache();
    cache.set('key1', 'value1', 5000);
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for expired cache', () => {
    const cache = new Cache();
    cache.set('key2', 'value2', -1);
    expect(cache.get('key2')).toBeNull();
  });

  it('should clear a cache entry', () => {
    const cache = new Cache();
    cache.set('key3', 'value3', 5000);
    cache.clear('key3');
    expect(cache.get('key3')).toBeNull();
  });
});
