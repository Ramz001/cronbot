export class HttpError extends Error {
  public readonly statusCode: number
  public readonly error: string

  constructor(statusCode: number, message: string, error?: string) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.error = error || getErrorName(statusCode)
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.error,
    }
  }
}

function getErrorName(status: number): string {
  const names: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    408: 'Request Timeout',
    409: 'Conflict',
    413: 'Payload Too Large',
    415: 'Unsupported Media Type',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  }
  return names[status] || 'Unknown Error'
}

// 4xx Client Errors
export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message)
  }
}

export class PaymentRequiredError extends HttpError {
  constructor(message = 'Payment Required') {
    super(402, message)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message)
  }
}

export class MethodNotAllowedError extends HttpError {
  constructor(message = 'Method Not Allowed') {
    super(405, message)
  }
}

export class NotAcceptableError extends HttpError {
  constructor(message = 'Not Acceptable') {
    super(406, message)
  }
}

export class RequestTimeoutError extends HttpError {
  constructor(message = 'Request Timeout') {
    super(408, message)
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message)
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = 'Payload Too Large') {
    super(413, message)
  }
}

export class UnsupportedMediaTypeError extends HttpError {
  constructor(message = 'Unsupported Media Type') {
    super(415, message)
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'Unprocessable Entity') {
    super(422, message)
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = 'Too Many Requests') {
    super(429, message)
  }
}

// 5xx Server Errors
export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(500, message)
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = 'Not Implemented') {
    super(501, message)
  }
}

export class BadGatewayError extends HttpError {
  constructor(message = 'Bad Gateway') {
    super(502, message)
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = 'Service Unavailable') {
    super(503, message)
  }
}

export class GatewayTimeoutError extends HttpError {
  constructor(message = 'Gateway Timeout') {
    super(504, message)
  }
}
