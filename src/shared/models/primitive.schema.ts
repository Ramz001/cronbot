import { Role } from '@shared/prisma/generated/enums'
import z from 'zod'

export const password = z.string().min(6)
export const email = z.email({ error: 'Invalid email address' })
export const name = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
export const role = z.enum(Role)
export const otp = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .refine((val) => /^\d{6}$/.test(val), {
    message: 'OTP must contain only digits',
  })

export type RoleType = z.infer<typeof role>
