import z from 'zod'

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
  permission_overwrites: z.array(z.any()),
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

//  {
//     id: '1487166703812087991',
//     type: 0,
//     last_message_id: null,
//     flags: 0,
//     guild_id: '1308004810154577951',
//     name: 'hbo-hooks',
//     parent_id: '1308004810154577952',
//     rate_limit_per_user: 0,
//     topic: null,
//     position: 6,
//     permission_overwrites: [ [Object], [Object] ],
//     nsfw: false
//   },

// user [
//   {
//     id: '1071376204705312798',
//     name: "Ramz001's server",
//     icon: null,
//     banner: null,
//     owner: true,
//     permissions: '18014398509481983',
//     features: []
//   },
//   {
//     id: '1308004810154577951',
//     name: 'Kardeşler Çiçekçilik',
//     icon: '8a473fba1dcc659b211337519201b1ff',
//     banner: null,
//     owner: false,
//     permissions: '2248473465835073',
//     features: [ 'TIERLESS_BOOSTING_SYSTEM_MESSAGE' ]
//   }
// ]
