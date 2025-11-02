import { SaleModel } from '../models/sale.js'
import { transformSale } from '../utils/apiTransformer.js'
import { InsufficientStockError } from '../utils/errors.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { SaleValidates } from '../utils/validates.js'

export const SalesController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, search, status, startDate, endDate } = req.query

      const filters = {}
      if (search) filters.search = search
      if (status) filters.status = status
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate

      const result = await SaleModel.getAll({ page, limit: pageSize, filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount && result.total > 0) {
        return handlePageError({ res })
      }

      const transformedData = result.data.map(sale => transformSale(sale))

      return handleResponse({
        res,
        data: transformedData,
        message: 'Sales retrieved successfully',
        pagination,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      return handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getById (req, res) {
    try {
      const validationResult = SaleValidates.SaleId(req.params)
      if (!validationResult.success) {
        return handleValidationError({ res, error: validationResult.error })
      }

      const sale = await SaleModel.getById(req.params.id)

      const transformedData = transformSale(sale)

      return handleResponse({
        res,
        data: transformedData
      })
    } catch (error) {
      return handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async create (req, res) {
    try {
      const validationResult = SaleValidates.Sale(req.body)
      if (!validationResult.success) {
        return handleValidationError({ res, error: validationResult.error })
      }

      const { forceSale = false, ...saleData } = req.body

      const sale = await SaleModel.create(saleData, { forceSale })

      const transformedData = transformSale(sale)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Sale created successfully'
      })
    } catch (error) {
      // Manejo especial para error de stock insuficiente
      if (error instanceof InsufficientStockError) {
        return res.status(400).json({
          success: false,
          message: error.message,
          data: error.details,
          timestamp: new Date().toISOString()
        })
      }

      return handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async update (req, res) {
    try {
      const idValidation = SaleValidates.SaleId(req.params)
      if (!idValidation.success) {
        return handleValidationError({ res, error: idValidation.error })
      }

      const bodyValidation = SaleValidates.PartialSale(req.body)
      if (!bodyValidation.success) {
        return handleValidationError({ res, error: bodyValidation.error })
      }

      const sale = await SaleModel.update(req.params.id, req.body)

      const transformedData = transformSale(sale)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Sale updated successfully'
      })
    } catch (error) {
      return handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async delete (req, res) {
    try {
      const validationResult = SaleValidates.SaleId(req.params)
      if (!validationResult.success) {
        return handleValidationError({ res, error: validationResult.error })
      }

      const sale = await SaleModel.delete(req.params.id)

      const transformedData = transformSale(sale)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Sale deleted successfully'
      })
    } catch (error) {
      return handleError({ res, status: error.statusCode || 500, error })
    }
  },

}
