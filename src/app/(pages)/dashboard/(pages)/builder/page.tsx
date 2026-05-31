'use client'

import { RiPlayLine, RiSaveLine } from '@remixicon/react'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'

export default function BuilderPage() {
  return (
    <div className="bg-background flex h-full w-full flex-col">
      <header className="border-border/50 flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-muted-foreground text-sm">
            Define what happens when this workflow runs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <RiPlayLine className="size-4" />
            Test
          </Button>
          <Button size="sm" className="gap-2">
            <RiSaveLine className="size-4" />
            Save
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="border-border/50 bg-background/50 w-72 border-r">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h2 className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
                Available Actions
              </h2>
              <div className="space-y-1"></div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  )
}
