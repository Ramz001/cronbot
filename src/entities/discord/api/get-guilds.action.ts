import { DISCORD_API } from '../consts/api'
import { authHeaders } from '../utils/auth-headers'
import { requireAuth } from '@shared/api/auth.guard'
import { withActionErrorHandler } from '@shared/api/server-error-handlers'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import axios from 'axios'
import { GuildType } from '../model/types'

const action = async (): Promise<GuildType[]> => {
  const user = await requireAuth()

  return cache.wrap(`${CACHE_KEYS.DISCORD_GUILD}:${user.id}`, async () => {
    const headers = await authHeaders({ userId: user.id })

    const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers,
    })

    return data
  })
}

export const getGuilds = withActionErrorHandler(action)
