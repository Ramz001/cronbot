'use server'

import prisma from '@/shared/lib/prisma'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import {
  UpdateRoleSchema,
  type UpdateRoleSchemaType,
} from '../models/update-role.schema'
import { requireAdmin } from '@shared/api/auth.guard'
import { ActionSuccess } from '@shared/api/server-error-handlers'

const updateUserRole = async (
  values: UpdateRoleSchemaType
): Promise<ActionSuccess<typeof updatedUser>> => {
  await requireAdmin()

  const { email, role } = await UpdateRoleSchema.parseAsync(values)

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role },
  })

  return { success: true, data: updatedUser }
}

export const updateUserRoleAction = withActionErrorHandler(updateUserRole)
