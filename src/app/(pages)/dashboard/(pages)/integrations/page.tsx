import { CreateIntegrationForm } from '@features/create-integration'
import { IntegrationsList } from './ui/integrations-list'

export const dynamic = 'force-dynamic'

const IntegrationsPage = async () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Manage your connected bots and applications.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_450px]">
        <IntegrationsList />
        <CreateIntegrationForm />
      </div>
    </div>
  )
}

export default IntegrationsPage
