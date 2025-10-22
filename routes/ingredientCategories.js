import { Router } from 'express'
import { IngredientCategoriesController } from '../controllers/ingredientCategories.js'

export const IngredientCategoriesRouter = Router()

IngredientCategoriesRouter.get('/', IngredientCategoriesController.getAll)
IngredientCategoriesRouter.get('/:id', IngredientCategoriesController.getById)
IngredientCategoriesRouter.post('/', IngredientCategoriesController.create)
IngredientCategoriesRouter.patch('/:id', IngredientCategoriesController.update)
IngredientCategoriesRouter.delete('/:id', IngredientCategoriesController.delete)
