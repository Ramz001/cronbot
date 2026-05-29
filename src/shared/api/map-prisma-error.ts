import { Prisma } from '@prisma/generated/client'

export type PrismaErrorResult = {
  error: { message: string; details?: any; code?: string }
  status: number
}

export function mapPrismaError(error: any): PrismaErrorResult {
  // Known request errors (P2002, P2003, P2025, etc.)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const field = extractUniqueField(error)

        return {
          error: {
            message: correctUniqueCheckMessage(field),
            code: error.code,
            details: createErrorDetails(error),
          },
          status: 409, // HTTP_STATUS_CODES.CONFLICT
        }
      }
      case 'P2003':
        return {
          error: {
            message: 'Foreign key constraint failed',
            code: error.code,
            details: createErrorDetails(error),
          },
          status: 409, // HTTP_STATUS_CODES.CONFLICT
        }
      case 'P2025':
        return {
          error: {
            message: 'Resource not found',
            code: error.code,
            details: createErrorDetails(error),
          },
          status: 404, // HTTP_STATUS_CODES.NOT_FOUND
        }
      default:
        return {
          error: {
            message: 'Database error',
            code: error.code,
            details: createErrorDetails(error),
          },
          status: 500, // HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        }
    }
  }

  // Unknown Prisma errors
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      error: {
        message: 'Unknown database error',
        details: createErrorDetails(error),
      },
      status: 500,
    }
  }

  // Prisma engine panic
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      error: {
        message: 'Database engine error',
        details: createErrorDetails(error),
      },
      status: 500,
    }
  }

  // Initialization / connection error
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      error: {
        message: 'Database connection error',
        details: createErrorDetails(error),
      },
      status: 500,
    }
  }

  // Validation error (developer passed invalid query)
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('[Prisma Validation Error]:', error.message)
    return {
      error: {
        message: 'Database validation failed',
        details: createErrorDetails(error),
      },
      status: 500,
    }
  }

  // Fallback for unexpected errors
  return {
    error: {
      message: 'Unexpected database error',
    },
    status: 500,
  }
}

export function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  )
}

function createErrorDetails(error: any) {
  if (!error || typeof error !== 'object') return null

  const {
    cause,
    stack,
    clientVersion,
    retryable,
    code,
    batchRequestIdx,
    meta,
  } = error

  const hasAnyProperty =
    cause !== undefined ||
    stack !== undefined ||
    clientVersion !== undefined ||
    retryable !== undefined ||
    code !== undefined ||
    batchRequestIdx !== undefined ||
    meta !== undefined

  if (!hasAnyProperty) return null

  return {
    cause,
    stack,
    clientVersion,
    retryable,
    code,
    batchRequestIdx,
    meta,
  }
}

const correctUniqueCheckMessage = (field: string | undefined) => {
  switch (field) {
    case 'email':
      return 'Email already exists'
    case 'phone':
      return 'Phone already exists'
    default:
      return field ? `${field} already exists` : 'Record already exists'
  }
}

const extractUniqueField = (error: any) => {
  // Prisma <=5
  const legacyTarget = error.meta?.target
  if (Array.isArray(legacyTarget) && legacyTarget.length > 0) {
    return legacyTarget[0]
  }

  // Prisma 6+ (driver adapter)
  const adapterField =
    error.meta?.driverAdapterError?.cause?.constraint?.fields?.[0]

  if (typeof adapterField === 'string') {
    return adapterField
  }

  return undefined
}
