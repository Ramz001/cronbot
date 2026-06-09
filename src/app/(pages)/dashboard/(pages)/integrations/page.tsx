import { CreateIntegrationDialog } from '@features/create-integration'
import { IntegrationsList } from './ui/list'

const IntegrationsPage = async () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your connected bots and applications.
          </p>
        </div>
        <CreateIntegrationDialog />
      </div>

      <IntegrationsList />
    </div>
  )
}

export default IntegrationsPage
