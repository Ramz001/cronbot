import { createCache } from 'cache-manager';

export const cache = createCache({
  ttl: 600_000, // 10 minutes (matches custom cacheLife expire)
  refreshThreshold: 60_000, // 1 minute (matches custom cacheLife stale)
});
