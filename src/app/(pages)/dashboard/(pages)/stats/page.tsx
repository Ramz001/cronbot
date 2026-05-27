import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
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
  RiTimeLine,
  RiDownloadLine,
  RiFileListLine,
} from '@remixicon/react'

const MOCK_STATS = [
  { label: 'Active', value: '12' },
  { label: 'Success Rate', value: '99.2%' },
  { label: 'Last 24h', value: '47' },
  { label: 'Failures', value: '1' },
]

const MOCK_LOGS = [
  {
    id: '1',
    name: 'Image Optimization',
    status: 'success',
    retries: 1,
    startTime: '2024-05-15 09:58:12',
    duration: '18.7s',
    output: `Processed 342 images
Successfully optimized 340 images
Skipped 2 (unsupported format)
Total space saved: 245MB`,
  },
  {
    id: '2',
    name: 'Database Backup',
    status: 'success',
    retries: 0,
    startTime: '2024-05-15 03:00:00',
    duration: '45.2s',
    output: `Starting full database backup...
Compressing tables...
Backup completed successfully.
Size: 1.2GB`,
  },
  {
    id: '3',
    name: 'Sync Analytics Data',
    status: 'failure',
    retries: 3,
    startTime: '2024-05-15 10:15:00',
    duration: '5.4s',
    output: `Connecting to analytics provider...
Error: 503 Service Unavailable
Failed to sync data after 4 attempts.`,
  }
]

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function WorkerLogItem({ log }: { log: typeof MOCK_LOGS[number] }) {
  const isSuccess = log.status === 'success'

  return (
    <AccordionItem
      value={log.id}
      className="border border-border rounded-xl bg-card overflow-hidden data-[state=open]:ring-1 ring-border/50"
    >
      <AccordionTrigger className="hover:no-underline hover:bg-muted/50 transition-colors px-4 py-3 border-transparent">
        <div className="flex flex-1 items-center justify-between gap-4 mr-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {isSuccess ? <RiCheckLine className="size-4" /> : <RiCloseLine className="size-4" />}
            </div>
            <span className="font-semibold">{log.name}</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-normal text-muted-foreground mr-6">
            <span className="hidden sm:inline-block">{log.retries} retries</span>
            <span className="hidden sm:inline-block">{log.startTime}</span>
            <Badge variant={isSuccess ? 'default' : 'destructive'} className="capitalize">
              {log.status}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-4 pb-4 pt-0 text-sm border-t border-border mt-1">
        <div className="flex flex-col lg:flex-row gap-6 pt-4">
          {/* Left: Terminal output */}
          <div className="flex-1 space-y-3 min-w-0">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Terminal Output</span>
            <div className="bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-lg p-4 font-mono text-xs whitespace-pre-wrap overflow-y-auto max-h-75 shadow-inner custom-scrollbar">
              {log.output}
            </div>
          </div>

          {/* Right: Info panel */}
          <div className="w-full lg:w-72 flex flex-col gap-5 bg-muted/40 p-5 rounded-xl border border-border/50 h-fit">
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Start Time</span>
                <span className="font-medium text-sm">{log.startTime}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Duration</span>
                <span className="font-medium text-sm">{log.duration}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Status</span>
                <span className="font-medium text-sm capitalize">{log.status}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Retry Attempts</span>
                <span className="font-medium text-sm">{log.retries}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-col gap-2.5">
              <Button size="sm" className="w-full justify-start gap-2 shadow-sm">
                <RiFileListLine className="size-4" />
                View Full Log
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
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

const StatsPage = () => {
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
        
        <Accordion type="single" collapsible className="w-full space-y-2 border-none">
          {MOCK_LOGS.map((log) => (
            <WorkerLogItem key={log.id} log={log} />
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default StatsPage
