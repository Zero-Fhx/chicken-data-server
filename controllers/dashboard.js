import { DashboardModel } from '../models/dashboard.js'
import { handleError, handleResponse } from '../utils/responseHandler.js'

export const DashboardController = {
  async getEndpoints (req, res) {
    const baseUrl = '/api/dashboard'
    const endpoints = {
      stats: {
        url: `${baseUrl}/stats`,
        method: 'GET',
        description: 'Obtiene todas las estadísticas agregadas del dashboard (ventas, compras, inventario, platos, proveedores y actividad reciente)'
      },
      sales: {
        url: `${baseUrl}/stats/sales`,
        method: 'GET',
        description: 'Obtiene solo las estadísticas de ventas'
      },
      purchases: {
        url: `${baseUrl}/stats/purchases`,
        method: 'GET',
        description: 'Obtiene solo las estadísticas de compras'
      },
      inventory: {
        url: `${baseUrl}/stats/inventory`,
        method: 'GET',
        description: 'Obtiene solo las estadísticas de inventario'
      },
      dishes: {
        url: `${baseUrl}/stats/dishes`,
        method: 'GET',
        description: 'Obtiene solo las estadísticas de platos'
      },
      suppliers: {
        url: `${baseUrl}/stats/suppliers`,
        method: 'GET',
        description: 'Obtiene solo las estadísticas de proveedores'
      },
      activity: {
        url: `${baseUrl}/stats/activity`,
        method: 'GET',
        description: 'Obtiene solo la actividad reciente del sistema'
      },
      trends: {
        url: `${baseUrl}/trends`,
        method: 'GET',
        description: 'Obtiene series temporales de ventas, compras e inventario para visualización de tendencias',
        params: {
          period: 'Período de tiempo (ej: 7d, 4w, 6m, 1y). Por defecto: 7d',
          granularity: 'Granularidad de los datos (hourly, daily, weekly, monthly, yearly). Por defecto: daily',
          includeEmpty: 'Incluir períodos sin transacciones (true/false). Por defecto: true'
        }
      },
      alerts: {
        url: `${baseUrl}/alerts`,
        method: 'GET',
        description: 'Obtiene alertas inteligentes sobre stock bajo, ingredientes sin uso, caídas de ventas y sobrestock'
      },
      projections: {
        url: `${baseUrl}/projections`,
        method: 'GET',
        description: 'Obtiene proyecciones de ventas y stock para los próximos días',
        params: {
          days: 'Número de días a proyectar (1-365). Por defecto: 30'
        }
      },
      comparisons: {
        url: `${baseUrl}/comparisons`,
        method: 'GET',
        description: 'Obtiene comparaciones expandidas: período actual vs anterior y vs mismo período año anterior'
      },
      salesBreakdown: {
        url: `${baseUrl}/breakdown/sales`,
        method: 'GET',
        description: 'Desglose de ventas por categoría de platos (semana, mes, año)'
      },
      purchasesBreakdown: {
        url: `${baseUrl}/breakdown/purchases`,
        method: 'GET',
        description: 'Desglose de compras por categoría de ingredientes (semana, mes, año)'
      }
    }
    await handleResponse({
      res,
      data: endpoints,
      message: 'Dashboard endpoints retrieved successfully'
    })
  },

  async getStats (req, res) {
    try {
      const { stats } = await DashboardModel.getStats()
      await handleResponse({
        res,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getSalesStats (req, res) {
    try {
      const sales = await DashboardModel.getSalesStats()
      await handleResponse({
        res,
        data: sales,
        message: 'Sales statistics retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getPurchasesStats (req, res) {
    try {
      const purchases = await DashboardModel.getPurchasesStats()
      await handleResponse({
        res,
        data: purchases,
        message: 'Purchases statistics retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getInventoryStats (req, res) {
    try {
      const inventory = await DashboardModel.getInventoryStats()
      await handleResponse({
        res,
        data: inventory,
        message: 'Inventory statistics retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getDishesStats (req, res) {
    try {
      const dishes = await DashboardModel.getDishesStats()
      await handleResponse({
        res,
        data: dishes,
        message: 'Dishes statistics retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getSuppliersStats (req, res) {
    try {
      const suppliers = await DashboardModel.getSuppliersStats()
      await handleResponse({
        res,
        data: suppliers,
        message: 'Suppliers statistics retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getRecentActivity (req, res) {
    try {
      const activity = await DashboardModel.getRecentActivity()
      await handleResponse({
        res,
        data: activity,
        message: 'Recent activity retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getTrends (req, res) {
    try {
      const { period = '7d', granularity = 'daily', includeEmpty = 'true' } = req.query
      const includeEmptyPeriods = includeEmpty === 'true' || includeEmpty === '1'
      const trends = await DashboardModel.getTrends(period, granularity, includeEmptyPeriods)
      await handleResponse({
        res,
        data: trends,
        message: 'Trends data retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getAlerts (req, res) {
    try {
      const alerts = await DashboardModel.getAlerts()
      await handleResponse({
        res,
        data: alerts,
        message: 'Alerts retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getProjections (req, res) {
    try {
      const { days = 30 } = req.query
      const daysInt = parseInt(days)
      if (isNaN(daysInt) || daysInt < 1 || daysInt > 365) {
        await handleError({
          res,
          status: 400,
          error: { message: 'Days must be a number between 1 and 365' }
        })
        return
      }
      const projections = await DashboardModel.getProjections(daysInt)
      await handleResponse({
        res,
        data: projections,
        message: 'Projections retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getComparisons (req, res) {
    try {
      const comparisons = await DashboardModel.getComparisons()
      await handleResponse({
        res,
        data: comparisons,
        message: 'Comparisons retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getSalesBreakdown (req, res) {
    try {
      const breakdown = await DashboardModel.getSalesBreakdown()
      await handleResponse({
        res,
        data: breakdown,
        message: 'Sales breakdown retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  },

  async getPurchasesBreakdown (req, res) {
    try {
      const breakdown = await DashboardModel.getPurchasesBreakdown()
      await handleResponse({
        res,
        data: breakdown,
        message: 'Purchases breakdown retrieved successfully'
      })
    } catch (error) {
      await handleError({ res, status: error.statusCode || 500, error })
    }
  }
}
