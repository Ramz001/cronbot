import z from 'zod'
import { email, name, otp } from '@shared/models/primitive.schema'

export const SendEmailSchema = z.object({
  email,
  name,
})

export const ConfirmEmailOTPSchema = z.object({
  email,
  otp,
})

export type ConfirmEmailOTPType = z.infer<typeof ConfirmEmailOTPSchema>
export type SendEmailType = z.infer<typeof SendEmailSchema>
