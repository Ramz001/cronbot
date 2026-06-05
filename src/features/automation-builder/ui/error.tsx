import Link from 'next/link'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { RiErrorWarningLine, RiWifiOffLine } from '@remixicon/react'
import { errors } from '../consts/errors'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/ui/card'

function isNetworkError(message: string) {
  return /network|timeout|failed to fetch|econnrefused|enotfound/i.test(message)
}

export function CreateAutomationError({
  error,
  status,
}: {
  error: string
  status?: number | null
}) {
  const isNetwork = isNetworkError(error)
  const config = status ? errors[status] : undefined

  const Icon = config?.icon ?? (isNetwork ? RiWifiOffLine : RiErrorWarningLine)
  const title =
    config?.title ?? (isNetwork ? 'Connection error' : 'Something went wrong')
  const description =
    config?.description ??
    (isNetwork ? 'Please check your internet connection and try again.' : error)

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="mb-2 flex items-start gap-4">
          <div className="bg-destructive/10 ring-destructive/5 mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full ring-4">
            <Icon className="text-destructive size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1 leading-relaxed text-balance">
              {description}
            </CardDescription>
          </div>

          {/* Badge lives in the top-right action slot */}
          {status && (
            <CardAction>
              <Badge variant="destructive">Error {status}</Badge>
            </CardAction>
          )}
        </div>
      </CardHeader>

      {status && (
        <CardContent>
          <p className="text-muted-foreground bg-muted rounded-md px-3 py-2 font-mono text-xs">
            HTTP {status}
            {config?.title ? ` — ${config.title}` : ''}
          </p>
        </CardContent>
      )}

      {status === 404 && (
        <CardFooter className="justify-end">
          <Button asChild>
            <Link href="/dashboard/integrations">Go to integrations</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
