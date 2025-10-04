export const handleResponse = ({ res, status = 200, data = null, message = null, pagination = null }) => {
  const response = {
    success: status >= 200 && status < 300,
    ...(data !== null && { data }),
    ...(message !== null && { message }),
    ...(pagination !== null && { meta: { pagination } }),
    timestamp: new Date().toISOString()
  }

  return res.status(status).json(response)
}

export const handleError = ({ res, status = 500, error = { message: 'Internal Server Error' } }) => {
  const response = {
    success: false,
    error: {
      type: error.constructor.name || 'Error',
      message: error.message || error
    },
    timestamp: new Date().toISOString()
  }

  return res.status(status).json(response)
}

export const handleValidationError = ({ res, status = 400, error }) => {
  const response = {
    success: false,
    error: {
      type: 'ValidationError',
      message: 'Validation Failed',
      ...(error && { details: JSON.parse(error.message) })
    },
    timestamp: new Date().toISOString()
  }
  return res.status(status).json(response)
}

export const handlePageError = ({ res, status = 400, error }) => {
  const response = {
    success: false,
    error: {
      type: 'PageError',
      message: typeof error === 'string' ? error : (error?.message || 'The requested page is out of range')
    },
    timestamp: new Date().toISOString()
  }
  return res.status(status).json(response)
}
