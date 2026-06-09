import { NextRequest, NextResponse } from 'next/server'
import { env } from '@shared/configs/env'
import { cache, CACHE_KEYS } from '@shared/api/cache'
import { withRouteErrorHandler } from '@shared/api/server-error-handlers'
import z from 'zod'

const AuthHeader = z
  .string()
  .startsWith('Bearer ')
  .transform((value) => value.replace('Bearer ', ''))
  .refine((token) => token === env.CACHE_WEBHOOK_SECRET, {
    message: 'Unauthorized',
  })

const Body = z.object({
  key: z.enum(CACHE_KEYS),
})

async function cacheClear(req: NextRequest) {
  AuthHeader.parse(req.headers.get('authorization'))

  const body = Body.parse(await req.json())

  await cache.del(body.key)

  return NextResponse.json({
    success: true,
    key: body.key,
  })
}

export const POST = withRouteErrorHandler(cacheClear)
