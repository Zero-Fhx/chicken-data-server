import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.js'

export const DashboardRouter = Router()

DashboardRouter.get('/', DashboardController.getEndpoints)
DashboardRouter.get('/stats', DashboardController.getStats)
DashboardRouter.get('/stats/sales', DashboardController.getSalesStats)
DashboardRouter.get('/stats/purchases', DashboardController.getPurchasesStats)
DashboardRouter.get('/stats/inventory', DashboardController.getInventoryStats)
DashboardRouter.get('/stats/dishes', DashboardController.getDishesStats)
DashboardRouter.get('/stats/suppliers', DashboardController.getSuppliersStats)
DashboardRouter.get('/stats/activity', DashboardController.getRecentActivity)
DashboardRouter.get('/trends', DashboardController.getTrends)
