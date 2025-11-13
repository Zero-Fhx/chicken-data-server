import { TimestampService } from './timestamp.js'

export const handleResponse = async ({ res, status = 200, data = null, message = null, pagination = null, filters = null, timestamp = null }) => {
  const hasFilters = filters !== null && Object.keys(filters).length > 0
  const meta = {}
  if (pagination !== null) meta.pagination = pagination
  if (hasFilters) meta.filters = filters

  const response = {
    success: status >= 200 && status < 300,
    ...(message !== null && { message }),
    ...(data !== null && { data }),
    ...(Object.keys(meta).length > 0 && { meta }),
    timestamp: timestamp || await TimestampService.getDbTimestamp()
  }

  return res.status(status).json(response)
}

export const handleError = async ({ res, status = 500, error = { message: 'Internal Server Error' } }) => {
  const statusCode = (error && (error.statusCode || error.status)) || status

  const response = {
    success: false,
    error: {
      type: (error && (error.constructor && error.constructor.name)) || 'Error',
      message: (error && (error.message || error)) || 'Internal Server Error',
      ...(error && error.details && { details: error.details })
    },
    timestamp: await TimestampService.getDbTimestamp()
  }

  return res.status(statusCode).json(response)
}

export const handleValidationError = async ({ res, status = 400, error }) => {
  const response = {
    success: false,
    error: {
      type: 'ValidationError',
      message: 'Validation Failed',
      ...(error && { details: (error.issues || error.errors || error.message || error) })
    },
    timestamp: await TimestampService.getDbTimestamp()
  }
  return res.status(status).json(response)
}

export const handlePageError = async ({ res, status = 400, error }) => {
  const response = {
    success: false,
    error: {
      type: 'PageError',
      message: typeof error === 'string' ? error : (error?.message || 'The requested page is out of range')
    },
    timestamp: await TimestampService.getDbTimestamp()
  }
  return res.status(status).json(response)
}
