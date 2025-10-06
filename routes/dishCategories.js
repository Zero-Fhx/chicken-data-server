import { Router } from 'express'
import { DishCategoriesController } from '../controllers/dishCategories.js'

const router = Router()

router.get('/', DishCategoriesController.getAll)
router.get('/:id', DishCategoriesController.getById)
router.post('/', DishCategoriesController.create)
router.patch('/:id', DishCategoriesController.update)
router.delete('/:id', DishCategoriesController.delete)

export default router
