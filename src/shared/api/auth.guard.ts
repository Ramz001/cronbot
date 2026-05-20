import { auth } from '@/auth'
import { User } from 'better-auth'
import { headers } from 'next/headers'

/**
 * Throws if the user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  return session.user
}
