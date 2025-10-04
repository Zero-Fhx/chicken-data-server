import { Router } from 'express'
import { IngredientsController } from '../controllers/ingredients.js'

export const IngredientsRouter = Router()

// Rutas para ingredientes
IngredientsRouter.get('/', IngredientsController.getAll)
IngredientsRouter.get('/:id', IngredientsController.getById)
IngredientsRouter.post('/', IngredientsController.create)
IngredientsRouter.put('/:id', IngredientsController.update)
IngredientsRouter.delete('/:id', IngredientsController.delete)
