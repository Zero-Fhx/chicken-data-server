import { Router } from 'express'
import { PurchasesController } from '../controllers/purchases.js'

export const PurchasesRouter = Router()

PurchasesRouter.get('/', PurchasesController.getAll)
PurchasesRouter.get('/:id', PurchasesController.getById)
PurchasesRouter.get('/:id/details', PurchasesController.getPurchaseDetails)
PurchasesRouter.post('/', PurchasesController.create)
PurchasesRouter.patch('/:id', PurchasesController.update)
PurchasesRouter.delete('/:id', PurchasesController.delete)
