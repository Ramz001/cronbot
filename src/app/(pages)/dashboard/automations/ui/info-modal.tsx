'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Automation } from '@prisma/generated/client'
import { RiFileTextLine, RiTimeLine, RiLoader2Line } from '@remixicon/react'
import { IdentifierSchema, BodySchema } from '@entities/discord/client'
import { ProviderType } from '@entities/provider-registry'
import { getAutomationRuns } from '@entities/automation-run'
import { RUN_STATUS_CONFIG } from '@entities/automation-run/client'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@shared/utils/cn'

function formatDuration(ms: number): string {
  if (ms >= 60000) {
    const m = Math.floor(ms / 60000)
    const s = Math.round((ms % 60000) / 1000)
    return `${m}m ${s}s`
  }
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`
  return `${ms}ms`
}

export const InfoModal = ({
  automation,
  provider,
  open,
  onOpenChange,
}: {
  automation: Automation
  provider: ProviderType
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { label, color, icon: ProviderIcon } = provider
  const identifierResult = IdentifierSchema.safeParse(automation.identifier)
  const { channelId, guildId } = identifierResult.success
    ? identifierResult.data
    : {}
  const bodyResult = BodySchema.safeParse(automation.body)
  const bodyData = bodyResult.success ? bodyResult.data : { message: '' }

  const {
    data: runs = [],
    isLoading: runsLoading,
    isError: runsErrored,
    error: runsError,
  } = useQuery({
    queryKey: ['automation-runs', automation.id],
    queryFn: async () => {
      const result = await getAutomationRuns({ id: automation.id })
      if (!result.success)
        throw new Error(result.error?.message ?? 'Failed to load runs')
      return (result.data ?? []).slice(0, 5)
    },
    enabled: !!open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm" title="View details">
          <RiFileTextLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle>{automation.name || 'Unnamed Automation'}</DialogTitle>
        </DialogHeader>

        {/* Provider & Channel info */}
        <section className="px-6 pb-3">
          <dl className="space-y-1.5">
            <div className="flex items-center gap-3">
              <dt className="sr-only">Provider</dt>
              <dd>
                <div
                  className="flex size-9 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: color }}
                >
                  <ProviderIcon className="size-4" />
                </div>
              </dd>
              <dd className="text-sm font-medium">{label}</dd>
            </div>
            {guildId && (
              <div className="text-muted-foreground ml-12 flex items-center gap-2 text-xs">
                <dt className="w-12 shrink-0">Server</dt>
                <dd>
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    {guildId}
                  </code>
                </dd>
              </div>
            )}
            {channelId && (
              <div className="text-muted-foreground ml-12 flex items-center gap-2 text-xs">
                <dt className="w-12 shrink-0">Channel</dt>
                <dd>
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    {channelId}
                  </code>
                </dd>
              </div>
            )}
            <div className="text-muted-foreground ml-12 flex items-center gap-2 text-xs">
              <dt className="w-12 shrink-0">Status</dt>
              <dd>
                <Badge
                  variant={automation.isActive ? 'default' : 'secondary'}
                  className="h-5 px-1.5 text-[11px] leading-none font-medium capitalize"
                >
                  {automation.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </dd>
            </div>
            {automation.lastRunAt && (
              <div className="text-muted-foreground ml-12 flex items-center gap-2 text-xs">
                <dt className="w-12 shrink-0">Last Run</dt>
                <dd>{new Date(automation.lastRunAt).toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Message body */}
        <section className="border-border border-t px-6 py-3">
          <h2 className="text-muted-foreground mb-1.5 text-xs font-medium">
            Message Body
          </h2>
          <div className="bg-muted/50 max-h-64 min-h-16 overflow-y-auto rounded-xl border p-3 text-sm wrap-break-word whitespace-pre-wrap">
            {bodyData?.message || (
              <span className="text-muted-foreground italic">
                No message content
              </span>
            )}
          </div>
        </section>

        {/* Recent Runs */}
        <section className="border-border border-t px-6 py-3">
          <h2 className="text-muted-foreground mb-2 text-xs font-medium">
            Recent Runs
            {runs.length > 0 && <span className="ml-1">({runs.length})</span>}
          </h2>

          {runsLoading && (
            <div className="flex items-center justify-center py-6">
              <RiLoader2Line className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}

          {runsErrored && (
            <p className="text-destructive py-2 text-xs">
              {runsError instanceof Error
                ? runsError.message
                : 'Failed to load runs'}
            </p>
          )}

          {!runsLoading && !runsErrored && runs.length === 0 && (
            <p className="text-muted-foreground py-2 text-xs italic">
              No runs yet
            </p>
          )}

          {!runsLoading && !runsErrored && runs.length > 0 && (
            <ul className="space-y-1.5">
              {runs.map((run) => {
                const meta = RUN_STATUS_CONFIG[run.status]
                return (
                  <li
                    key={run.id}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-3 text-sm',
                      meta?.bg ?? 'bg-muted/30'
                    )}
                  >
                    {meta ? (
                      <meta.Icon
                        className={cn('mt-0.5 size-4 shrink-0', meta.color)}
                      />
                    ) : (
                      <RiTimeLine className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-5 px-1.5 text-[11px] font-medium capitalize',
                            meta?.color
                          )}
                        >
                          {meta?.label ?? run.status}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {new Date(run.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                        {run.triggeredBy && (
                          <span>Trigger: {run.triggeredBy}</span>
                        )}
                        {run.durationMs != null && (
                          <span>
                            Duration: {formatDuration(run.durationMs)}
                          </span>
                        )}
                        {run.scheduledAt && (
                          <span>
                            Scheduled:{' '}
                            {new Date(run.scheduledAt).toLocaleString()}
                          </span>
                        )}
                        {run.retries > 0 && <span>Retries: {run.retries}</span>}
                      </div>
                      {run.error && (
                        <p className="mt-1 text-xs leading-relaxed text-red-500">
                          {run.error}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </DialogContent>
    </Dialog>
  )
}
