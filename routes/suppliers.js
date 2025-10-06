import { Router } from 'express'
import { SuppliersController } from '../controllers/suppliers.js'

export const SuppliersRouter = Router()

SuppliersRouter.get('/', SuppliersController.getAll)
SuppliersRouter.get('/:id', SuppliersController.getById)
SuppliersRouter.post('/', SuppliersController.create)
SuppliersRouter.put('/:id', SuppliersController.update)
SuppliersRouter.delete('/:id', SuppliersController.delete)
