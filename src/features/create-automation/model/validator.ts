import { Provider } from '@prisma/generated/enums'
import z from 'zod'

export const CreateAutomationSchema = z.object({
  name: z.string().optional(),
  provider: z.enum(Provider),
  identifier: z.json(),
  body: z.json(),
})

// { guildId, channelId } discord
//

export type CreateAutomationType = z.infer<typeof CreateAutomationSchema>
