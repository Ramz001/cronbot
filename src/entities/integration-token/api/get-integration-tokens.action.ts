'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import prisma from '@shared/utils/prisma'
import { IntegrationTokenStatus } from '@prisma/generated/enums'

const getTokens = async () => {
  const user = await requireAuth()
  const cacheKey = `${CACHE_KEYS.INTEGRATION_TOKEN}:${user.id}`

  return await cache.wrap(cacheKey, () =>
    prisma.integrationToken.findMany({
      where: {
        userId: user.id,
        status: IntegrationTokenStatus.active,
      },
      omit: {
        token: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  )
}

const getTokensCount = async () => {
  const user = await requireAuth()
  const cacheKey = `${CACHE_KEYS.INTEGRATION_TOKEN_COUNT}:${user.id}`

  return await cache.wrap(cacheKey, () =>
    prisma.integrationToken.count({
      where: {
        userId: user.id,
        status: IntegrationTokenStatus.active,
      },
    })
  )
}

export const getIntegrationTokens = withActionErrorHandler(getTokens)
export const getIntegrationTokensCount = withActionErrorHandler(getTokensCount)
