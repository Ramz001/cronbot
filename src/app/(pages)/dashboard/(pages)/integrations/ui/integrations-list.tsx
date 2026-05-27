import { type IntegrationToken } from '@prisma/generated/client'
import { IntegrationCard } from './integration-card'
import { ScrollArea } from '@shared/ui/scroll-area'

interface IntegrationsListProps {
  tokens: Omit<IntegrationToken, 'token'>[]
}

export function IntegrationsList({ tokens }: IntegrationsListProps) {
  if (tokens.length === 0) {
    return (
      <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-foreground text-lg font-medium">
          No integrations yet
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          You haven't set up any integrations. Create one to get started.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {tokens.map((token) => (
        <IntegrationCard key={token.id} token={token} />
      ))}
    </ScrollArea>
  )
}
