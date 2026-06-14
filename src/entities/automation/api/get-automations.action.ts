'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import prisma from '@shared/utils/prisma'

const action = async () => {
  const user = await requireAuth()
  const cacheKey = `${CACHE_KEYS.AUTOMATION}:${user.id}`

  return await cache.wrap(cacheKey, () =>
    prisma.automation.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  )
}

export const getAutomations = withActionErrorHandler(action)
