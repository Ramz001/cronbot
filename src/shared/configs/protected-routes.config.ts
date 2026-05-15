import { Role } from '@shared/prisma/generated/enums'
export const DEFAULT_UNAUTHENTICATED_REDIRECT = '/'

export type AccessPolicyEntry = {
  matcher: RegExp
  protected: boolean
  roles?: Role[]
}

export const ACCESS_POLICY: AccessPolicyEntry[] = [
  {
    matcher: /^\/settings(\/|$)/,
    protected: true,
  },
  {
    matcher: /^\/admin(\/|$)/,
    protected: true,
    roles: [Role.ADMIN],
  },
  {
    matcher: /^\/auth\/verify-email(\/|$)/,
    protected: true,
  },
]
