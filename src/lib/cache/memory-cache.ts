import "server-only";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, Promise<unknown>>();

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const existing = cache.get(key);

  if (existing && existing.expiresAt > now) {
    return existing.value as T;
  }

  cache.delete(key);

  const pendingRequest = pending.get(key);

  if (pendingRequest) {
    return pendingRequest as Promise<T>;
  }

  const request = loader()
    .then((value) => {
      cache.set(key, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });

      return value;
    })
    .finally(() => {
      pending.delete(key);
    });

  pending.set(key, request);

  return request;
}
