import { SupplierModel } from '../models/supplier.js'
import { transformSupplier } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { SupplierValidates } from '../utils/validates.js'

export const SuppliersController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, search, status } = req.query
      
      const filters = {}
      if (search) filters.search = search
      if (status) filters.status = status
      
      const result = await SupplierModel.getAll({ page, limit: pageSize, filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      
      if (pagination.page > pagination.pageCount && result.total > 0) {
        return handlePageError({ res })
      }
      
      const transformedData = result.data.map(supplier => transformSupplier(supplier))

      return handleResponse({
        res,
        data: transformedData,
        message: 'Suppliers retrieved successfully',
        pagination,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async getById (req, res) {
    const validation = SupplierValidates.SupplierId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { id } = req.params
      const supplier = await SupplierModel.getById(id)
      const transformedData = transformSupplier(supplier)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Supplier retrieved successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async create (req, res) {
    const validation = SupplierValidates.Supplier(req.body)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const supplier = await SupplierModel.create(req.body)
      const transformedData = transformSupplier(supplier)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Supplier created successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async update (req, res) {
    const idValidation = SupplierValidates.SupplierId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    const bodyValidation = SupplierValidates.PartialSupplier(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { id } = req.params
      const supplier = await SupplierModel.update(id, req.body)
      const transformedData = transformSupplier(supplier)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Supplier updated successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async delete (req, res) {
    const validation = SupplierValidates.SupplierId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { id } = req.params
      const supplier = await SupplierModel.delete(id)
      const transformedData = transformSupplier(supplier)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Supplier deleted successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  }
}
