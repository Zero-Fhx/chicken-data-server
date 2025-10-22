import { Router } from 'express'
import { DishIngredientsController } from '../controllers/dishIngredients.js'

export const DishIngredientsRouter = Router()

DishIngredientsRouter.get('/:dishId/ingredients', DishIngredientsController.getRecipe)
DishIngredientsRouter.post('/:dishId/ingredients', DishIngredientsController.addIngredient)
DishIngredientsRouter.put('/:dishId/ingredients', DishIngredientsController.replaceRecipe)
DishIngredientsRouter.put('/:dishId/ingredients/:ingredientId', DishIngredientsController.updateQuantity)
DishIngredientsRouter.delete('/:dishId/ingredients/:ingredientId', DishIngredientsController.removeIngredient)
