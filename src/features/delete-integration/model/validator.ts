import z from 'zod'

export const DeleteIntegrationSchema = z.object({
  id: z.string().min(1, 'Integration ID is required'),
})

export type DeleteIntegrationType = z.infer<typeof DeleteIntegrationSchema>
