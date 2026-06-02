'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import prisma from '@shared/lib/prisma'

const getTokens = async () => {
  const user = await requireAuth()

  const tokens = await prisma.integrationToken.findMany({
    where: {
      userId: user.id,
    },
    omit: {
      token: true,
    },
  })

  return tokens
}

export const getIntegrationTokens = withActionErrorHandler(getTokens)
