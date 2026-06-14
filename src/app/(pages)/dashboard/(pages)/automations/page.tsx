import { AutomationsList } from './ui/automations-list'

export default function AutomationsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
        <p className="text-muted-foreground text-sm">
          Manage your scheduled workflows and active tasks.
        </p>
      </div>
      <AutomationsList />
    </>
  )
}
