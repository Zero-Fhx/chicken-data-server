import { Router } from 'express'
import { PurchasesController } from '../controllers/purchases.js'

export const PurchasesRouter = Router()

// Rutas para compras
PurchasesRouter.get('/', PurchasesController.getAll)
PurchasesRouter.get('/:id', PurchasesController.getById)
PurchasesRouter.get('/:id/details', PurchasesController.getPurchaseDetails)
PurchasesRouter.post('/', PurchasesController.create)
PurchasesRouter.put('/:id', PurchasesController.update)
PurchasesRouter.delete('/:id', PurchasesController.delete)
