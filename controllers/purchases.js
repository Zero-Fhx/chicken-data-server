import { PurchaseModel } from '../models/purchase.js'
import { transformPurchase } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { PurchaseValidates } from '../utils/validates.js'

export const PurchasesController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, search, status, supplierId, startDate, endDate } = req.query

      const filters = {}
      if (search) filters.search = search
      if (status) filters.status = status
      if (supplierId) filters.supplierId = parseInt(supplierId)
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate

      const result = await PurchaseModel.getAll({ page, limit: pageSize, filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount && result.total > 0) {
        return handlePageError({ res })
      }

      const transformedData = result.data.map(purchase => transformPurchase(purchase))

      return handleResponse({
        res,
        data: transformedData,
        message: 'Purchases retrieved successfully',
        pagination,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async getById (req, res) {
    const idValidation = PurchaseValidates.PurchaseId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    try {
      const { id } = req.params
      const purchase = await PurchaseModel.getById(id)

      const transformedData = transformPurchase(purchase)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Purchase retrieved successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async create (req, res) {
    const validation = PurchaseValidates.Purchase(req.body)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const purchase = await PurchaseModel.create(req.body)

      const transformedData = transformPurchase(purchase)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Purchase created successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async update (req, res) {
    const idValidation = PurchaseValidates.PurchaseId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    const bodyValidation = PurchaseValidates.PartialPurchase(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { id } = req.params
      const purchase = await PurchaseModel.update(id, req.body)

      const transformedData = transformPurchase(purchase)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Purchase updated successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async delete (req, res) {
    const validation = PurchaseValidates.PurchaseId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { id } = req.params
      const purchase = await PurchaseModel.delete(id)

      const transformedData = transformPurchase(purchase)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Purchase deleted successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

}
