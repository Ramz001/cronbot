import { CreateIntegrationForm } from '@features/create-integration'
import { getIntegrationTokens } from '@entities/integration-token'
import { IntegrationsList } from './ui/integrations-list'

const IntegrationsPage = async () => {
  const result = await getIntegrationTokens()
  const tokens =
    result.success && 'data' in result && result.data ? result.data : []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Manage your connected bots and applications.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_450px]">
        <IntegrationsList tokens={tokens} />
        <CreateIntegrationForm />
      </div>
    </div>
  )
}

export default IntegrationsPage
