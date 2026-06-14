import { RiTimeLine } from '@remixicon/react'
import AutomationCard from './card'
import { getAutomations } from '@entities/automation'

export async function AutomationsList() {
  const result = await getAutomations()

  if (!result.success) {
    return <div className="text-destructive">Failed to load automations.</div>
  }
  const automations = result.data || []

  return (
    <div className="grid gap-4">
      {automations.map((automation) => (
        <AutomationCard key={automation.id} automation={automation} />
      ))}

      {automations.length === 0 && <EmptyState />}
    </div>
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
    </div>
  )
}
