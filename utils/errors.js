class CustomError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export class InternalServerError extends CustomError {
  constructor (message = 'Internal Server Error') {
    super(message, 500)
  }
}

export class NotFoundError extends CustomError {
  constructor (message = 'Not Found') {
    super(message, 404)
  }
}

export class BadRequestError extends CustomError {
  constructor (message = 'Bad Request') {
    super(message, 400)
  }
}

// No include InternalServerError
const ERROR_TYPES = {
  NotFoundError,
  BadRequestError
}

export const isCustomUserError = (error) => {
  return Object.values(ERROR_TYPES).some(ErrorType => error instanceof ErrorType)
}
