import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import logger from 'morgan'
import { testConnection } from './config/database.js'

import { DishCategoriesRouter } from './routes/dishCategories.js'
import { DishesRouter } from './routes/dishes.js'
import { DishIngredientsRouter } from './routes/dishIngredients.js'
import { IngredientCategoriesRouter } from './routes/ingredientCategories.js'
import { IngredientsRouter } from './routes/ingredients.js'
import { PurchasesRouter } from './routes/purchases.js'
import { SalesRouter } from './routes/sales.js'
import { SuppliersRouter } from './routes/suppliers.js'

dotenv.config({ quiet: true })

const app = express().disable('x-powered-by')
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

const ENDPOINTS = {
  Health: '/health',
  Dishes: '/api/dishes',
  DishCategories: '/api/dish-categories',
  Suppliers: '/api/suppliers',
  Ingredients: '/api/ingredients',
  IngredientCategories: '/api/ingredient-categories',
  Purchases: '/api/purchases',
  Sales: '/api/sales',
}

app.get('/', (req, res) => {
  res.json({
    message: 'Chicken Data API',
    endpoints: {
      health: ENDPOINTS.Health,
      dishes: {
        list: ENDPOINTS.Dishes,
        categories: ENDPOINTS.DishCategories
      },
      ingredients: {
        list: ENDPOINTS.Ingredients,
        categories: ENDPOINTS.IngredientCategories
      },
      suppliers: { list: ENDPOINTS.Suppliers },
      purchases: { list: ENDPOINTS.Purchases },
      sales: { list: ENDPOINTS.Sales }
    },
    reference: {
      health: {
        'GET /health': 'Estado del servidor y base de datos'
      },
      dishes: {
        main: {
          'GET /api/dishes': 'Lista de platillos (incluye detalles, sin receta)',
          'GET /api/dishes/:id': 'Obtener un platillo (solo datos principales, sin receta)',
          'POST /api/dishes': 'Crear platillo',
          'PATCH /api/dishes/:id': 'Actualizar platillo',
          'DELETE /api/dishes/:id': 'Eliminar platillo'
        },
        recipe: {
          'GET /api/dishes/:dishId/recipe': 'Obtener receta de platillo',
          'PUT /api/dishes/:dishId/recipe': 'Reemplazar receta de platillo',
          'POST /api/dishes/:dishId/recipe': 'Agregar ingrediente a receta',
          'PATCH /api/dishes/:dishId/recipe/:ingredientId': 'Actualizar cantidad de ingrediente en receta',
          'DELETE /api/dishes/:dishId/recipe/:ingredientId': 'Eliminar ingrediente de receta'
        },
        categories: {
          'GET /api/dish-categories': 'Lista de categorías de platillos',
          'GET /api/dish-categories/:id': 'Obtener una categoría de platillo',
          'POST /api/dish-categories': 'Crear categoría de platillo',
          'PATCH /api/dish-categories/:id': 'Actualizar categoría de platillo',
          'DELETE /api/dish-categories/:id': 'Eliminar categoría de platillo'
        }
      },
      ingredients: {
        main: {
          'GET /api/ingredients': 'Lista de ingredientes (incluye detalles)',
          'GET /api/ingredients/:id': 'Obtener un ingrediente (solo datos principales)',
          'POST /api/ingredients': 'Crear ingrediente',
          'PATCH /api/ingredients/:id': 'Actualizar ingrediente',
          'DELETE /api/ingredients/:id': 'Eliminar ingrediente'
        },
        categories: {
          'GET /api/ingredient-categories': 'Lista de categorías de ingredientes',
          'GET /api/ingredient-categories/:id': 'Obtener una categoría de ingrediente',
          'POST /api/ingredient-categories': 'Crear categoría de ingrediente',
          'PATCH /api/ingredient-categories/:id': 'Actualizar categoría de ingrediente',
          'DELETE /api/ingredient-categories/:id': 'Eliminar categoría de ingrediente'
        }
      },
      suppliers: {
        'GET /api/suppliers': 'Lista de proveedores',
        'GET /api/suppliers/:id': 'Obtener un proveedor',
        'POST /api/suppliers': 'Crear proveedor',
        'PATCH /api/suppliers/:id': 'Actualizar proveedor',
        'DELETE /api/suppliers/:id': 'Eliminar proveedor'
      },
      purchases: {
        'GET /api/purchases': 'Lista de compras',
        'GET /api/purchases/:id': 'Obtener una compra',
        'POST /api/purchases': 'Registrar compra',
        'PATCH /api/purchases/:id': 'Actualizar compra',
        'DELETE /api/purchases/:id': 'Eliminar compra'
      },
      sales: {
        'GET /api/sales': 'Lista de ventas',
        'GET /api/sales/:id': 'Obtener una venta',
        'POST /api/sales': 'Registrar venta',
        'PATCH /api/sales/:id': 'Actualizar venta',
        'DELETE /api/sales/:id': 'Eliminar venta'
      }
    }
  })
})

app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection()
    res.json({
      status: 'ok',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

app.get('/endpoints', (req, res) => {
  res.json({
    message: 'Available API endpoints - Chicken Data API',
    endpoints: {
      health: ENDPOINTS.Health,
      dishes: {
        list: ENDPOINTS.Dishes,
        categories: ENDPOINTS.DishCategories
      },
      ingredients: {
        list: ENDPOINTS.Ingredients,
        categories: ENDPOINTS.IngredientCategories
      },
      suppliers: { list: ENDPOINTS.Suppliers },
      purchases: { list: ENDPOINTS.Purchases },
      sales: { list: ENDPOINTS.Sales }
    }
  })
})

app.use('/api/dishes', DishesRouter)
app.use('/api/dishes', DishIngredientsRouter)
app.use('/api/dish-categories', DishCategoriesRouter)
app.use('/api/suppliers', SuppliersRouter)
app.use('/api/ingredients', IngredientsRouter)
app.use('/api/ingredient-categories', IngredientCategoriesRouter)
app.use('/api/purchases', PurchasesRouter)
app.use('/api/sales', SalesRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: {
      health: ENDPOINTS.Health,
      dishes: {
        list: ENDPOINTS.Dishes,
        categories: ENDPOINTS.DishCategories
      },
      ingredients: {
        list: ENDPOINTS.Ingredients,
        categories: ENDPOINTS.IngredientCategories
      },
      suppliers: { list: ENDPOINTS.Suppliers },
      purchases: { list: ENDPOINTS.Purchases },
      sales: { list: ENDPOINTS.Sales }
    }
  })
})

app.use((error, req, res, next) => {
  console.error('Error:', error)

  if (res.headersSent) {
    return next(error)
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
