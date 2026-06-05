'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import prisma from '@shared/lib/prisma'

const getTokens = async () => {
  const user = await requireAuth()

  return await prisma.integrationToken.findMany({
    where: {
      userId: user.id,
    },
    omit: {
      token: true,
    },
  })
}

const getTokensCount = async () => {
  const user = await requireAuth()

  return await prisma.integrationToken.count({
    where: {
      userId: user.id,
    },
  })
}

export const getIntegrationTokens = withActionErrorHandler(getTokens)
export const getIntegrationTokensCount = withActionErrorHandler(getTokensCount)
