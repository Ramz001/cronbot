'use server'

import prisma from '@shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionSuccess,
} from '@shared/api/server-error-handlers'
import {
  ConfirmEmailOTPSchema,
  type ConfirmEmailOTPType,
} from '../models/verify-email.schema'
import { requireAuth } from '@shared/api/auth.guard'

const confirmEmailOTP = async (
  values: ConfirmEmailOTPType
): Promise<ActionSuccess<typeof user>> => {
  await requireAuth()
  const { email, otp } = ConfirmEmailOTPSchema.parse(values)

  // Find the verification token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token: otp,
      },
    },
  })

  if (!verificationToken) {
    throw new Error('Invalid or expired OTP code')
  }

  // Check if the token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
    })
    throw new Error('OTP code has expired')
  }

  // Update user's emailVerified field
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  // Delete the used verification token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token: otp,
      },
    },
  })

  return { success: true, data: user }
}

export const confirmEmailOTPAction = withActionErrorHandler(confirmEmailOTP)
