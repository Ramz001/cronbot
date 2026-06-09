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

const deleteIntegration = async (
  values: DeleteIntegrationType
): Promise<ActionResult> => {
  await requireAuth()

  const { id } = DeleteIntegrationSchema.parse(values)

  await prisma.integrationToken.update({
    where: { id },
    data: {
      revokedAt: new Date(),
      status: IntegrationTokenStatus.revoked,
    },
  })

  return { success: true }
}

export const deleteIntegrationAction = withActionErrorHandler(deleteIntegration)
