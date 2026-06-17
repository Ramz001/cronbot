import z from 'zod'

export const SendMessageBody = z.object({
  message: z
    .string('Message must be a string')
    .min(1, 'Message cannot be empty'),
  channelId: z
    .string('Channel must be a string')
    .min(1, 'Channel cannot be empty'),
})

export type SendMessageBodyType = z.infer<typeof SendMessageBody>
