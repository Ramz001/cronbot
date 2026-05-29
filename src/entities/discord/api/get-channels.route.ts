import { NextResponse, NextRequest } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { authHeaders } from '../utils/discord-auth-headers'
import { DISCORD_API } from '../consts/discord'
import { requireAuth } from '@shared/api/auth.guard'
import axios from 'axios'
import z from 'zod'

const ParamsSchema = z.string().min(1, 'Guild ID is required')

export async function getGuildChannels(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<RouteResult<unknown>> {
  const user = await requireAuth()
  const headers = await authHeaders({ user })

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
