import { NextResponse, NextRequest } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { authHeaders } from '../utils/discord-auth-headers'
import { DISCORD_API } from '../consts/discord'
import { requireAuth } from '@shared/api/auth.guard'
import axios from 'axios'
import { cacheLife, cacheTag } from 'next/cache'
import z from 'zod'

const ParamsSchema = z.string().min(1, 'Guild ID is required')

export async function getGuildChannels(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<RouteResult<unknown>> {
  // 1. Auth + params outside cache (request-specific)
  const user = await requireAuth()
  const { id } = await params
  const guildId = ParamsSchema.parse(id)

  // 2. Call cached inner function with args
  const data = await fetcher(user.id, guildId)

  return NextResponse.json({ success: true, data })
}

const fetcher = async (userId: string, guildId: string) => {
  'use cache'
  cacheLife('minutes')
  cacheTag('discord-guild-channels', userId, guildId)

  const headers = await authHeaders({ userId })

  const { data } = await axios.get(
    `${DISCORD_API}/guilds/${guildId}/channels`,
    { headers }
  )

  return data
}
