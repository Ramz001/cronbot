'use server'

import { requireAuth } from '@shared/api/auth.guard'
import {
  ActionResult,
  withActionErrorHandler,
} from '@shared/api/server-error-handlers'
import prisma from '@shared/lib/prisma'

const getTokens = async (): Promise<ActionResult<typeof tokens>> => {
  const user = await requireAuth()

  const tokens = await prisma.integrationToken.findMany({
    where: {
      userId: user.id,
    },
    omit: {
      token: true,
    },
  })

  return {
    success: true,
    data: tokens,
  }
}

export const getIntegrationTokens = withActionErrorHandler(getTokens)
