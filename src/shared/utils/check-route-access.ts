import { Role } from '@shared/prisma/generated/enums'
import { Session } from 'next-auth'
import {
  ACCESS_POLICY,
  AccessPolicyEntry,
} from '@shared/configs/protected-routes.config'

type AccessDecision =
  | { success: true }
  | { success: false; reason: 'unauthenticated' | 'unauthorized' }

export function checkRouteAccess(
  pathname: string,
  user?: Session['user']
): AccessDecision {
  const policy = resolvePolicy(pathname)

  if (!policy || !policy.protected) {
    return { success: true }
  }

  if (!user) {
    return { success: false, reason: 'unauthenticated' }
  }

  if (
    policy.roles &&
    (!user.role || !policy.roles.includes(user.role as Role))
  ) {
    return { success: false, reason: 'unauthorized' }
  }

  return { success: true }
}

function resolvePolicy(pathname: string): AccessPolicyEntry | null {
  for (const entry of ACCESS_POLICY) {
    if (entry.matcher.test(pathname)) {
      return entry
    }
  }

  return null
}
