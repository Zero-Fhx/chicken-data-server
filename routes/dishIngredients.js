import { Router } from 'express'
import { DishIngredientsController } from '../controllers/dishIngredients.js'

export const dishIngredientsRouter = Router()

// Obtener la receta de un plato (todos sus ingredientes)
dishIngredientsRouter.get('/:dishId/ingredients', DishIngredientsController.getRecipe)

// Agregar un ingrediente a la receta
dishIngredientsRouter.post('/:dishId/ingredients', DishIngredientsController.addIngredient)

// Reemplazar toda la receta de un plato
dishIngredientsRouter.put('/:dishId/ingredients', DishIngredientsController.replaceRecipe)

// Actualizar la cantidad de un ingrediente específico
dishIngredientsRouter.put('/:dishId/ingredients/:ingredientId', DishIngredientsController.updateQuantity)

// Eliminar un ingrediente de la receta
dishIngredientsRouter.delete('/:dishId/ingredients/:ingredientId', DishIngredientsController.removeIngredient)
