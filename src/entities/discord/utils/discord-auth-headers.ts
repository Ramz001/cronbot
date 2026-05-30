import UserAgent from 'user-agents'
import prisma from '@shared/lib/prisma'
import { User } from 'better-auth'
import { IntegrationTokenStatus, Provider } from '@prisma/generated/enums'
import { decrypt } from '@shared/api/encryption'

const ua = new UserAgent({ deviceCategory: 'desktop' })

const SESSION_HEADERS = {
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

export const authHeaders = async ({ user }: { user: User }) => {
  if (!user?.id) throw new Error('User ID is required for auth headers')

  const integrationToken = await prisma.integrationToken.findFirstOrThrow({
    where: {
      userId: user.id,
      provider: Provider.discord,
      status: IntegrationTokenStatus.active,
    },
    select: {
      token: true,
    },
  })

  const decryptedToken = await decrypt(integrationToken.token)

  return {
    Authorization: decryptedToken,
    ...SESSION_HEADERS,
  }
}
