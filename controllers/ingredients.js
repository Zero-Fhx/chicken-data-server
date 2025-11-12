import { IngredientModel } from '../models/ingredient.js'
import { transformIngredient } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { IngredientValidates } from '../utils/validates.js'

export const IngredientsController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, search, categoryId, status, lowStock, minStock, maxStock, isInUse } = req.query
      const filters = {}
      if (search) filters.search = search
      if (categoryId) filters.categoryId = parseInt(categoryId)
      if (status) filters.status = status
      if (lowStock) filters.lowStock = lowStock
      if (minStock) filters.minStock = parseFloat(minStock)
      if (maxStock) filters.maxStock = parseFloat(maxStock)
      if (isInUse) filters.is_in_use = isInUse
      const result = await IngredientModel.getAll({ page, limit: pageSize, filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount && result.total > 0) {
        await handlePageError({ res })
        return
      }
      const transformedData = result.data.map(ingredient => transformIngredient(ingredient))
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredients retrieved successfully',
        pagination,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async getById (req, res) {
    const idValidation = IngredientValidates.IngredientId(req.params)
    if (!idValidation.success) {
      await handleValidationError({ res, status: 400, error: idValidation.error })
      return
    }
    try {
      const { id } = req.params
      const ingredient = await IngredientModel.getById(id)
      const transformedData = transformIngredient(ingredient)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async create (req, res) {
    const validation = IngredientValidates.Ingredient(req.body)
    if (!validation.success) {
      await handleValidationError({ res, status: 400, error: validation.error })
      return
    }
    try {
      const ingredient = await IngredientModel.create(req.body)
      const transformedData = transformIngredient(ingredient)
      await handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Ingredient created successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async update (req, res) {
    const idValidation = IngredientValidates.IngredientId(req.params)
    if (!idValidation.success) {
      await handleValidationError({ res, status: 400, error: idValidation.error })
      return
    }
    const bodyValidation = IngredientValidates.PartialIngredient(req.body)
    if (!bodyValidation.success) {
      await handleValidationError({ res, status: 400, error: bodyValidation.error })
      return
    }
    try {
      const { id } = req.params
      const ingredient = await IngredientModel.update(id, req.body)
      const transformedData = transformIngredient(ingredient)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient updated successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async delete (req, res) {
    const validation = IngredientValidates.IngredientId(req.params)
    if (!validation.success) {
      await handleValidationError({ res, status: 400, error: validation.error })
      return
    }
    try {
      const { id } = req.params
      const ingredient = await IngredientModel.delete(id)
      const transformedData = transformIngredient(ingredient)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient deleted successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  }
}
