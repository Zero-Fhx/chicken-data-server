import { IngredientCategoryModel } from '../models/ingredientCategory.js'
import { transformIngredientCategory } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { CategoryValidates } from '../utils/validates.js'

export const IngredientCategoriesController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, search, status } = req.query
      const filters = {}
      if (search) filters.search = search
      if (status) filters.status = status
      const result = await IngredientCategoryModel.getAll({ page, limit: pageSize, filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount && result.total > 0) {
        await handlePageError({ res })
        return
      }
      const transformedData = result.data.map(category => transformIngredientCategory(category))
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient categories retrieved successfully',
        pagination,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async getById (req, res) {
    const validation = CategoryValidates.CategoryId(req.params)
    if (!validation.success) {
      await handleValidationError({ res, status: 400, error: validation.error })
      return
    }
    try {
      const { id } = req.params
      const category = await IngredientCategoryModel.getById(id)
      const transformedData = transformIngredientCategory(category)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient category retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async create (req, res) {
    const validation = CategoryValidates.Category(req.body)
    if (!validation.success) {
      await handleValidationError({ res, status: 400, error: validation.error })
      return
    }
    try {
      const category = await IngredientCategoryModel.create(req.body)
      const transformedData = transformIngredientCategory(category)
      await handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Ingredient category created successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async update (req, res) {
    const idValidation = CategoryValidates.CategoryId(req.params)
    if (!idValidation.success) {
      await handleValidationError({ res, status: 400, error: idValidation.error })
      return
    }
    const bodyValidation = CategoryValidates.PartialCategory(req.body)
    if (!bodyValidation.success) {
      await handleValidationError({ res, status: 400, error: bodyValidation.error })
      return
    }
    try {
      const { id } = req.params
      const category = await IngredientCategoryModel.update(id, req.body)
      const transformedData = transformIngredientCategory(category)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient category updated successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  },

  async delete (req, res) {
    const validation = CategoryValidates.CategoryId(req.params)
    if (!validation.success) {
      await handleValidationError({ res, status: 400, error: validation.error })
      return
    }
    try {
      const { id } = req.params
      const category = await IngredientCategoryModel.delete(id)
      const transformedData = transformIngredientCategory(category)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient category deleted successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  }
}
