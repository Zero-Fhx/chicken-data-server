import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import logger from 'morgan'
import { testConnection } from './config/database.js'

import { DashboardRouter } from './routes/dashboard.js'
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
  Dashboard: '/api/dashboard',
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
      dashboard: ENDPOINTS.Dashboard,
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

app.get('/api', (req, res) => {
  res.json({
    message: 'Chicken Data API',
    endpoints: {
      health: ENDPOINTS.Health,
      dashboard: ENDPOINTS.Dashboard,
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
      dashboard: ENDPOINTS.Dashboard,
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
app.use('/api/dashboard', DashboardRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    endpoints: {
      health: ENDPOINTS.Health,
      dashboard: ENDPOINTS.Dashboard,
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
