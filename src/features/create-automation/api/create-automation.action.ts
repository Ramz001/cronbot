'use server'

import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { AutomationCreateInput } from '@prisma/generated/models'
import { requireAuth } from '@shared/api/auth.guard'
import { CreateAutomationSchema, CreateAutomationType } from '../model/validator'
import prisma from '@shared/utils/prisma'
import { cache, CACHE_KEYS } from '@shared/api/cache'

const action = async (values: CreateAutomationType) => {
  const user = await requireAuth()
  const { name, provider, body, identifier } =
    CreateAutomationSchema.parse(values)

  await prisma.automation.create({
    data: {
      name: name || '',
      provider,
      body: body || {},
      identifier: identifier || {},
      userId: user.id,
    },
  })

  await cache.del(`${CACHE_KEYS.AUTOMATION}:${user.id}`)
}

export const createAutomation = withActionErrorHandler(action)
