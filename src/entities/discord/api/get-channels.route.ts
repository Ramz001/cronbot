import { NextRequest } from 'next/server'
import { authHeaders } from '../utils/auth-headers'
import { DISCORD_API } from '../consts/api'
import { requireAuth } from '@shared/api/auth.guard'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import { GuildIdSchema } from '../model/validator'
import {
  withRouteErrorHandler,
  RouteResult,
} from '@shared/api/server-error-handlers'
import { ChannelType } from '../model/types'
import axios from 'axios'

async function getGuildChannels(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<RouteResult<ChannelType[]>> {
  const user = await requireAuth()
  const { id } = await params
  const guildId = GuildIdSchema.parse(id)

  return await cache.wrap(
    `${CACHE_KEYS.DISCORD_CHANNELS}:${user.id}:${guildId}`,
    async () => {
      const headers = await authHeaders({ userId: user.id })

      const { data } = await axios.get(
        `${DISCORD_API}/guilds/${guildId}/channels`,
        { headers }
      )

      return data
    }
  )
}

export const getGuildChannelsRoute = withRouteErrorHandler(getGuildChannels)
