import { NextRequest, NextResponse } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from '@entities/discord'
import { SendMessageBody } from '../model/send-message-body'
import axios from 'axios'

export async function sendMessage(
  req: NextRequest
): Promise<RouteResult<string>> {
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
