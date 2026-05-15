'use server'

import { RateLimiterPrisma, RateLimiterRes } from 'rate-limiter-flexible'

import z from 'zod'
import { requireAuth } from './auth.guard'
import prisma from '@shared/lib/prisma'
import { headers } from 'next/headers'

export enum RATE_LIMIT_METHODS {
  ip = 'ip',
  session = 'session',
}

const limiterCache = new Map()

async function getUserIP() {
  const headersList = await headers()

  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    '127.0.0.1' // Fallback for local development

  return ip
}

const getLimiter = (points: number, duration: number) => {
  const cacheKey = `${points}:${duration}`

  if (!limiterCache.has(cacheKey)) {
    limiterCache.set(
      cacheKey,
      new RateLimiterPrisma({
        storeClient: prisma,
        points,
        duration,
      })
    )
  }

  return limiterCache.get(cacheKey)
}

/**
 * Zod schema for validation
 */
const RateLimitSchema = z.object({
  action: z.string().min(1), // REQUIRED for namespacing
  method: z.enum(RATE_LIMIT_METHODS).default(RATE_LIMIT_METHODS.session),
  points: z.int().positive().default(120), // DEFAULT points
  duration: z.int().positive().default(60), // DEFAULT duration
})

type RateLimitOptions = z.input<typeof RateLimitSchema>

const RATE_LIMIT_DEBUG = process.env.RATE_LIMIT_DEBUG === '1'

const buildKey = (action: string, method: string, identifier: string) =>
  `${action}:${method}:${identifier}`

export const handleRateLimit = async (options: RateLimitOptions) => {
  try {
    const { action, method, points, duration } = RateLimitSchema.parse(options)

    let identifier

    switch (method) {
      case RATE_LIMIT_METHODS.ip:
        identifier = await getUserIP()
        break

      case RATE_LIMIT_METHODS.session: {
        const user = await requireAuth()
        identifier = user.id
        break
      }

      default:
        identifier = await getUserIP()
    }

    const key = buildKey(action, method, identifier)
    const limiter = getLimiter(points, duration)

    let start = 0

    if (RATE_LIMIT_DEBUG) {
      start = performance.now()
    }

    await limiter.consume(key)

    if (RATE_LIMIT_DEBUG) {
      console.debug({
        module: 'rate-limit',
        rateLimitKey: key,
        points,
        duration,
        tookMs: Math.round(performance.now() - start),
      })
    }
  } catch (error: unknown) {
    if (error instanceof RateLimiterRes) {
      throw new Error(
        `Rate limit exceeded. Retry in ${Math.ceil(
          error.msBeforeNext / 1000
        )}s.`
      )
    }

    console.error({ error, message: 'Rate limiter failure' })
  }
}
