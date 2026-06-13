'use server'

import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import {
  CreateIntegrationSchema,
  CreateIntegrationType,
} from '../model/validator'
import prisma from '@shared/lib/prisma'
import { encrypt } from '@shared/api/encryption'
import { cache, CACHE_KEYS } from '@shared/api/cache'

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

  await cache.del(`${CACHE_KEYS.INTEGRATION_TOKEN}:${user.id}`)
  await cache.del(`${CACHE_KEYS.INTEGRATION_TOKEN_COUNT}:${user.id}`)
}

export const createIntegrationAction = withActionErrorHandler(createIntegration)
