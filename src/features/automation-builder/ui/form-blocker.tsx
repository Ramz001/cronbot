'use client'

import Link from 'next/link'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  RiErrorWarningLine,
  RiLockLine,
  RiKeyLine,
  RiWifiOffLine,
  RiRefreshLine,
  RiServerLine,
} from '@remixicon/react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AxiosLikeError = Error & {
  response?: { status?: number; data?: unknown }
}

type IntegrationErrorDisplayProps = {
  error: unknown
  onRetry?: () => void
}

// ---------------------------------------------------------------------------
// Status → visual config
// ---------------------------------------------------------------------------

const statusConfig: Record<
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
    description: "You've hit the rate limit. Please wait a moment and try again.",
  },
  500: {
    icon: RiServerLine,
    title: 'Server error',
    description: 'Something went wrong on our end. Please try again later.',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isNetworkError(message: string) {
  return /network|timeout|failed to fetch|econnrefused|enotfound/i.test(message)
}

function extractErrorInfo(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.'

  const status =
    error != null &&
    typeof error === 'object' &&
    'response' in error
      ? ((error as AxiosLikeError).response?.status ?? null)
      : null

  return { message, status }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IntegrationErrorDisplay({
  error,
  onRetry,
}: IntegrationErrorDisplayProps) {
  const { message, status } = extractErrorInfo(error)
  const isNetwork = isNetworkError(message)

  const config = status ? statusConfig[status] : undefined
  const Icon =
    config?.icon ?? (isNetwork ? RiWifiOffLine : RiErrorWarningLine)
  const title =
    config?.title ?? (isNetwork ? 'Connection error' : 'Something went wrong')
  const description =
    config?.description ??
    (isNetwork
      ? 'Please check your internet connection and try again.'
      : message)

  const hasFooter = Boolean(status === 401 || onRetry)

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      {/* Icon */}
      <div className="bg-destructive/10 ring-destructive/5 inline-flex size-12 items-center justify-center rounded-full ring-4">
        <Icon className="text-destructive size-6" />
      </div>

      {/* Title & description */}
      <div className="max-w-sm space-y-2">
        <h3 className="text-foreground text-base font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Status badge */}
      {status && <Badge variant="destructive">Error {status}</Badge>}

      {/* Footer actions */}
      {hasFooter && (
        <div className="border-t-border w-full max-w-sm space-y-3 border-t pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {status === 401 && (
              <Button variant="secondary" asChild>
                <Link href="/dashboard/integrations">
                  Go to integrations
                </Link>
              </Button>
            )}
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                onClick={onRetry}
              >
                <RiRefreshLine className="mr-2 size-4" />
                Try again
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
