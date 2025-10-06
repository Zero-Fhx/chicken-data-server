import { Router } from 'express'
import { DishesController } from '../controllers/dishes.js'

export const DishesRouter = Router()

DishesRouter.get('/', DishesController.getAll)
DishesRouter.get('/:id', DishesController.getById)
DishesRouter.post('/', DishesController.create)
DishesRouter.patch('/:id', DishesController.update)
DishesRouter.delete('/:id', DishesController.delete)
