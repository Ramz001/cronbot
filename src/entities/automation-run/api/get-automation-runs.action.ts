'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import prisma from '@shared/utils/prisma'
import { AutomationRunSchema, AutomationRunType } from '../model/validator'

const action = async (values: AutomationRunType) => {
  const user = await requireAuth()
  const cacheKey = `${CACHE_KEYS.AUTOMATION_RUN}:${user.id}`
  const { id } = AutomationRunSchema.parse(values)

  return await cache.wrap(cacheKey, () =>
    prisma.automationRun.findMany({
      where: {
        automationId: id,
        automation: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  )
}

export const getAutomationRuns = withActionErrorHandler(action)
