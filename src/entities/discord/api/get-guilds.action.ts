'use server'

import { DISCORD_API } from '../consts/discord'
import { authHeaders } from '../utils/discord-auth-headers'
import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import axios from 'axios'
import { cacheLife, cacheTag } from 'next/cache'
import { GuildType } from '../model/types'

const fetcher = async (userId: string): Promise<GuildType[]> => {
  'use cache'
  cacheLife('hours')
  cacheTag('discord-guilds', userId)

  const headers = await authHeaders({ userId })

  const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
    headers,
  })

  console.log('Fetched guilds for user', data)
  return data
}

const action = async () => {
  const user = await requireAuth()
  return fetcher(user.id)
}

export const getGuilds = withActionErrorHandler(action)
