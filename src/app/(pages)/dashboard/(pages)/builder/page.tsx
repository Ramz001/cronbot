import AutomationCreationBoard from '@features/automation-builder/ui/board'

export default function BuilderPage() {
  return (
    <main className="bg-background flex h-full w-full flex-col">
      <header className="border-border/50 border-b px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Workflow Builder</h1>
        <p className="text-muted-foreground text-sm">
          Define what happens when this workflow runs
        </p>
      </header>
      <AutomationCreationBoard />
    </main>
  )
}
