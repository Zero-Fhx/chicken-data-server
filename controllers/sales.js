import { SaleModel } from '../models/sale.js'
import {
  transformSale,
  transformSaleDetail
} from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { SaleValidates } from '../utils/validates.js'

export const SalesController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query
      
      const filters = {}
      if (status) filters.status = status

      const result = await SaleModel.getAll({ page, limit: pageSize, ...filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount) {
        return handlePageError({ res })
      }

      const transformedData = result.data.map(sale => transformSale(sale))

      return handleResponse({
        res,
        data: transformedData,
        message: 'Sales retrieved successfully',
        pagination,
        filters
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

      const sale = await SaleModel.create(req.body)

      const transformedData = transformSale(sale)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Sale created successfully'
      })
    } catch (error) {
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

  async getSaleDetails (req, res) {
    try {
      const validationResult = SaleValidates.SaleId(req.params)
      if (!validationResult.success) {
        return handleValidationError({ res, error: validationResult.error })
      }

      const { id: saleId } = req.params
      const { page = 1, pageSize = 10 } = req.query

      const result = await SaleModel.getDetailsBySaleId(saleId, { page, limit: pageSize })

      const pagination = getPagination({ page, limit: pageSize, total: result.total })

      if (pagination.page > pagination.pageCount) {
        return handlePageError({ res })
      }

      const transformedData = result.data.map(detail =>
        transformSaleDetail(detail, parseInt(saleId))
      )

      return handleResponse({
        res,
        data: transformedData,
        message: 'Sale details retrieved successfully',
        pagination
      })
    } catch (error) {
      return handleError({ res, status: error.statusCode || 500, error })
    }
  }
}
