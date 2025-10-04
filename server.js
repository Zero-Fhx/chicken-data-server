import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import logger from 'morgan'
import { testConnection } from './config/database.js'

import { DishesRouter } from './routes/dishes.js'
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

const ENDPOINTS = {
  Health: '/health',
  Dishes: '/api/dishes',
  Suppliers: '/api/suppliers',
  Ingredients: '/api/ingredients',
  Purchases: '/api/purchases',
  Sales: '/api/sales'
}

app.get('/', (req, res) => {
  res.json({
    message: 'Chicken Data API',
    endpoints: {
      health: ENDPOINTS.Health,
      dishes: ENDPOINTS.Dishes,
      suppliers: ENDPOINTS.Suppliers,
      ingredients: ENDPOINTS.Ingredients,
      purchases: ENDPOINTS.Purchases,
      sales: ENDPOINTS.Sales
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
      dishes: ENDPOINTS.Dishes,
      suppliers: ENDPOINTS.Suppliers,
      ingredients: ENDPOINTS.Ingredients,
      purchases: ENDPOINTS.Purchases,
      sales: ENDPOINTS.Sales
    }
  })
})

app.use('/api/dishes', DishesRouter)
app.use('/api/suppliers', SuppliersRouter)
app.use('/api/ingredients', IngredientsRouter)
app.use('/api/purchases', PurchasesRouter)
app.use('/api/sales', SalesRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: {
      health: ENDPOINTS.Health,
      dishes: ENDPOINTS.Dishes,
      suppliers: ENDPOINTS.Suppliers,
      ingredients: ENDPOINTS.Ingredients,
      purchases: ENDPOINTS.Purchases,
      sales: ENDPOINTS.Sales
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
