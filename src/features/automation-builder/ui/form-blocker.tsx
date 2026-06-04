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
import { useBuilderStore } from '../model/store'
import {
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/card'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AxiosLikeError = Error & {
  response?: { status?: number; data?: unknown }
}

type IntegrationErrorDisplayProps = {
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
    description:
      "You've hit the rate limit. Please wait a moment and try again.",
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
    error != null && typeof error === 'object' && 'response' in error
      ? ((error as AxiosLikeError).response?.status ?? null)
      : null

  return { message, status }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IntegrationErrorDisplay({
  onRetry,
}: IntegrationErrorDisplayProps) {
  const queryError = useBuilderStore((s) => s.queryError)

  if (!queryError) return null

  const { message, status } = extractErrorInfo(queryError)
  const isNetwork = isNetworkError(message)

  const config = status ? statusConfig[status] : undefined
  const Icon = config?.icon ?? (isNetwork ? RiWifiOffLine : RiErrorWarningLine)
  const title =
    config?.title ?? (isNetwork ? 'Connection error' : 'Something went wrong')
  const description =
    config?.description ??
    (isNetwork
      ? 'Please check your internet connection and try again.'
      : message)

  const hasFooter = Boolean(status === 401 || onRetry)

  return (
    <>
      <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
        {/* Icon */}
        <div className="bg-destructive/10 ring-destructive/5 inline-flex size-12 items-center justify-center rounded-full ring-4">
          <Icon className="text-destructive size-6" />
        </div>

        {/* Title & description */}
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        {/* Status badge */}
        {status && <Badge variant="destructive">Error {status}</Badge>}
      </CardContent>

      {/* Footer actions */}
      {hasFooter && (
        <CardFooter className="flex-col gap-2 border-t pt-6 sm:flex-row sm:justify-center">
          {status === 401 && (
            <Button variant="secondary" asChild>
              <Link href="/dashboard/integrations">Go to integrations</Link>
            </Button>
          )}
          {onRetry && (
            <Button type="button" variant="outline" onClick={onRetry}>
              <RiRefreshLine className="mr-2 size-4" />
              Try again
            </Button>
          )}
        </CardFooter>
      )}
    </>
  )
}
