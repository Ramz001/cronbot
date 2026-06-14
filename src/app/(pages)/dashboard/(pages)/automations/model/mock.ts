import { Provider } from '@prisma/generated/enums'

export interface MockAutomation {
  id: number
  name: string
  status: 'active' | 'paused'
  lastRun: string
  provider: Provider
}

export const mockAutomations: MockAutomation[] = [
  {
    id: 1,
    name: 'Daily Standup Reminder',
    status: 'active',
    lastRun: '2 hours ago',
    provider: Provider.discord,
  },
  {
    id: 2,
    name: 'Weekly Digest',
    status: 'paused',
    lastRun: '1 week ago',
    provider: Provider.discord,
  },
  {
    id: 3,
    name: 'Server Status Check',
    status: 'active',
    lastRun: 'Just now',
    provider: Provider.discord,
  },
]
