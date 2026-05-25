'use server'

import { requireAuth } from '@shared/api/auth.guard'
import {
  ActionResult,
  withActionErrorHandler,
} from '@shared/api/server-error-handlers'
import {
  CreateIntegrationSchema,
  CreateIntegrationType,
} from '../models/validator'
import prisma from '@shared/lib/prisma'
import { encrypt } from '@shared/api/encryption'

const createIntegration = async (
  values: CreateIntegrationType
): Promise<ActionResult> => {
  const user = await requireAuth()

  const { provider, title, token, expiresAt } =
    CreateIntegrationSchema.parse(values)

  const encryptedToken = await encrypt(token)

  await prisma.integrationToken.create({
    data: {
      provider,
      title,
      token: encryptedToken,
      tokenPreview: token.slice(0, 4),
      expiresAt,
      userId: user.id,
    },
  })

  return {
    success: true,
  }
}

export const createIntegrationAction = withActionErrorHandler(createIntegration)
