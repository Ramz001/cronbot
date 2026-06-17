'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import {
  DeleteIntegrationSchema,
  DeleteIntegrationType,
} from '../model/validator'
import prisma from '@shared/utils/prisma'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import { IntegrationTokenStatus } from '@prisma/generated/enums'

const deleteIntegration = async (values: DeleteIntegrationType) => {
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
}

export const deleteIntegrationAction = withActionErrorHandler(deleteIntegration)
