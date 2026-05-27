import React from 'react'
import { type IntegrationToken } from '@prisma/generated/client'
import { IntegrationCard } from './integration-card'

interface IntegrationsListProps {
  tokens: IntegrationToken[]
}

export function IntegrationsList({ tokens }: IntegrationsListProps) {
  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
        <h3 className="text-lg font-medium text-foreground">No integrations yet</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          You haven't set up any integrations. Create one below to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tokens.map((token) => (
        <IntegrationCard key={token.id} token={token} />
      ))}
    </div>
  )
}
