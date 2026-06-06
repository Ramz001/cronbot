import { NextRequest } from 'next/server'
import {
  RouteResult,
  withRouteErrorHandler,
} from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from '@entities/discord'
import { SendMessageBody } from '../model/send-message-body'
import { requireAuth } from '@shared/api/auth.guard'
import axios from 'axios'

async function sendMessage(req: NextRequest): Promise<RouteResult<string>> {
  const user = await requireAuth()
  const headers = await authHeaders({ userId: user.id })
  const body = await req.json()

  const { message, channelId } = SendMessageBody.parse(body)

  const { data } = await axios.post(
    `${DISCORD_API}/channels/${channelId}/messages`,
    { content: message },
    { headers }
  )

  return data?.id
}

export const sendMessageRoute = withRouteErrorHandler(sendMessage)
