import { Router } from 'express'
import { IngredientCategoriesController } from '../controllers/ingredientCategories.js'

const router = Router()

router.get('/', IngredientCategoriesController.getAll)
router.get('/:id', IngredientCategoriesController.getById)
router.post('/', IngredientCategoriesController.create)
router.patch('/:id', IngredientCategoriesController.update)
router.delete('/:id', IngredientCategoriesController.delete)

export default router
