import z from 'zod'

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
