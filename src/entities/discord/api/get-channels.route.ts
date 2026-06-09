import { NextRequest } from 'next/server'
import { RouteResult } from '@shared/api/server-error-handlers'
import { authHeaders } from '../utils/auth-headers'
import { DISCORD_API } from '../consts/discord'
import { requireAuth } from '@shared/api/auth.guard'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import axios from 'axios'
import { GuildIdSchema } from '../model/validator'
import { withRouteErrorHandler } from '@shared/api/server-error-handlers'
import { ChannelType } from '../model/types'

const fetcher = async (userId: string, guildId: string) => {
  return cache.wrap(
    `${CACHE_KEYS.DISCORD_CHANNELS}:${userId}:${guildId}`,
    async () => {
      const headers = await authHeaders({ userId })

      const { data } = await axios.get(
        `${DISCORD_API}/guilds/${guildId}/channels`,
        { headers }
      )

      return data
    }
  )
}

async function getGuildChannels(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<RouteResult<ChannelType[]>> {
  const user = await requireAuth()
  const { id } = await params
  const guildId = GuildIdSchema.parse(id)

  return await fetcher(user.id, guildId)
}

export const getGuildChannelsRoute = withRouteErrorHandler(getGuildChannels)
