import { getGuilds } from '@entities/discord'
import {
  CreateAutomationError,
  CreateAutomationForm,
  HAS_NO_INTEGRATIONS,
} from '@features/automation-builder'
import { getIntegrationTokensCount } from '@entities/integration-token'

export default async function CreateAutomationPage() {
  const count = await getIntegrationTokensCount()

  if (!count.success) {
    return (
      <CreateAutomationError
        error={count.error.message}
        status={count.status}
      />
    )
  }

  if (count.data === 0) {
    return <CreateAutomationError error={''} status={HAS_NO_INTEGRATIONS} />
  }

  const guilds = await getGuilds()

  if (!guilds.success) {
    return (
      <CreateAutomationError
        error={guilds.error.message}
        status={guilds.status}
      />
    )
  }

  return <CreateAutomationForm guilds={guilds.data} />
}
