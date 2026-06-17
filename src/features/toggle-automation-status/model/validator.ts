import z from 'zod'

export const ToggleAutomationStatusSchema = z.object({
  id: z.string().min(1, 'Automation ID is required'),
})

export type ToggleAutomationStatusType = z.infer<typeof ToggleAutomationStatusSchema>
