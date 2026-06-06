'use server'

import { DISCORD_API } from '../consts/discord'
import { authHeaders } from '../utils/discord-auth-headers'
import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import axios from 'axios'
import { cacheLife, cacheTag } from 'next/cache'

const action = async () => {
  const user = await requireAuth()
  return fetcher(user.id)
}

const fetcher = async (userId: string) => {
  'use cache'
  cacheLife('minutes')
  cacheTag('discord-guilds', userId)

  const headers = await authHeaders({ userId })

  const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
    headers,
  })

  return data
}

export const getGuilds = withActionErrorHandler(action)
