import {
  RiErrorWarningLine,
  RiLockLine,
  RiKeyLine,
  RiServerLine,
} from '@remixicon/react'

export const errors: Record<
  number,
  { icon: typeof RiErrorWarningLine; title: string; description: string }
> = {
  401: {
    icon: RiLockLine,
    title: 'Integration token expired',
    description:
      'Your Discord integration needs to be reauthorized. Head to your settings to reconnect.',
  },
  403: {
    icon: RiLockLine,
    title: 'Access denied',
    description:
      "You don't have permission to access this resource. Check your integration permissions.",
  },
  404: {
    icon: RiKeyLine,
    title: 'No integration token found',
    description:
      'Add a Discord integration token in your settings before creating automations.',
  },
  429: {
    icon: RiServerLine,
    title: 'Too many requests',
    description:
      "You've hit the rate limit. Please wait a moment and try again.",
  },
  500: {
    icon: RiServerLine,
    title: 'Server error',
    description: 'Something went wrong on our end. Please try again later.',
  },
}
