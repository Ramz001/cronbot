import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from './auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|offline|offline.html|~offline).*)',
}
