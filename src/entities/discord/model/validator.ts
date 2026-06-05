import z from 'zod'

const GuildIdSchema = z.string().min(1, 'Guild ID is required')

export const GetChannelsSchema = z.object({
  guildId: GuildIdSchema,
})

export type GetChannelsType = z.infer<typeof GetChannelsSchema>
