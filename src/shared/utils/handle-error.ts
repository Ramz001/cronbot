import { toast } from 'sonner'
import { ZodError } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

/**
 * Handles client errors (Prisma, Zod v4, generic) and shows a toast
 * @param error The caught error
 * @param hideToast Set to true to suppress toast display
 */
export function handleError(error: unknown, showToast = true) {
  let message = 'Something went wrong.'

  if (error instanceof ZodError) {
    // Zod v4: error.issues is typed as ZodIssue[]
    message = error.issues.map((issue) => issue.message).join(', ')
  } else if (error instanceof PrismaClientKnownRequestError) {
    const prismaError = error as PrismaClientKnownRequestError
    message = `Database error: ${prismaError.message}`
  } else if (error instanceof Error) {
    message = error.message
  }

  if (showToast) {
    toast.error(message)
  }

  console.error('[Client Error]:', error)
}
