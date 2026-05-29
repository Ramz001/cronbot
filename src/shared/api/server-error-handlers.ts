import { mapError, type MapErrorResult } from './map-error'
import { NextResponse, type NextRequest } from 'next/server'

export type ActionSuccess<T = void> = {
  success: true
  data?: T
}

export type ActionError = MapErrorResult & {
  success: false
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionError

export type RouteSuccess<T = void> = NextResponse<{
  success: true
  data?: T
}>

export type RouteError = MapErrorResult &
  NextResponse<{
    success: false
  }>

export type RouteResult<T = void> = RouteSuccess<T> | RouteError

/**
 * Wrap any async server handler to catch errors.
 * Ignores the handler's normal return value — only ensures errors are handled consistently.
 */
export function withActionErrorHandler<Args extends unknown[], T>(
  handler: (...args: Args) => Promise<ActionResult<T>>
) {
  return async (...args: Args) => {
    try {
      return await handler(...args)
    } catch (error: unknown) {
      const { error: mappedError, status } = mapError(error)

      const logInfo =
        error instanceof Error
          ? { message: error.message, response: (error as any).response?.data }
          : error
      console.error('[Server Action Error]:', logInfo)

      return {
        success: false,
        error: mappedError,
        status,
      }
    }
  }
}

/**
 * Wrap any async server handler to catch errors.
 * Ignores the handler's normal return value — only ensures errors are handled consistently.
 */
export const withRouteErrorHandler = <TContext extends unknown[]>(
  handler: (req: NextRequest, ...args: TContext) => Promise<NextResponse>
) => {
  return async (req: NextRequest, ...args: TContext): Promise<NextResponse> => {
    try {
      return await handler(req, ...args)
    } catch (error) {
      const { error: mappedError, status } = mapError(error)

      console.error(`[Route Error] ${(error as Error)?.message}`)

      return NextResponse.json(
        { success: false, error: mappedError },
        { status }
      )
    }
  }
}

export function isSuccess<T = void>(
  res: ActionResult<T>
): res is ActionSuccess<T> {
  return res.success === true
}
