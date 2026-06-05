import { getGuilds } from '@entities/discord'
import {
  CreateAutomationError,
  CreateAutomationForm,
} from '@features/automation-builder'

export default async function CreateAutomationPage() {
  const result = await getGuilds()

  if (!result.success) {
    return (
      <CreateAutomationError
        error={result.error.message}
        status={result.status}
      />
    )
  }

  return <CreateAutomationForm guilds={result.data} />
}
