import z from 'zod'

export const SendMessageBody = z.object({
  message: z
    .string('Message must be a string')
    .min(1, 'Message cannot be empty'),
  channelId: z
    .string('Channel ID must be a string')
    .min(1, 'Channel ID cannot be empty'),
})
