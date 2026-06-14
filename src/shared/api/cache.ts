export const CACHE_KEYS = {
  INTEGRATION_TOKEN: 'integration-tokens',
  INTEGRATION_TOKEN_COUNT: 'integration-tokens-count',
  DISCORD_GUILD: 'discord-guilds',
  DISCORD_CHANNELS: 'discord-channels',
  AUTOMATION: 'automations',
} as const

import { createCache } from 'cache-manager'

export const cache = createCache({
  ttl: 600_000, // 10 minutes (matches custom cacheLife expire)
  refreshThreshold: 60_000, // 1 minute (matches custom cacheLife stale)
})
