import { NextResponse } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { DISCORD_API } from '../consts/discord'
import { authHeaders } from '../utils/discord-auth-headers'
import { requireAuth } from '@shared/api/auth.guard'
import axios from 'axios'

export async function getGuilds(): Promise<RouteResult> {
  const user = await requireAuth()
  const headers = await authHeaders({ user })

  const { data, status, statusText } = await axios.get(
    `${DISCORD_API}/users/@me/guilds`,
    { headers }
  )

  return NextResponse.json({ success: true, data }, { status, statusText })
}
