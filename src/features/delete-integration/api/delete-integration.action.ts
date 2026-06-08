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
import { IntegrationTokenStatus } from '@prisma/generated/enums'
import { updateTag } from 'next/cache'
import { CACHE_TAGS } from '@shared/api/cache'

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

  updateTag(`${CACHE_TAGS.INTEGRATION_TOKEN}-${user.id}`)
  updateTag(`${CACHE_TAGS.INTEGRATION_TOKEN_COUNT}-${user.id}`)

  return { success: true }
}

export const deleteIntegrationAction = withActionErrorHandler(deleteIntegration)
