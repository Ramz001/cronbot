import { NextRequest, NextResponse } from 'next/server'
import {
  RouteResult,
  withRouteErrorHandler,
} from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from '@shared/api/discord/utils'
import axios from 'axios'
import z from 'zod'

const SendMessageBody = z.object({
  message: z
    .string('Message must be a string')
    .min(1, 'Message cannot be empty'),
  channelId: z
    .string('Channel ID must be a string')
    .min(1, 'Channel ID cannot be empty'),
})

async function sendMessage(req: NextRequest): Promise<RouteResult<string>> {
  const headers = authHeaders({ token: '' })
  const body = await req.json()

  const { message, channelId } = SendMessageBody.parse(body)

  const { data, status, statusText } = await axios.post(
    `${DISCORD_API}/channels/${channelId}/messages`,
    { content: message },
    { headers }
  )

  return NextResponse.json(
    { success: true, data: data.id },
    { status, statusText }
  )
}

export const POST = withRouteErrorHandler(sendMessage)
