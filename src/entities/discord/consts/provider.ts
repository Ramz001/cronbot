import { Provider } from '@prisma/generated/enums'
import { Icon } from '../client'
import { ProviderInfo } from '../model/types'

export const DISCORD_PROVIDER: ProviderInfo = {
  value: Provider.discord,
  label: 'Discord',
  icon: Icon,
  color: '#5865F2',
}
