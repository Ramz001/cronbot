import { NextRequest, NextResponse } from 'next/server'
import {
  RouteResult,
  withRouteErrorHandler,
} from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from '@shared/api/discord/utils'
import axios from 'axios'
import z from 'zod'

const ParamsSchema = z.string().min(1, 'Guild ID is required')

async function getGuildChannels(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<RouteResult<unknown>> {
  const headers = authHeaders({ token: '' })

  const { id } = await params
  const guildId = ParamsSchema.parse(id)

  const { data, status, statusText } = await axios.get(
    `${DISCORD_API}/guilds/${guildId}/channels`,
    { headers }
  )

  const textChannels = data
    .filter((c: { type: number }) => c.type === 0)
    .map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))

  console.log('Text channels:', textChannels)
  console.log('Raw API response:', data)

  return NextResponse.json({ success: true, data }, { status, statusText })
}

export const GET = withRouteErrorHandler(getGuildChannels)
