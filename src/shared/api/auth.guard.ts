import { auth } from '@/auth'
import { User } from 'better-auth'
import { headers } from 'next/headers'
import { UnauthorizedError } from './errors'

/**
 * Throws if the user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    throw new UnauthorizedError('User is not authenticated')
  }

  return session.user
}
