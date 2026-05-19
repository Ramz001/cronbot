// import { NextResponse } from 'next/server'
// import { checkRouteAccess } from '@shared/utils/check-route-access'
// import { auth } from './auth'

// export default auth((req) => {
//   const { pathname } = req.nextUrl
//   const user = req.auth?.user
//   const routeAccess = checkRouteAccess(pathname, user)

//   if (!routeAccess.success) {
//     return NextResponse.redirect(
//       new URL(
//         routeAccess.reason === 'unauthenticated' ? '/auth/sign-in' : '/',
//         req.nextUrl
//       )
//     )
//   }

//   if (user?.emailVerified === null && pathname !== '/auth/verify-email') {
//     return NextResponse.redirect(new URL('/auth/verify-email', req.nextUrl))
//   }
// })

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from './auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if (!session) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|offline|offline.html|~offline).*)',
}
