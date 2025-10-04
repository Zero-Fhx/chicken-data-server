import { IngredientModel } from '../models/ingredient.js'
import { transformIngredient } from '../utils/apiTransformer.js'
import { getPagination } from '../utils/pagination.js'
import { handleError, handlePageError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { IngredientValidates } from '../utils/validates.js'

export const IngredientsController = {
  async getAll (req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query
      const result = await IngredientModel.getAll({ page, limit: pageSize })
      const pagination = getPagination({ page, limit: pageSize, total: result.total })
      if (pagination.page > pagination.pageCount) {
        return handlePageError({ res })
      }
      const transformedData = result.data.map(ingredient => transformIngredient(ingredient))

      return handleResponse({
        res,
        data: transformedData,
        message: 'Ingredients retrieved successfully',
        pagination
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async getById (req, res) {
    const idValidation = IngredientValidates.IngredientId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    try {
      const { id } = req.params
      const ingredient = await IngredientModel.getById(id)
      const transformedData = transformIngredient(ingredient)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient retrieved successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async create (req, res) {
    const validation = IngredientValidates.Ingredient(req.body)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const ingredient = await IngredientModel.create(req.body)
      const transformedData = transformIngredient(ingredient)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Ingredient created successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async update (req, res) {
    const idValidation = IngredientValidates.IngredientId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    const bodyValidation = IngredientValidates.PartialIngredient(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { id } = req.params
      const ingredient = await IngredientModel.update(id, req.body)
      const transformedData = transformIngredient(ingredient)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient updated successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async delete (req, res) {
    const validation = IngredientValidates.IngredientId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { id } = req.params
      const ingredient = await IngredientModel.delete(id)
      const transformedData = transformIngredient(ingredient)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient deleted successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  }
}
