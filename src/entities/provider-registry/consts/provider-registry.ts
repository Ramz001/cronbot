import { Provider } from '@prisma/generated/enums'
import { DISCORD_PROVIDER } from '@entities/discord/client'
import { ProviderInfo } from '@entities/discord'

/**
 * Central registry of all supported providers.
 * Add new providers here as they are created.
 */
const PROVIDERS: ProviderInfo[] = [DISCORD_PROVIDER]

/** Look up a provider by its Prisma enum value. */
export function getProvider(value: Provider): ProviderInfo | undefined {
  return PROVIDERS.find((p) => p.value === value)
}

export { PROVIDERS }
export type { ProviderInfo }
