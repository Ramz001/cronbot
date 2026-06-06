import {
  RiErrorWarningLine,
  RiLockLine,
  RiKeyLine,
  RiServerLine,
} from '@remixicon/react'

export const HAS_NO_INTEGRATIONS = 403

export const errorMaps: Record<
  number,
  { icon: typeof RiErrorWarningLine; title: string; description: string }
> = {
  401: {
    icon: RiLockLine,
    title: 'Integration token expired',
    description:
      'Your Discord integration are likely expired. Head to your settings to reconnect.',
  },
  [HAS_NO_INTEGRATIONS]: {
    icon: RiLockLine,
    title: 'Access denied',
    description:
      'Add a Discord integration token in your settings before creating automations.',
  },
  404: {
    icon: RiKeyLine,
    title: 'No integration token found',
    description: 'Resource not found',
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
