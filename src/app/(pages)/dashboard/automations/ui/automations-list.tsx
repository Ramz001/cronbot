'use client'

import { useState } from 'react'
import {
  RiAddLine,
  RiTimeLine,
  RiPlayLine,
  RiPauseLine,
  RiDeleteBin2Line,
} from '@remixicon/react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Icon as DiscordIcon } from '@entities/discord/client'
import { Provider } from '@prisma/generated/enums'
import { mockAutomations, type MockAutomation } from '../model/mock'

export function AutomationsList() {
  const [automations, setAutomations] =
    useState<MockAutomation[]>(mockAutomations)

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
    <div className="grid gap-4">
      {automations.map((automation) => (
        <AutomationCard
          key={automation.id}
          automation={automation}
          onToggle={toggleStatus}
        />
      ))}

      {automations.length === 0 && <EmptyState />}
    </div>
  )
}

function AutomationCard({
  automation,
  onToggle,
}: {
  automation: MockAutomation
  onToggle: (id: number) => void
}) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div
          className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg ${
            automation.status === 'active'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {automation.provider === Provider.discord && <DiscordIcon />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{automation.name}</h3>
            <Badge
              variant={automation.status === 'active' ? 'default' : 'secondary'}
              className="h-5 text-[10px] capitalize"
            >
              {automation.status}
            </Badge>
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
          onClick={() => onToggle(automation.id)}
          title={automation.status === 'active' ? 'Pause' : 'Resume'}
        >
          {automation.status === 'active' ? (
            <RiPauseLine className="size-4" />
          ) : (
            <RiPlayLine className="size-4" />
          )}
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
  )
}

function EmptyState() {
  return (
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
  )
}
