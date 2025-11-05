import { DashboardModel } from '../models/dashboard.js'
import { handleError, handleResponse } from '../utils/responseHandler.js'

export const DashboardController = {
  getEndpoints (req, res) {
    const baseUrl = '/api/dashboard'
    const endpoints = {
      stats: {
        url: `${baseUrl}/stats`,
        method: 'GET',
        description: 'Obtiene todas las estadísticas agregadas del dashboard (ventas, compras, inventario, platos, proveedores y actividad reciente)'
      }
    }

    return handleResponse({
      res,
      data: endpoints,
      message: 'Dashboard endpoints retrieved successfully'
    })
  },

  async getStats (req, res) {
    try {
      const stats = await DashboardModel.getStats()

      return handleResponse({
        res,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
      })
    } catch (error) {
      return handleError({ res, status: error.statusCode || 500, error })
    }
  }
}
