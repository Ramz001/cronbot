import z from 'zod'
import { password, email, name } from '@shared/models/primitive.schema'

export const LoginSchema = z.object({
  email,
  password,
})

export type LoginSchemaType = z.infer<typeof LoginSchema>

export const SignUpSchema = z
  .object({
    name,
    email,
    password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
  })

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
