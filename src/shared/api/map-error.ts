import { AxiosError } from 'axios'
import z from 'zod'
import { isPrismaError, mapPrismaError } from './map-prisma-error'
import { HttpError } from './errors'

export type MapErrorResult = {
  error: { message: string; issues?: Array<z.core.$ZodIssue> }
  status: number
}

export function mapError(error: unknown): MapErrorResult {
  if (error instanceof z.ZodError) {
    return {
      error: {
        message: 'Validation failed',
        issues: error.issues,
      },
      status: 400,
    }
  }

  // Handle AxiosErrors first since they extend Error
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred during the API request'

    return {
      error: { message },
      status: error.response?.status || 500,
    }
  }

  // Handle Prisma errors
  if (isPrismaError(error)) {
    return mapPrismaError(error)
  }

  // Handle HttpError instances (preserves NestJS-style status code)
  if (error instanceof HttpError) {
    return {
      error: { message: error.message },
      status: error.statusCode,
    }
  }

  // Handle Error instances
  if (error instanceof Error) {
    return {
      error: { message: error.message },
      status: 500,
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      error: { message: error },
      status: 500,
    }
  }

  // Default error
  return {
    error: { message: 'An unexpected error occurred' },
    status: 500,
  }
}
