import { NextRequest, NextResponse } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from '@entities/discord'
import { SendMessageBody } from '../model/send-message-body'
import { requireAuth } from '@shared/api/auth.guard'
import axios from 'axios'

export async function sendMessage(
  req: NextRequest
): Promise<RouteResult<string>> {
  const user = await requireAuth()
  const headers = await authHeaders({ user })
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
