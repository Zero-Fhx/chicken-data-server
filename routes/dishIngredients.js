import { Router } from 'express'
import { DishIngredientsController } from '../controllers/dishIngredients.js'

export const dishIngredientsRouter = Router()

dishIngredientsRouter.get('/:dishId/ingredients', DishIngredientsController.getRecipe)
dishIngredientsRouter.post('/:dishId/ingredients', DishIngredientsController.addIngredient)
dishIngredientsRouter.put('/:dishId/ingredients', DishIngredientsController.replaceRecipe)
dishIngredientsRouter.put('/:dishId/ingredients/:ingredientId', DishIngredientsController.updateQuantity)
dishIngredientsRouter.delete('/:dishId/ingredients/:ingredientId', DishIngredientsController.removeIngredient)
