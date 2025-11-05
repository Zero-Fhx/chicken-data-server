import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.js'

export const DashboardRouter = Router()

DashboardRouter.get('/', DashboardController.getEndpoints)
DashboardRouter.get('/stats', DashboardController.getStats)
