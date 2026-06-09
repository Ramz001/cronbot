'use server'

import { requireAuth } from '@shared/api/auth.guard'
import {
  ActionResult,
  withActionErrorHandler,
} from '@shared/api/server-error-handlers'
import {
  DeleteIntegrationSchema,
  DeleteIntegrationType,
} from '../model/validator'
import prisma from '@shared/lib/prisma'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import { IntegrationTokenStatus } from '@prisma/generated/enums'

const deleteIntegration = async (
  values: DeleteIntegrationType
): Promise<ActionResult> => {
  const user = await requireAuth()

  const { id } = DeleteIntegrationSchema.parse(values)

  await prisma.integrationToken.update({
    where: { id },
    data: {
      revokedAt: new Date(),
      status: IntegrationTokenStatus.revoked,
    },
  })

  await cache.del(`${CACHE_KEYS.INTEGRATION_TOKEN}:${user.id}`)
  await cache.del(`${CACHE_KEYS.INTEGRATION_TOKEN_COUNT}:${user.id}`)

  return { success: true }
}

export const deleteIntegrationAction = withActionErrorHandler(deleteIntegration)
