import z from 'zod'
import { email, role } from '@shared/models/primitive.schema'

export const UpdateRoleSchema = z.object({
  email,
  role,
})

export type UpdateRoleSchemaType = z.infer<typeof UpdateRoleSchema>
