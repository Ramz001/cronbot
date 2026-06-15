import { Provider } from '@prisma/generated/enums'
import { DISCORD_PROVIDER } from '@entities/discord/client'
import { ProviderType } from '@entities/discord'

/**
 * Central registry of all supported providers.
 * Add new providers here as they are created.
 */
const PROVIDERS: ProviderType[] = [DISCORD_PROVIDER]

/** Look up a provider by its Prisma enum value. */
export function getProvider(value: Provider): ProviderType | undefined {
  return PROVIDERS.find((p) => p.value === value)
}

export { PROVIDERS }
export type { ProviderType }
