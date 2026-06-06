import UserAgent from 'user-agents'
import prisma from '@shared/lib/prisma'
import { IntegrationTokenStatus, Provider } from '@prisma/generated/enums'
import { decrypt } from '@shared/api/encryption'
import { cacheLife, cacheTag } from 'next/cache'

function getSessionHeaders() {
  const ua = new UserAgent({ deviceCategory: 'desktop' })

  return {
    'User-Agent': ua.toString(),
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    Connection: 'keep-alive',
    'sec-ch-ua':
      '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
  }
}

const fetcher = async (userId: string) => {
  'use cache'
  cacheLife('hours')
  cacheTag(`discord-token:${userId}`)

  const integrationToken = await prisma.integrationToken.findFirstOrThrow({
    where: {
      userId: userId,
      provider: Provider.discord,
      status: IntegrationTokenStatus.active,
    },
    select: {
      token: true,
    },
  })

  return await decrypt(integrationToken.token)
}

export const authHeaders = async ({ userId }: { userId: string }) => {
  if (!userId) throw new Error('User ID is required for auth headers')

  const decryptedToken = await fetcher(userId)

  return {
    Authorization: decryptedToken,
    ...getSessionHeaders(),
  }
}
