import { DishIngredientModel } from '../models/dishIngredient.js'
import { transformDishIngredient } from '../utils/apiTransformer.js'
import { handleError, handleResponse, handleValidationError } from '../utils/responseHandler.js'
import { DishIngredientValidates } from '../utils/validates.js'

export const DishIngredientsController = {
  async getRecipe (req, res) {
    const validation = DishIngredientValidates.DishId(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { dishId } = req.params
      const ingredients = await DishIngredientModel.getByDishId(dishId)

      const transformedData = ingredients.map(ing => transformDishIngredient(ing))

      return handleResponse({
        res,
        data: transformedData,
        message: ingredients.length > 0
          ? 'Dish recipe retrieved successfully'
          : 'This dish has no ingredients defined in its recipe'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async addIngredient (req, res) {
    const idValidation = DishIngredientValidates.DishId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    const bodyValidation = DishIngredientValidates.DishIngredient(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { dishId } = req.params
      const ingredient = await DishIngredientModel.addIngredient(dishId, req.body)

      const transformedData = transformDishIngredient(ingredient)

      return handleResponse({
        res,
        status: 201,
        data: transformedData,
        message: 'Ingredient added to dish recipe successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async updateQuantity (req, res) {
    const validation = DishIngredientValidates.DishIngredientIds(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    const bodyValidation = DishIngredientValidates.QuantityUsed(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { dishId, ingredientId } = req.params
      const { quantity_used: quantityUsed } = req.body

      const ingredient = await DishIngredientModel.updateQuantity(dishId, ingredientId, quantityUsed)

      const transformedData = transformDishIngredient(ingredient)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient quantity updated successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async removeIngredient (req, res) {
    const validation = DishIngredientValidates.DishIngredientIds(req.params)

    if (!validation.success) {
      return handleValidationError({ res, status: 400, error: validation.error })
    }

    try {
      const { dishId, ingredientId } = req.params
      const ingredient = await DishIngredientModel.removeIngredient(dishId, ingredientId)

      const transformedData = transformDishIngredient(ingredient)

      return handleResponse({
        res,
        data: transformedData,
        message: 'Ingredient removed from dish recipe successfully'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  },

  async replaceRecipe (req, res) {
    const idValidation = DishIngredientValidates.DishId(req.params)

    if (!idValidation.success) {
      return handleValidationError({ res, status: 400, error: idValidation.error })
    }

    const bodyValidation = DishIngredientValidates.DishIngredients(req.body)

    if (!bodyValidation.success) {
      return handleValidationError({ res, status: 400, error: bodyValidation.error })
    }

    try {
      const { dishId } = req.params
      const { ingredients } = req.body

      const updatedRecipe = await DishIngredientModel.replaceAllIngredients(dishId, ingredients)

      const transformedData = updatedRecipe.map(ing => transformDishIngredient(ing))

      return handleResponse({
        res,
        data: transformedData,
        message: ingredients.length > 0
          ? 'Dish recipe updated successfully'
          : 'All ingredients removed from dish recipe'
      })
    } catch (error) {
      return handleError({ res, error })
    }
  }
}
