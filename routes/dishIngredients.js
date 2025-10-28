import { Router } from 'express'
import { DishIngredientsController } from '../controllers/dishIngredients.js'

export const DishIngredientsRouter = Router()

DishIngredientsRouter.get('/:dishId/recipe', DishIngredientsController.getRecipe)
DishIngredientsRouter.post('/:dishId/recipe', DishIngredientsController.addIngredient)
DishIngredientsRouter.put('/:dishId/recipe', DishIngredientsController.replaceRecipe)
DishIngredientsRouter.patch('/:dishId/recipe/:ingredientId', DishIngredientsController.updateQuantity)
DishIngredientsRouter.delete('/:dishId/recipe/:ingredientId', DishIngredientsController.removeIngredient)
