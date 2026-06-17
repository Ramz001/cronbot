'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import {
  CreateIntegrationSchema,
  CreateIntegrationType,
} from '../model/validator'
import prisma from '@shared/utils/prisma'
import { encrypt } from '@shared/api/encryption'
import { cache } from '@shared/api/cache'
import { cacheKeys } from '@shared/consts/cache'

const createIntegration = async (values: CreateIntegrationType) => {
  const user = await requireAuth()

  const { provider, title, token, expiresAt } =
    CreateIntegrationSchema.parse(values)

  const encryptedToken = await encrypt(token)

  await prisma.integrationToken.create({
    data: {
      provider,
      title,
      token: encryptedToken,
      tokenPreview: `${token.slice(0, 3)}...${token.slice(-2)}`,
      expiresAt,
      userId: user.id,
    },
  })

  await cache.del(cacheKeys.integrationToken(user.id))
  await cache.del(cacheKeys.integrationTokenCount(user.id))
}

export const createIntegrationAction = withActionErrorHandler(createIntegration)
