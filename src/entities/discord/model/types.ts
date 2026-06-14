import z from 'zod'
import { Provider } from '@prisma/generated/enums'

const PermissionOverwriteSchema = z.object({
  id: z.string(),
  type: z.number(),
  allow: z.string(),
  deny: z.string(),
})

const ChannelSchema = z.object({
  id: z.string(),
  type: z.number(),
  last_message_id: z.string().nullable(),
  flags: z.number(),
  guild_id: z.string(),
  name: z.string(),
  parent_id: z.string().nullable(),
  rate_limit_per_user: z.number(),
  topic: z.string().nullable(),
  position: z.number(),
  permission_overwrites: z.array(PermissionOverwriteSchema).optional(),
  bitrate: z.number().optional(),
  user_limit: z.number().optional(),
  nsfw: z.boolean(),
})

export type ChannelType = z.infer<typeof ChannelSchema>

const GuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  banner: z.string().nullable(),
  owner: z.boolean(),
  permissions: z.string(),
  features: z.array(z.string()),
})

export type GuildType = z.infer<typeof GuildSchema>
 
export type ProviderInfo = {
  value: Provider
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}
