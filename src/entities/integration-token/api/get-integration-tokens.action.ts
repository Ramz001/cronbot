'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { cacheLife, cacheTag } from 'next/cache'
import prisma from '@shared/lib/prisma'
import { IntegrationTokenStatus } from '@prisma/generated/enums'
import { CACHE_TAGS } from '@shared/api/cache'

const fetcher = async (userId: string) => {
  'use cache'
  cacheLife('custom')
  cacheTag(CACHE_TAGS.INTEGRATION_TOKEN, userId)

  return await prisma.integrationToken.findMany({
    where: {
      userId: userId,
      status: IntegrationTokenStatus.active,
    },
    omit: {
      token: true,
    },
  })
}

const getTokens = async () => {
  const user = await requireAuth()
  return fetcher(user.id)
}

const fetcherCount = async (userId: string) => {
  'use cache'
  cacheLife('custom')
  cacheTag(CACHE_TAGS.INTEGRATION_TOKEN_COUNT, userId)

  return await prisma.integrationToken.count({
    where: {
      userId: userId,
      status: IntegrationTokenStatus.active,
    },
  })
}

const getTokensCount = async () => {
  const user = await requireAuth()
  return fetcherCount(user.id)
}

export const getIntegrationTokens = withActionErrorHandler(getTokens)
export const getIntegrationTokensCount = withActionErrorHandler(getTokensCount)
