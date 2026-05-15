import z from 'zod'
import { email, name } from '@shared/models/primitive.schema'

export const EditProfileSchema = z.object({
  name,
  email,
})

export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>
