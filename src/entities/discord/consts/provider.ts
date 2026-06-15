import { Provider } from '@prisma/generated/enums'
import { Icon } from '../client'
import { ProviderType } from '../model/types'

export const DISCORD_PROVIDER: ProviderType = {
  value: Provider.discord,
  label: 'Discord',
  icon: Icon,
  color: '#5865F2',
}
