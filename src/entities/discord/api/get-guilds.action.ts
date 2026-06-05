'use server'

import { DISCORD_API } from '../consts/discord'
import { authHeaders } from '../utils/discord-auth-headers'
import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import axios from 'axios'

const action = async () => {
  const user = await requireAuth()
  const headers = await authHeaders({ user })

  const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
    headers,
  })

  return data
}

export const getGuilds = withActionErrorHandler(action)
