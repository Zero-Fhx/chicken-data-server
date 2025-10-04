import { Router } from 'express'
import { DishesController } from '../controllers/dishes.js'

export const DishesRouter = Router()

// Rutas para platos
DishesRouter.get('/', DishesController.getAll)
DishesRouter.get('/:id', DishesController.getById)
DishesRouter.post('/', DishesController.create)
DishesRouter.put('/:id', DishesController.update)
DishesRouter.delete('/:id', DishesController.delete)
