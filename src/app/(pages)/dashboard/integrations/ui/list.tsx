import { IntegrationCard } from './card'
import { ScrollArea } from '@shared/ui/scroll-area'
import { getIntegrationTokens } from '@entities/integration-token'

export async function IntegrationsList() {
  const res = await getIntegrationTokens()

  if (!res.success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-lg font-medium text-red-600">
          Failed to load integrations
        </h3>
        <p className="mt-2 max-w-sm text-sm text-red-500">
          {res.error.message ||
            'An unexpected error occurred while fetching your integrations.'}
        </p>
      </div>
    )
  }
  const tokens = res.data || []

  if (tokens.length === 0) {
    return (
      <div className="bg-muted/20 flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
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
    <ScrollArea className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {tokens.map((token) => (
        <IntegrationCard key={token.id} token={token} />
      ))}
    </ScrollArea>
  )
}
