import { NextResponse } from 'next/server'
import { auth } from '@shared/api/auth'
import { checkRouteAccess } from '@shared/utils/check-route-access'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user
  const routeAccess = checkRouteAccess(pathname, user)

  if (!routeAccess.success) {
    return NextResponse.redirect(
      new URL(
        routeAccess.reason === 'unauthenticated' ? '/auth/sign-in' : '/',
        req.nextUrl
      )
    )
  }

  if (user?.emailVerified === null && pathname !== '/auth/verify-email') {
    return NextResponse.redirect(new URL('/auth/verify-email', req.nextUrl))
  }
})

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|offline|offline.html|~offline).*)',
}
