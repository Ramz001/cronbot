import { Provider } from '@prisma/generated/enums'
import z from 'zod'

export const CreateIntegrationSchema = z.object({
  provider: z.enum(Provider),
  title: z.string().max(100).optional(),
  token: z.string().min(1, 'Token is required'),
  expiresAt: z.coerce.date(),
})

export type CreateIntegrationType = z.infer<typeof CreateIntegrationSchema>
