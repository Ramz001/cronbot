import { NextResponse } from 'next/server'
import {
  RouteResult,
  withRouteErrorHandler,
} from '@shared/api/server-error-handlers'
import { DISCORD_API, authHeaders } from '@shared/api/discord/utils'
import axios from 'axios'

async function getGuilds(): Promise<RouteResult<unknown>> {
  const headers = authHeaders()

  const { data, status, statusText } = await axios.get(
    `${DISCORD_API}/users/@me/guilds`,
    { headers }
  )

  return NextResponse.json({ success: true, data }, { status, statusText })
}

export const GET = withRouteErrorHandler(getGuilds)
