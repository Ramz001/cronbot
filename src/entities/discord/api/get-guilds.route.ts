import { NextResponse } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from './utils'
import axios from 'axios'

export async function getGuilds(): Promise<RouteResult> {
  const headers = authHeaders({ token: '' })

  const { data, status, statusText } = await axios.get(
    `${DISCORD_API}/users/@me/guilds`,
    { headers }
  )

  return NextResponse.json({ success: true, data }, { status, statusText })
}
