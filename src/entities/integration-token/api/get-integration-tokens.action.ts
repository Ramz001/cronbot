'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { cacheLife, cacheTag } from 'next/cache'
import prisma from '@shared/lib/prisma'

const fetcher = async (userId: string) => {
  'use cache'
  cacheLife('custom')
  cacheTag('integration-tokens', userId)

  return await prisma.integrationToken.findMany({
    where: {
      userId: userId,
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
  cacheTag('integration-tokens-count', userId)

  return await prisma.integrationToken.count({
    where: {
      userId: userId,
    },
  })
}

const getTokensCount = async () => {
  const user = await requireAuth()
  return fetcherCount(user.id)
}

export const getIntegrationTokens = withActionErrorHandler(getTokens)
export const getIntegrationTokensCount = withActionErrorHandler(getTokensCount)
