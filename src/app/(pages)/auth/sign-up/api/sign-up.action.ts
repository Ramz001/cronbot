'use server'

import prisma from '@shared/lib/prisma'
import bcrypt from 'bcryptjs'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { ActionSuccess } from '@shared/api/server-error-handlers'
import { SignUpSchema, type SignUpSchemaType } from '@shared/models/auth.schema'

const signUp = async (
  values: SignUpSchemaType
): Promise<ActionSuccess<undefined>> => {
  const { email, password, name } = await SignUpSchema.parseAsync(values)

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      updatedAt: new Date(),
    },
  })

  return { success: true }
}

export const signUpAction = withActionErrorHandler(signUp)
