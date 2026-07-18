interface CacheEntry<T> {
  data: T;
  expiry: number;
}

interface CacheOptions {
  defaultTTL?: number;
  maxSize?: number;
}

class Cache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>();
  private defaultTTL: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.defaultTTL || 60_000; // 1 minute
    this.maxSize = options.maxSize || 1000;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: T, ttlMs?: number): void {
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      data,
      expiry: Date.now() + (ttlMs || this.defaultTTL),
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

// Singleton cache instances
export const settingsCache = new Cache<Record<string, unknown>>({
  defaultTTL: 5 * 60_000, // 5 minutes
  maxSize: 10,
});

export const brandsCache = new Cache({ defaultTTL: 60 * 60_000, maxSize: 5 });
export const modelsCache = new Cache({ defaultTTL: 60 * 60_000, maxSize: 50 });
export const vehiclesCache = new Cache({ defaultTTL: 60_000, maxSize: 200 });
export const featuredCache = new Cache({ defaultTTL: 120_000, maxSize: 10 });

export { Cache };
