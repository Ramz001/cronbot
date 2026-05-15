'use server'

import resend from '@/shared/lib/resend'
import OTPEmail from '@shared/emails/otp-email'
import prisma from '@shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionSuccess,
} from '@shared/api/server-error-handlers'
import {
  SendEmailSchema,
  type SendEmailType,
} from '../models/verify-email.schema'
import { requireAuth } from '@shared/api/auth.guard'
import { handleRateLimit } from '@shared/api/handle-rate-limit'

const EMAIL_EXPIRY_MINUTES = 5

const sendEmailOTP = async (
  values: SendEmailType
): Promise<ActionSuccess<typeof data>> => {
  await handleRateLimit({
    action: 'send_email_otp',
    points: 1,
  })
  await requireAuth()

  const { email, name } = SendEmailSchema.parse(values)

  const randomCode = Math.floor(100000 + Math.random() * 900000).toString()

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: randomCode,
      expires: new Date(Date.now() + EMAIL_EXPIRY_MINUTES * 60000),
    },
  })

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_SEND_EMAIL || '',
    to: [email],
    subject: 'Your OTP Code',
    react: OTPEmail({
      otp: randomCode,
      name,
      expiryTime: `${EMAIL_EXPIRY_MINUTES} minutes`,
    }),
  })

  if (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`)
  }

  return { success: true, data }
}

export const sendEmailOTPAction = withActionErrorHandler(sendEmailOTP)
