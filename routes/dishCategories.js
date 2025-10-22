import { Router } from 'express'
import { DishCategoriesController } from '../controllers/dishCategories.js'

export const DishCategoriesRouter = Router()

DishCategoriesRouter.get('/', DishCategoriesController.getAll)
DishCategoriesRouter.get('/:id', DishCategoriesController.getById)
DishCategoriesRouter.post('/', DishCategoriesController.create)
DishCategoriesRouter.patch('/:id', DishCategoriesController.update)
DishCategoriesRouter.delete('/:id', DishCategoriesController.delete)
