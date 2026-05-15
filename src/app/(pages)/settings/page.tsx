import Gutter from '@shared/ui/gutter'
import { SettingsTabs } from './ui/settings-tabs'

export default async function SettingsPage() {
  return (
    <Gutter>
      <h1 className="my-8 text-3xl font-bold">Settings</h1>

      <SettingsTabs />
    </Gutter>
  )
}
