import React from 'react'
import { CreateIntegrationForm } from '@features/create-integration'

const IntegrationsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Integrations</h1>

      <CreateIntegrationForm />
    </div>
  )
}

export default IntegrationsPage
