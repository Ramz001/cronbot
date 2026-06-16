import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import {
  RiCheckLine,
  RiCloseLine,
  RiDownloadLine,
  RiFileListLine,
} from '@remixicon/react'
import { getAutomationRuns } from '@entities/automation-run'

const MOCK_STATS = [
  { label: 'Active Automations', value: '8' },
  { label: 'Success Rate', value: '94.7%' },
  { label: 'Runs (24h)', value: '47' },
  { label: 'Failed', value: '3' },
]

const MOCK_LOGS = [
  {
    id: 'run-001',
    automationId: 'auto-001',
    name: 'Daily standup → #general',
    provider: 'discord',
    status: 'success',
    retries: 0,
    scheduledAt: '2026-06-16 09:00:00',
    startedAt: '2026-06-16 09:00:02',
    finishedAt: '2026-06-16 09:00:03',
    duration: '1.2s',
    output: `[discord] Connecting to gateway...
[discord] Authenticated as CronBot#0001
[discord] Sending message to #general (channelId: 123456789)
[discord] Message delivered — id: 1111222233334444
✅ Automation "Daily standup" completed`,
  },
  {
    id: 'run-002',
    automationId: 'auto-002',
    name: 'Weekly report → #team-leads',
    provider: 'discord',
    status: 'success',
    retries: 0,
    scheduledAt: '2026-06-16 10:00:00',
    startedAt: '2026-06-16 10:00:01',
    finishedAt: '2026-06-16 10:00:12',
    duration: '11.8s',
    output: `[discord] Fetching sprint metrics...
[discord] Aggregating team stats for week 24
[discord] Generating embed with 6 fields
[discord] Sending to #team-leads...
[discord] Embed posted — id: 9999888877776666
✅ Automation "Weekly report" completed`,
  },
  {
    id: 'run-003',
    automationId: 'auto-006',
    name: 'Analytics snapshot → #metrics',
    provider: 'discord',
    status: 'failed',
    retries: 3,
    scheduledAt: '2026-06-16 08:00:00',
    startedAt: '2026-06-16 08:00:00',
    finishedAt: '2026-06-16 08:01:23',
    duration: '83.4s',
    output: `[discord] Fetching analytics from provider...
[discord] Attempt 1/4 — HTTP 503 Service Unavailable
[discord] Retrying in 5s...
[discord] Attempt 2/4 — HTTP 503 Service Unavailable
[discord] Retrying in 10s...
[discord] Attempt 3/4 — HTTP 503 Service Unavailable
[discord] Retrying in 20s...
[discord] Attempt 4/4 — HTTP 503 Service Unavailable
❌ Automation "Analytics snapshot" failed after 4 attempts`,
  },
  {
    id: 'run-004',
    automationId: 'auto-009',
    name: 'Audit log export',
    provider: 'discord',
    status: 'skipped',
    retries: 0,
    scheduledAt: '2026-06-16 01:00:00',
    startedAt: null,
    finishedAt: null,
    duration: '—',
    output: `⏭️ Automation "Audit log export" was skipped.
Reason: No audit events recorded since last run.
Last successful run: 2026-06-15 01:00:05`,
  },
  {
    id: 'run-005',
    automationId: 'auto-004',
    name: 'Welcome DM → new members',
    provider: 'discord',
    status: 'success',
    retries: 0,
    scheduledAt: '2026-06-16 00:00:00',
    startedAt: '2026-06-16 00:00:01',
    finishedAt: '2026-06-16 00:00:04',
    duration: '3.1s',
    output: `[discord] Scanning guild members...
[discord] Found 2 new members since last check
[discord] Sending welcome DM to user: alice#1234
[discord] Sending welcome DM to user: bob#5678
✅ Automation "Welcome DM" completed — 2 messages sent`,
  },
]

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

async function WorkerLogItem({ log }: { log: (typeof MOCK_LOGS)[number] }) {
  const isSuccess = log.status === 'success'
  const isFailed = log.status === 'failed'
  const isSkipped = log.status === 'skipped'

  const statusIcon = isSuccess ? (
    <RiCheckLine className="size-4" />
  ) : isSkipped ? (
    <RiDownloadLine className="size-4" />
  ) : (
    <RiCloseLine className="size-4" />
  )

  const statusColor = isSuccess
    ? 'bg-emerald-500/10 text-emerald-500'
    : isSkipped
      ? 'bg-amber-500/10 text-amber-500'
      : 'bg-red-500/10 text-red-500'

  return (
    <AccordionItem
      value={log.id}
      className="border-border bg-card ring-border/50 overflow-hidden rounded-xl border data-[state=open]:ring-1"
    >
      <AccordionTrigger className="hover:bg-muted/50 border-transparent px-4 py-3 transition-colors hover:no-underline">
        <div className="mr-4 flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${statusColor}`}
            >
              {statusIcon}
            </div>
            <span className="font-semibold">{log.name}</span>
          </div>
          <div className="text-muted-foreground mr-6 flex items-center gap-4 text-sm font-normal">
            <span className="hidden sm:inline-block">
              {log.retries} retries
            </span>
            <span className="hidden sm:inline-block">{log.scheduledAt}</span>
            <Badge
              variant={isSuccess ? 'default' : isSkipped ? 'secondary' : 'destructive'}
              className="capitalize"
            >
              {log.status}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="border-border mt-1 border-t px-4 pt-0 pb-4 text-sm">
        <div className="flex flex-col gap-6 pt-4 lg:flex-row">
          {/* Left: Terminal output */}
          <div className="min-w-0 flex-1 space-y-3">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Terminal Output
            </span>
            <div className="custom-scrollbar max-h-75 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs whitespace-pre-wrap text-zinc-50 shadow-inner dark:bg-zinc-900">
              {log.output}
            </div>
          </div>

          {/* Right: Info panel */}
          <div className="bg-muted/40 border-border/50 flex h-fit w-full flex-col gap-5 rounded-xl border p-5 lg:w-72">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Scheduled At
                </span>
                <span className="text-sm font-medium">{log.scheduledAt}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Duration
                </span>
                <span className="text-sm font-medium">{log.duration}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Provider
                </span>
                <span className="text-sm font-medium capitalize">
                  {log.provider}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Status
                </span>
                <span className="text-sm font-medium capitalize">
                  {log.status}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Started At
                </span>
                <span className="text-sm font-medium">
                  {log.startedAt ?? '—'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Finished At
                </span>
                <span className="text-sm font-medium">
                  {log.finishedAt ?? '—'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Automation ID
                </span>
                <span className="font-medium font-mono text-xs">
                  {log.automationId}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Retry Attempts
                </span>
                <span className="text-sm font-medium">{log.retries}</span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2.5">
              <Button
                size="sm"
                className="w-full justify-start gap-2 shadow-sm"
              >
                <RiFileListLine className="size-4" />
                View Full Log
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <RiDownloadLine className="size-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

const StatsPage = async () => {
  const result = await getAutomationRuns({ id: '' })

  return (
    <div className="flex w-full flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Schedule & Stats</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat, i) => (
          <StatCard key={i} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Worker Logs</h2>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2 border-none"
        >
          {MOCK_LOGS.map((log) => (
            <WorkerLogItem key={log.id} log={log} />
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default StatsPage
