'use client'

import { useState } from 'react'
import {
  RiAddLine,
  RiTimeLine,
  RiPlayLine,
  RiPauseLine,
  RiDeleteBin2Line,
  RiEdit2Line,
} from '@remixicon/react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'

const mockAutomations = [
  {
    id: 1,
    name: 'Daily Standup Reminder',
    workflow: 'Discord Announcement',
    schedule: 'Every day at 09:00 AM',
    status: 'active',
    lastRun: '2 hours ago',
  },
  {
    id: 2,
    name: 'Weekly Digest',
    workflow: 'Email Report',
    schedule: 'Every Monday at 08:00 AM',
    status: 'paused',
    lastRun: '1 week ago',
  },
  {
    id: 3,
    name: 'Server Status Check',
    workflow: 'HTTP Request',
    schedule: 'Every 5 minutes',
    status: 'active',
    lastRun: 'Just now',
  },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(mockAutomations)

  const toggleStatus = (id: number) => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
          : auto
      )
    )
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
        <p className="text-muted-foreground text-sm">
          Manage your scheduled workflows and active tasks.
        </p>
      </div>

      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card
            key={automation.id}
            className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg ${automation.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
              >
                <RiTimeLine className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{automation.name}</h3>
                  <Badge
                    variant={
                      automation.status === 'active' ? 'default' : 'secondary'
                    }
                    className="h-5 text-[10px] capitalize"
                  >
                    {automation.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>
                    Workflow:{' '}
                    <strong className="text-foreground font-medium">
                      {automation.workflow}
                    </strong>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="sm:hidden">
                    <br />
                  </span>
                  <span>{automation.schedule}</span>
                </div>
                <p className="text-muted-foreground pt-1 text-xs">
                  Last run: {automation.lastRun}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleStatus(automation.id)}
                title={automation.status === 'active' ? 'Pause' : 'Resume'}
              >
                {automation.status === 'active' ? (
                  <RiPauseLine className="size-4" />
                ) : (
                  <RiPlayLine className="size-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" title="Edit">
                <RiEdit2Line className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Delete"
              >
                <RiDeleteBin2Line className="size-4" />
              </Button>
            </div>
          </Card>
        ))}

        {automations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted flex size-20 items-center justify-center rounded-full">
              <RiTimeLine className="text-muted-foreground size-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Automations Yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Create your first schedule to start automating tasks.
            </p>
            <Button className="gap-2">Create New Schedule</Button>
          </div>
        )}
      </div>
    </div>
  )
}
