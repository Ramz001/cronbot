import { withRouteErrorHandler } from '@shared/api/server-error-handlers'
import { getGuildChannels } from '@entities/discord'

export const GET = withRouteErrorHandler(getGuildChannels)
