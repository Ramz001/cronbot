import { withRouteErrorHandler } from '@shared/api/server-error-handlers'
import { sendMessage } from '@features/discord-send-message'

export const POST = withRouteErrorHandler(sendMessage)
