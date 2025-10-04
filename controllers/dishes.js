import { DishModel } from '../models/dish.js'
import { transformDish } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { DishValidates } from '../utils/validates.js'

export const DishesController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query
      const result = await DishModel.getAll({ page, limit: pageSize })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount) {
        return handlePageError({ res })
      }
      const transformedData = result.data.map(dish => transformDish(dish))

      return handleResponse({
        res,
        data: transformedData,
        message: 'Dishes retrieved successfully',
        pagination
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async getById (req, res) {
    const validation = DishValidates.DishId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { id } = req.params
      const dish = await DishModel.getById(id)
      const transformedData = transformDish(dish)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Dish retrieved successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async create (req, res) {
    const validation = DishValidates.Dish(req.body)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const dish = await DishModel.create(req.body)
      const transformedData = transformDish(dish)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Dish created successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async update (req, res) {
    const idValidation = DishValidates.DishId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    const bodyValidation = DishValidates.PartialDish(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { id } = req.params
      const dish = await DishModel.update(id, req.body)
      const transformedData = transformDish(dish)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Dish updated successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async delete (req, res) {
    const validation = DishValidates.DishId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { id } = req.params
      const dish = await DishModel.delete(id)
      const transformedData = transformDish(dish)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Dish deleted successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  }
}
