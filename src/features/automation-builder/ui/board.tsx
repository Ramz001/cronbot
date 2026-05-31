'use client'

import { Card, CardContent } from '@/shared/ui/card'
import { Provider } from '@prisma/generated/enums'
import { useBuilderStore } from '../model/store'
import AutomationCard from './automation-card'

const AutomationCreationBoard = () => {
  const { action } = useBuilderStore()

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center">
      {action === Provider.discord ? (
        <AutomationCard type={action} />
      ) : (
        <Card className="w-full max-w-md">
          <CardContent>Select an action to continue the workflow</CardContent>
        </Card>
      )}
    </section>
  )
}

export default AutomationCreationBoard
