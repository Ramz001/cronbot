import z from 'zod'

export const AutomationRunSchema = z.object({
  id: z.string(),
})

export type AutomationRunType = z.infer<typeof AutomationRunSchema>
