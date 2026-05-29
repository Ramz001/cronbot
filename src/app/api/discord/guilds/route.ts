import { withRouteErrorHandler } from '@shared/api/server-error-handlers'
import { getGuilds } from '@entities/discord'

export const GET = withRouteErrorHandler(getGuilds)
