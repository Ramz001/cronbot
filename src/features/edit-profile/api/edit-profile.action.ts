'use server'

import prisma from '@/shared/lib/prisma'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import {
  EditProfileSchema,
  type EditProfileSchemaType,
} from '../schemas/edit-profile.schema'
import { requireAuth } from '@shared/api/auth.guard'
import { ActionSuccess } from '@shared/api/server-error-handlers'

const editProfile = async (
  values: EditProfileSchemaType
): Promise<ActionSuccess<typeof updatedUser>> => {
  const user = await requireAuth()

  const { name } = await EditProfileSchema.parseAsync(values)

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
    },
  })

  return { success: true, data: updatedUser }
}

export const editProfileAction = withActionErrorHandler(editProfile)
