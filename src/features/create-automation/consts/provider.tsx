import { Provider } from '@prisma/generated/enums'
import { Icon } from '@entities/discord/client'

export type ProviderInfo = {
  value: Provider
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export const PROVIDER_LIST: ProviderInfo[] = [
  {
    value: Provider.discord,
    label: 'Discord',
    icon: Icon,
    color: '#5865F2',
  },
]
