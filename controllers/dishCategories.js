import { DishCategoryModel } from '../models/dishCategory.js'
import { transformDishCategory } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { CategoryValidates } from '../utils/validates.js'

export const DishCategoriesController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10, search, status } = req.query
      const filters = {}
      if (search) filters.search = search
      if (status) filters.status = status
      const result = await DishCategoryModel.getAll({ page, limit: pageSize, filters })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount && result.total > 0) {
        await handlePageError({ res })
        return
      }
      const transformedData = result.data.map(category => transformDishCategory(category))
      await handleResponse({
        res,
        data: transformedData,
        message: 'Dish categories retrieved successfully',
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
      const category = await DishCategoryModel.getById(id)
      const transformedData = transformDishCategory(category)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Dish category retrieved successfully'
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
      const category = await DishCategoryModel.create(req.body)
      const transformedData = transformDishCategory(category)
      await handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Dish category created successfully'
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
      const category = await DishCategoryModel.update(id, req.body)
      const transformedData = transformDishCategory(category)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Dish category updated successfully'
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
      const category = await DishCategoryModel.delete(id)
      const transformedData = transformDishCategory(category)
      await handleResponse({
        res,
        data: transformedData,
        message: 'Dish category deleted successfully'
      })
    } catch (error) {
      await handleError({ res, error })
    }
  }
}
