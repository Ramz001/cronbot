'use server'

import { requireAuth } from '@shared/api/auth.guard'
import {
  ActionResult,
  withActionErrorHandler,
} from '@shared/api/server-error-handlers'
import {
  DeleteAutomationSchema,
  DeleteAutomationType,
} from '../model/validator'
import prisma from '@shared/utils/prisma'
import { cache, CACHE_KEYS } from '@shared/api/cache'

const deleteAutomation = async (
  values: DeleteAutomationType
): Promise<ActionResult> => {
  const user = await requireAuth()

  const { id } = DeleteAutomationSchema.parse(values)

  await prisma.automation.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })

  await cache.del(`${CACHE_KEYS.AUTOMATION}:${user.id}`)

  return { success: true }
}

export const deleteAutomationAction = withActionErrorHandler(deleteAutomation)
