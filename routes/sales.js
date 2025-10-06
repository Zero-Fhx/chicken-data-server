import { Router } from 'express'
import { SalesController } from '../controllers/sales.js'

export const SalesRouter = Router()

SalesRouter.get('/', SalesController.getAll)
SalesRouter.get('/:id', SalesController.getById)
SalesRouter.get('/:id/details', SalesController.getSaleDetails)
SalesRouter.post('/', SalesController.create)
SalesRouter.patch('/:id', SalesController.update)
SalesRouter.delete('/:id', SalesController.delete)
