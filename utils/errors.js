class CustomError extends Error {
  constructor (message, statusCode, name = 'CustomError') {
    super(message)
    this.statusCode = statusCode
    this.name = name
  }
}

export class InternalServerError extends CustomError {
  constructor (message = 'Internal Server Error') {
    super(message, 500)
    this.name = 'InternalServerError'
  }
}

export class NotFoundError extends CustomError {
  constructor (message = 'Not Found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class BadRequestError extends CustomError {
  constructor (message = 'Bad Request') {
    super(message, 400)
    this.name = 'BadRequestError'
  }
}

export class InsufficientStockError extends CustomError {
  constructor (message = 'Insufficient ingredients stock', details = []) {
    super(message, 400)
    this.name = 'InsufficientStockError'
    this.details = details
  }
}

// No include InternalServerError
const ERROR_TYPES = {
  NotFoundError,
  BadRequestError,
  InsufficientStockError
}

export const isCustomUserError = (error) => {
  return Object.values(ERROR_TYPES).some(ErrorType => error instanceof ErrorType)
}
