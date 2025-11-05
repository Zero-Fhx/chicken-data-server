import pool from '../config/database.js'
import { BadRequestError, InternalServerError } from '../utils/errors.js'

export const DashboardModel = {
  async getStats () {
    const client = await pool.connect()
    try {
      const stats = {
        sales: await this._getSalesStats(client),
        purchases: await this._getPurchasesStats(client),
        inventory: await this._getInventoryStats(client),
        dishes: await this._getDishesStats(client),
        suppliers: await this._getSuppliersStats(client),
        recentActivity: await this._getRecentActivity(client),
        financial: await this._getFinancialMetrics(client)
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw new InternalServerError('Failed to fetch dashboard statistics')
    } finally {
      client.release()
    }
  },

  async getSalesStats () {
    const client = await pool.connect()
    try {
      return await this._getSalesStats(client)
    } catch (error) {
      console.error('Error fetching sales stats:', error)
      throw new InternalServerError('Failed to fetch sales statistics')
    } finally {
      client.release()
    }
  },

  async getPurchasesStats () {
    const client = await pool.connect()
    try {
      return await this._getPurchasesStats(client)
    } catch (error) {
      console.error('Error fetching purchases stats:', error)
      throw new InternalServerError('Failed to fetch purchases statistics')
    } finally {
      client.release()
    }
  },

  async getInventoryStats () {
    const client = await pool.connect()
    try {
      return await this._getInventoryStats(client)
    } catch (error) {
      console.error('Error fetching inventory stats:', error)
      throw new InternalServerError('Failed to fetch inventory statistics')
    } finally {
      client.release()
    }
  },

  async getDishesStats () {
    const client = await pool.connect()
    try {
      return await this._getDishesStats(client)
    } catch (error) {
      console.error('Error fetching dishes stats:', error)
      throw new InternalServerError('Failed to fetch dishes statistics')
    } finally {
      client.release()
    }
  },

  async getSuppliersStats () {
    const client = await pool.connect()
    try {
      return await this._getSuppliersStats(client)
    } catch (error) {
      console.error('Error fetching suppliers stats:', error)
      throw new InternalServerError('Failed to fetch suppliers statistics')
    } finally {
      client.release()
    }
  },

  async getRecentActivity () {
    const client = await pool.connect()
    try {
      return await this._getRecentActivity(client)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw new InternalServerError('Failed to fetch recent activity')
    } finally {
      client.release()
    }
  },

  async getTrends (period = '7d', granularity = 'daily') {
    const client = await pool.connect()
    try {
      const periodDays = this._parsePeriod(period)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - periodDays)

      const trends = {
        sales: await this._getSalesTrends(client, startDate, granularity),
        purchases: await this._getPurchasesTrends(client, startDate, granularity),
        inventory: await this._getInventoryTrends(client, startDate, granularity)
      }

      return trends
    } catch (error) {
      console.error('Error fetching trends:', error)
      throw new InternalServerError('Failed to fetch trends data')
    } finally {
      client.release()
    }
  },

  async getAlerts () {
    const client = await pool.connect()
    try {
      const alerts = {
        critical: [],
        warning: [],
        info: []
      }

      const lowStock = await this._getLowStockAlerts(client)
      const unusedIngredients = await this._getUnusedIngredientsAlerts(client)
      const salesDrop = await this._getSalesDropAlerts(client)
      const unnecessaryPurchases = await this._getUnnecessaryPurchasesAlerts(client)

      alerts.critical.push(...lowStock.critical)
      alerts.warning.push(...lowStock.warning, ...unusedIngredients, ...salesDrop)
      alerts.info.push(...unnecessaryPurchases)

      alerts.summary = {
        total: alerts.critical.length + alerts.warning.length + alerts.info.length,
        critical: alerts.critical.length,
        warning: alerts.warning.length,
        info: alerts.info.length
      }

      return alerts
    } catch (error) {
      console.error('Error fetching alerts:', error)
      throw new InternalServerError('Failed to fetch alerts')
    } finally {
      client.release()
    }
  },

  async getProjections (days = 30) {
    const client = await pool.connect()
    try {
      const projections = {
        sales: await this._getSalesProjections(client, days),
        stock: await this._getStockProjections(client, days),
        purchases: await this._getPurchaseRecommendations(client, days)
      }

      return projections
    } catch (error) {
      console.error('Error fetching projections:', error)
      throw new InternalServerError('Failed to fetch projections')
    } finally {
      client.release()
    }
  },

  async _getSalesStats (client) {
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekStart = this._getWeekStart(now)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const yearStart = new Date(now.getFullYear(), 0, 1)

      const yesterdayStart = new Date(todayStart)
      yesterdayStart.setDate(yesterdayStart.getDate() - 1)
      const yesterdayEnd = todayStart

      const lastWeekStart = new Date(weekStart)
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekEnd = weekStart

      const lastMonthStart = new Date(monthStart)
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
      const lastMonthEnd = monthStart

      const currentQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN sale_date >= $1 THEN total ELSE 0 END), 0) as day_total,
          COALESCE(COUNT(CASE WHEN sale_date >= $1 THEN 1 END), 0) as day_count,
          COALESCE(AVG(CASE WHEN sale_date >= $1 THEN total END), 0) as day_average,
          
          COALESCE(SUM(CASE WHEN sale_date >= $2 THEN total ELSE 0 END), 0) as week_total,
          COALESCE(COUNT(CASE WHEN sale_date >= $2 THEN 1 END), 0) as week_count,
          COALESCE(AVG(CASE WHEN sale_date >= $2 THEN total END), 0) as week_average,
          
          COALESCE(SUM(CASE WHEN sale_date >= $3 THEN total ELSE 0 END), 0) as month_total,
          COALESCE(COUNT(CASE WHEN sale_date >= $3 THEN 1 END), 0) as month_count,
          COALESCE(AVG(CASE WHEN sale_date >= $3 THEN total END), 0) as month_average,
          
          COALESCE(SUM(CASE WHEN sale_date >= $4 THEN total ELSE 0 END), 0) as year_total
        FROM sales
        WHERE deleted_at IS NULL
          AND status = 'Completed'
      `

      const currentResult = await client.query(currentQuery, [
        todayStart.toISOString(),
        weekStart.toISOString(),
        monthStart.toISOString(),
        yearStart.toISOString()
      ])

      const previousQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN sale_date >= $1 AND sale_date < $2 THEN total ELSE 0 END), 0) as yesterday_total,
          
          COALESCE(SUM(CASE WHEN sale_date >= $3 AND sale_date < $4 THEN total ELSE 0 END), 0) as last_week_total,
          
          COALESCE(SUM(CASE WHEN sale_date >= $5 AND sale_date < $6 THEN total ELSE 0 END), 0) as last_month_total
        FROM sales
        WHERE deleted_at IS NULL
          AND status = 'Completed'
      `

      const previousResult = await client.query(previousQuery, [
        yesterdayStart.toISOString(),
        yesterdayEnd.toISOString(),
        lastWeekStart.toISOString(),
        lastWeekEnd.toISOString(),
        lastMonthStart.toISOString(),
        lastMonthEnd.toISOString()
      ])

      const current = currentResult.rows[0]
      const previous = previousResult.rows[0]

      const dayGrowth = this._calculateGrowth(
        parseFloat(current.day_total),
        parseFloat(previous.yesterday_total)
      )
      const weekGrowth = this._calculateGrowth(
        parseFloat(current.week_total),
        parseFloat(previous.last_week_total)
      )
      const monthGrowth = this._calculateGrowth(
        parseFloat(current.month_total),
        parseFloat(previous.last_month_total)
      )

      return {
        today: {
          total: Math.round(parseFloat(current.day_total) * 100) / 100,
          count: parseInt(current.day_count),
          average: Math.round(parseFloat(current.day_average) * 100) / 100,
          growth: dayGrowth
        },
        week: {
          total: Math.round(parseFloat(current.week_total) * 100) / 100,
          count: parseInt(current.week_count),
          average: Math.round(parseFloat(current.week_average) * 100) / 100,
          growth: weekGrowth
        },
        month: {
          total: Math.round(parseFloat(current.month_total) * 100) / 100,
          count: parseInt(current.month_count),
          average: Math.round(parseFloat(current.month_average) * 100) / 100,
          growth: monthGrowth
        },
        year: {
          total: Math.round(parseFloat(current.year_total) * 100) / 100
        }
      }
    } catch (error) {
      console.error('Error fetching sales stats:', error)
      return null
    }
  },

  async _getPurchasesStats (client) {
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekStart = this._getWeekStart(now)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const yearStart = new Date(now.getFullYear(), 0, 1)

      const lastMonthStart = new Date(monthStart)
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
      const lastMonthEnd = monthStart

      const query = `
        SELECT 
          COALESCE(SUM(CASE WHEN purchase_date >= $1 THEN total ELSE 0 END), 0) as day_total,
          COALESCE(COUNT(CASE WHEN purchase_date >= $1 THEN 1 END), 0) as day_count,
          
          COALESCE(SUM(CASE WHEN purchase_date >= $2 THEN total ELSE 0 END), 0) as week_total,
          COALESCE(COUNT(CASE WHEN purchase_date >= $2 THEN 1 END), 0) as week_count,
          
          COALESCE(SUM(CASE WHEN purchase_date >= $3 THEN total ELSE 0 END), 0) as month_total,
          COALESCE(COUNT(CASE WHEN purchase_date >= $3 THEN 1 END), 0) as month_count,
          
          COALESCE(SUM(CASE WHEN purchase_date >= $4 THEN total ELSE 0 END), 0) as year_total,
          
          COALESCE(SUM(CASE WHEN purchase_date >= $5 AND purchase_date < $6 THEN total ELSE 0 END), 0) as last_month_total
        FROM purchases
        WHERE deleted_at IS NULL
          AND status = 'Completed'
      `

      const result = await client.query(query, [
        todayStart.toISOString(),
        weekStart.toISOString(),
        monthStart.toISOString(),
        yearStart.toISOString(),
        lastMonthStart.toISOString(),
        lastMonthEnd.toISOString()
      ])

      const data = result.rows[0]

      const monthGrowth = this._calculateGrowth(
        parseFloat(data.month_total),
        parseFloat(data.last_month_total)
      )

      return {
        today: {
          total: Math.round(parseFloat(data.day_total) * 100) / 100,
          count: parseInt(data.day_count)
        },
        week: {
          total: Math.round(parseFloat(data.week_total) * 100) / 100,
          count: parseInt(data.week_count)
        },
        month: {
          total: Math.round(parseFloat(data.month_total) * 100) / 100,
          count: parseInt(data.month_count),
          growth: monthGrowth
        },
        year: {
          total: Math.round(parseFloat(data.year_total) * 100) / 100
        }
      }
    } catch (error) {
      console.error('Error fetching purchases stats:', error)
      return null
    }
  },

  async _getInventoryStats (client) {
    try {
      const countQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Active' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive,
          COUNT(CASE WHEN stock < minimum_stock AND stock > 0 THEN 1 END) as low_stock,
          COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock,
          COUNT(CASE WHEN stock >= minimum_stock THEN 1 END) as optimal_stock
        FROM ingredients
        WHERE deleted_at IS NULL
      `

      const countResult = await client.query(countQuery)

      const criticalQuery = `
        SELECT 
          ingredient_id,
          name,
          stock,
          minimum_stock,
          unit,
          CASE 
            WHEN minimum_stock > 0 THEN ROUND((stock / minimum_stock * 100)::numeric, 1)
            ELSE 100
          END as stock_percentage
        FROM ingredients
        WHERE deleted_at IS NULL
          AND stock < minimum_stock
          AND minimum_stock > 0
        ORDER BY stock_percentage ASC
        LIMIT 5
      `

      const criticalResult = await client.query(criticalQuery)

      const valueQuery = `
        SELECT COALESCE(SUM(i.stock * COALESCE(last_price.unit_price, 0)), 0) as total_value
        FROM ingredients i
        LEFT JOIN LATERAL (
          SELECT pd.unit_price
          FROM purchase_details pd
          WHERE pd.ingredient_id = i.ingredient_id
            AND pd.deleted_at IS NULL
          ORDER BY pd.created_at DESC
          LIMIT 1
        ) last_price ON true
        WHERE i.deleted_at IS NULL
      `

      const valueResult = await client.query(valueQuery)

      const counts = countResult.rows[0]
      const critical = criticalResult.rows.map(row => ({
        id: row.ingredient_id,
        name: row.name,
        currentStock: Math.round(parseFloat(row.stock) * 100) / 100,
        minimumStock: Math.round(parseFloat(row.minimum_stock) * 100) / 100,
        unit: row.unit,
        stockPercentage: parseFloat(row.stock_percentage)
      }))

      return {
        total: parseInt(counts.total),
        active: parseInt(counts.active),
        inactive: parseInt(counts.inactive),
        alerts: {
          lowStock: parseInt(counts.low_stock),
          outOfStock: parseInt(counts.out_of_stock),
          optimal: parseInt(counts.optimal_stock)
        },
        criticalIngredients: critical,
        totalValue: Math.round(parseFloat(valueResult.rows[0].total_value) * 100) / 100
      }
    } catch (error) {
      console.error('Error fetching inventory stats:', error)
      return null
    }
  },

  async _getDishesStats (client) {
    try {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const countQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Active' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive
        FROM dishes
        WHERE deleted_at IS NULL
      `

      const countResult = await client.query(countQuery)

      const topQuery = `
        SELECT 
          d.dish_id,
          d.name,
          SUM(sd.quantity) as total_sold,
          SUM(sd.subtotal) as total_revenue,
          ROUND((SUM(sd.subtotal) / NULLIF(month_total.total, 0) * 100)::numeric, 1) as revenue_percentage
        FROM dishes d
        INNER JOIN sale_details sd ON d.dish_id = sd.dish_id
        INNER JOIN sales s ON sd.sale_id = s.sale_id
        CROSS JOIN (
          SELECT SUM(total) as total
          FROM sales
          WHERE deleted_at IS NULL
            AND status = 'Completed'
            AND sale_date >= $1
        ) month_total
        WHERE d.deleted_at IS NULL
          AND sd.deleted_at IS NULL
          AND s.deleted_at IS NULL
          AND s.status = 'Completed'
          AND s.sale_date >= $1
        GROUP BY d.dish_id, d.name, month_total.total
        ORDER BY total_sold DESC
        LIMIT 5
      `

      const topResult = await client.query(topQuery, [monthStart.toISOString()])

      const leastQuery = `
        SELECT 
          d.dish_id,
          d.name,
          SUM(sd.quantity) as total_sold
        FROM dishes d
        INNER JOIN sale_details sd ON d.dish_id = sd.dish_id
        INNER JOIN sales s ON sd.sale_id = s.sale_id
        WHERE d.deleted_at IS NULL
          AND sd.deleted_at IS NULL
          AND s.deleted_at IS NULL
          AND s.status = 'Completed'
          AND s.sale_date >= $1
        GROUP BY d.dish_id, d.name
        ORDER BY total_sold ASC
        LIMIT 3
      `

      const leastResult = await client.query(leastQuery, [monthStart.toISOString()])

      const counts = countResult.rows[0]

      return {
        total: parseInt(counts.total),
        active: parseInt(counts.active),
        inactive: parseInt(counts.inactive),
        topSelling: topResult.rows.map(row => ({
          id: row.dish_id,
          name: row.name,
          quantitySold: parseInt(row.total_sold),
          revenue: Math.round(parseFloat(row.total_revenue) * 100) / 100,
          revenuePercentage: parseFloat(row.revenue_percentage || 0)
        })),
        leastSelling: leastResult.rows.map(row => ({
          id: row.dish_id,
          name: row.name,
          quantitySold: parseInt(row.total_sold)
        }))
      }
    } catch (error) {
      console.error('Error fetching dishes stats:', error)
      return null
    }
  },

  async _getSuppliersStats (client) {
    try {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const countQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Active' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive
        FROM suppliers
        WHERE deleted_at IS NULL
      `

      const countResult = await client.query(countQuery)

      const topQuery = `
        SELECT 
          s.supplier_id,
          s.name,
          COUNT(p.purchase_id) as purchase_count,
          COALESCE(SUM(p.total), 0) as total_spent
        FROM suppliers s
        INNER JOIN purchases p ON s.supplier_id = p.supplier_id
        WHERE s.deleted_at IS NULL
          AND p.deleted_at IS NULL
          AND p.status = 'Completed'
          AND p.purchase_date >= $1
        GROUP BY s.supplier_id, s.name
        ORDER BY purchase_count DESC, total_spent DESC
        LIMIT 3
      `

      const topResult = await client.query(topQuery, [monthStart.toISOString()])

      const counts = countResult.rows[0]

      return {
        total: parseInt(counts.total),
        active: parseInt(counts.active),
        inactive: parseInt(counts.inactive),
        topSuppliers: topResult.rows.map(row => ({
          id: row.supplier_id,
          name: row.name,
          purchaseCount: parseInt(row.purchase_count),
          totalSpent: Math.round(parseFloat(row.total_spent) * 100) / 100
        }))
      }
    } catch (error) {
      console.error('Error fetching suppliers stats:', error)
      return null
    }
  },

  async _getRecentActivity (client) {
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const lastQuery = `
        SELECT 
          (
            SELECT created_at AT TIME ZONE 'UTC'
            FROM sales
            WHERE deleted_at IS NULL
              AND status = 'Completed'
            ORDER BY created_at DESC
            LIMIT 1
          ) as last_sale,
          (
            SELECT created_at AT TIME ZONE 'UTC'
            FROM purchases
            WHERE deleted_at IS NULL
              AND status = 'Completed'
            ORDER BY created_at DESC
            LIMIT 1
          ) as last_purchase
      `

      const lastResult = await client.query(lastQuery)

      const todayDishesQuery = `
        SELECT COALESCE(SUM(sd.quantity), 0) as dishes_sold
        FROM sale_details sd
        INNER JOIN sales s ON sd.sale_id = s.sale_id
        WHERE sd.deleted_at IS NULL
          AND s.deleted_at IS NULL
          AND s.status = 'Completed'
          AND s.sale_date >= $1
      `

      const todayDishesResult = await client.query(todayDishesQuery, [todayStart.toISOString()])

      const topIngredientQuery = `
        SELECT 
          i.ingredient_id,
          i.name,
          SUM(di.quantity_used * sd.quantity) as total_used
        FROM ingredients i
        INNER JOIN dish_ingredients di ON i.ingredient_id = di.ingredient_id
        INNER JOIN sale_details sd ON di.dish_id = sd.dish_id
        INNER JOIN sales s ON sd.sale_id = s.sale_id
        WHERE i.deleted_at IS NULL
          AND sd.deleted_at IS NULL
          AND s.deleted_at IS NULL
          AND s.status = 'Completed'
          AND s.sale_date >= $1
        GROUP BY i.ingredient_id, i.name
        ORDER BY total_used DESC
        LIMIT 1
      `

      const topIngredientResult = await client.query(topIngredientQuery, [todayStart.toISOString()])

      const lastData = lastResult.rows[0]

      const lastSaleTime = lastData.last_sale ? this._getTimeAgo(lastData.last_sale) : null
      const lastPurchaseTime = lastData.last_purchase ? this._getTimeAgo(lastData.last_purchase) : null

      return {
        lastSale: lastData.last_sale
          ? {
              timestamp: lastData.last_sale,
              timeAgo: lastSaleTime.text,
              timeValue: lastSaleTime.value,
              timeUnit: lastSaleTime.unit
            }
          : null,
        lastPurchase: lastData.last_purchase
          ? {
              timestamp: lastData.last_purchase,
              timeAgo: lastPurchaseTime.text,
              timeValue: lastPurchaseTime.value,
              timeUnit: lastPurchaseTime.unit
            }
          : null,
        today: {
          dishesSold: parseInt(todayDishesResult.rows[0].dishes_sold),
          mostUsedIngredient: topIngredientResult.rows.length > 0
            ? {
                id: topIngredientResult.rows[0].ingredient_id,
                name: topIngredientResult.rows[0].name,
                quantityUsed: Math.round(parseFloat(topIngredientResult.rows[0].total_used) * 100) / 100
              }
            : null
        }
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return null
    }
  },

  _calculateGrowth (current, previous) {
    if (previous === 0) {
      return current > 0 ? 100 : 0
    }
    return parseFloat(((current - previous) / previous * 100).toFixed(1))
  },

  _getWeekStart (date) {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    const weekStart = new Date(date.getFullYear(), date.getMonth(), diff)
    weekStart.setHours(0, 0, 0, 0)
    return weekStart
  },

  _getTimeAgo (timestamp) {
    const now = Date.now()
    const past = new Date(timestamp).getTime()
    const diffMs = Math.max(0, now - past)

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    let text, value, unit

    if (seconds < 60) {
      text = seconds < 5 ? 'hace menos de un minuto' : `hace ${seconds} segundos`
      value = seconds
      unit = 'seconds'
    } else if (minutes === 1) {
      text = 'hace 1 minuto'
      value = 1
      unit = 'minutes'
    } else if (minutes < 60) {
      text = `hace ${minutes} minutos`
      value = minutes
      unit = 'minutes'
    } else if (hours === 1) {
      text = 'hace 1 hora'
      value = 1
      unit = 'hours'
    } else if (hours < 24) {
      text = `hace ${hours} horas`
      value = hours
      unit = 'hours'
    } else if (days === 1) {
      text = 'hace 1 día'
      value = 1
      unit = 'days'
    } else {
      text = `hace ${days} días`
      value = days
      unit = 'days'
    }

    return { text, value, unit }
  },

  async _getSalesTrends (client, startDate, granularity) {
    const dateFormat = this._getDateFormat(granularity)
    const query = `
      SELECT 
        ${dateFormat} as period,
        COUNT(*)::int as count,
        ROUND(CAST(SUM(total) AS numeric), 2) as revenue
      FROM sales
      WHERE created_at AT TIME ZONE 'UTC' >= $1
        AND status != 'Cancelled'
        AND deleted_at IS NULL
      GROUP BY period
      ORDER BY period ASC
    `
    const result = await client.query(query, [startDate])
    return result.rows
  },

  async _getPurchasesTrends (client, startDate, granularity) {
    const dateFormat = this._getDateFormat(granularity)
    const query = `
      SELECT 
        ${dateFormat} as period,
        COUNT(*)::int as count,
        ROUND(CAST(SUM(total) AS numeric), 2) as cost
      FROM purchases
      WHERE created_at AT TIME ZONE 'UTC' >= $1
        AND deleted_at IS NULL
      GROUP BY period
      ORDER BY period ASC
    `
    const result = await client.query(query, [startDate])
    return result.rows
  },

  async _getInventoryTrends (client, startDate, granularity) {
    const query = `
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC('day', $1::timestamp),
          DATE_TRUNC('day', NOW()),
          '1 day'::interval
        )::date as period_date
      ),
      daily_inventory AS (
        SELECT 
          ds.period_date,
          COUNT(DISTINCT i.ingredient_id)::int as items_count,
          ROUND(CAST(COALESCE(SUM(
            i.stock * COALESCE(
              (SELECT AVG(pd.unit_price) 
               FROM purchase_details pd 
               WHERE pd.ingredient_id = i.ingredient_id 
                 AND pd.deleted_at IS NULL
               LIMIT 5),
              0
            )
          ), 0) AS numeric), 2) as total_value,
          COUNT(*) FILTER (WHERE i.stock <= i.minimum_stock)::int as low_stock_count
        FROM date_series ds
        LEFT JOIN ingredients i ON i.created_at AT TIME ZONE 'UTC' <= ds.period_date
          AND i.deleted_at IS NULL
        GROUP BY ds.period_date
      )
      SELECT 
        TO_CHAR(period_date, 'YYYY-MM-DD') as period,
        items_count,
        total_value,
        low_stock_count
      FROM daily_inventory
      ORDER BY period_date ASC
    `
    const result = await client.query(query, [startDate])
    return result.rows
  },

  async _getLowStockAlerts (client) {
    const query = `
      SELECT 
        i.ingredient_id,
        i.name,
        i.stock,
        i.minimum_stock,
        i.unit,
        ROUND(CAST((i.stock / NULLIF(i.minimum_stock, 0) * 100) AS numeric), 1) as stock_percentage
      FROM ingredients i
      WHERE i.stock <= i.minimum_stock
        AND i.minimum_stock > 0
        AND i.deleted_at IS NULL
      ORDER BY stock_percentage ASC, i.stock ASC
    `
    const result = await client.query(query)

    const critical = []
    const warning = []

    result.rows.forEach(row => {
      const stockPercentage = parseFloat(row.stock_percentage) || 0
      const alert = {
        id: `low-stock-${row.ingredient_id}`,
        type: 'low_stock',
        severity: stockPercentage <= 25 ? 'critical' : 'warning',
        title: stockPercentage === 0 ? `Sin stock: ${row.name}` : `Stock bajo: ${row.name}`,
        message: `${row.stock} ${row.unit} disponibles (mínimo: ${row.minimum_stock} ${row.unit})`,
        data: {
          ingredientId: row.ingredient_id,
          ingredientName: row.name,
          currentStock: parseFloat(row.stock),
          minimumStock: parseFloat(row.minimum_stock),
          unit: row.unit,
          stockPercentage
        },
        action: 'Realizar compra urgente',
        timestamp: new Date().toISOString()
      }

      if (stockPercentage <= 25) {
        critical.push(alert)
      } else {
        warning.push(alert)
      }
    })

    return { critical, warning }
  },

  async _getUnusedIngredientsAlerts (client) {
    const query = `
      SELECT 
        i.ingredient_id,
        i.name,
        i.stock,
        i.unit,
        COALESCE(
          (SELECT AVG(pd.unit_price) 
           FROM purchase_details pd 
           WHERE pd.ingredient_id = i.ingredient_id 
             AND pd.deleted_at IS NULL
           LIMIT 5),
          0
        ) as avg_unit_price,
        ROUND(CAST(i.stock * COALESCE(
          (SELECT AVG(pd.unit_price) 
           FROM purchase_details pd 
           WHERE pd.ingredient_id = i.ingredient_id 
             AND pd.deleted_at IS NULL
           LIMIT 5),
          0
        ) AS numeric), 2) as stock_value,
        COALESCE(
          EXTRACT(EPOCH FROM (NOW() - MAX(p.created_at AT TIME ZONE 'UTC'))) / 86400,
          999
        )::int as days_since_last_purchase,
        COUNT(DISTINCT di.dish_id)::int as used_in_dishes
      FROM ingredients i
      LEFT JOIN purchases p ON p.purchase_id IN (
        SELECT DISTINCT pd.purchase_id 
        FROM purchase_details pd 
        WHERE pd.ingredient_id = i.ingredient_id
      )
      LEFT JOIN dish_ingredients di ON di.ingredient_id = i.ingredient_id
      WHERE i.stock > 0
        AND i.deleted_at IS NULL
      GROUP BY i.ingredient_id, i.name, i.stock, i.unit
      HAVING COUNT(DISTINCT di.dish_id) = 0
      ORDER BY stock_value DESC
      LIMIT 10
    `
    const result = await client.query(query)

    return result.rows.map(row => ({
      id: `unused-ingredient-${row.ingredient_id}`,
      type: 'unused_ingredient',
      severity: 'warning',
      title: `Ingrediente sin uso: ${row.name}`,
      message: `No está asignado a ningún platillo (valor en stock: S/. ${row.stock_value})`,
      data: {
        ingredientId: row.ingredient_id,
        ingredientName: row.name,
        quantity: parseFloat(row.stock),
        unit: row.unit,
        stockValue: parseFloat(row.stock_value),
        daysSinceLastPurchase: row.days_since_last_purchase,
        usedInDishes: row.used_in_dishes
      },
      action: 'Asignar a platillos o considerar eliminar',
      timestamp: new Date().toISOString()
    }))
  },

  async _getSalesDropAlerts (client) {
    const query = `
      WITH weekly_sales AS (
        SELECT 
          DATE_TRUNC('week', created_at AT TIME ZONE 'UTC') as week,
          COUNT(*)::int as sales_count,
          ROUND(CAST(SUM(total) AS numeric), 2) as revenue
        FROM sales
        WHERE created_at AT TIME ZONE 'UTC' >= NOW() - INTERVAL '8 weeks'
          AND status != 'Cancelled'
          AND deleted_at IS NULL
        GROUP BY week
        ORDER BY week DESC
      ),
      averages AS (
        SELECT 
          AVG(sales_count) as avg_count,
          AVG(revenue) as avg_revenue
        FROM weekly_sales
        OFFSET 1
      )
      SELECT 
        ws.week,
        ws.sales_count,
        ws.revenue,
        a.avg_count,
        a.avg_revenue,
        ROUND(CAST(((ws.sales_count - a.avg_count) / NULLIF(a.avg_count, 0) * 100) AS numeric), 1) as count_change_pct,
        ROUND(CAST(((ws.revenue - a.avg_revenue) / NULLIF(a.avg_revenue, 0) * 100) AS numeric), 1) as revenue_change_pct
      FROM weekly_sales ws, averages a
      WHERE ws.week = (SELECT MAX(week) FROM weekly_sales)
        AND (
          (ws.sales_count < a.avg_count * 0.7)
          OR (ws.revenue < a.avg_revenue * 0.7)
        )
    `
    const result = await client.query(query)

    return result.rows.map(row => ({
      id: 'sales-drop-current-week',
      type: 'sales_drop',
      severity: 'warning',
      title: 'Caída en ventas detectada',
      message: `Las ventas de esta semana están ${Math.abs(parseFloat(row.count_change_pct))}% por debajo del promedio`,
      data: {
        currentWeek: {
          salesCount: row.sales_count,
          revenue: parseFloat(row.revenue)
        },
        average: {
          salesCount: Math.round(parseFloat(row.avg_count) * 100) / 100,
          revenue: Math.round(parseFloat(row.avg_revenue) * 100) / 100
        },
        changePercentage: {
          count: parseFloat(row.count_change_pct),
          revenue: parseFloat(row.revenue_change_pct)
        }
      },
      action: 'Revisar estrategia de ventas y promociones',
      timestamp: new Date().toISOString()
    }))
  },

  async _getUnnecessaryPurchasesAlerts (client) {
    const query = `
      SELECT 
        i.ingredient_id,
        i.name,
        i.stock,
        i.minimum_stock,
        i.unit,
        COALESCE(
          (SELECT AVG(pd.unit_price) 
           FROM purchase_details pd 
           WHERE pd.ingredient_id = i.ingredient_id 
             AND pd.deleted_at IS NULL
           LIMIT 5),
          0
        ) as avg_unit_price,
        ROUND(CAST(i.stock * COALESCE(
          (SELECT AVG(pd.unit_price) 
           FROM purchase_details pd 
           WHERE pd.ingredient_id = i.ingredient_id 
             AND pd.deleted_at IS NULL
           LIMIT 5),
          0
        ) AS numeric), 2) as stock_value,
        ROUND(CAST((i.stock / NULLIF(i.minimum_stock, 0)) AS numeric), 1) as stock_ratio,
        COALESCE(
          ROUND(CAST(AVG(pd.quantity) AS numeric), 2),
          0
        ) as avg_purchase_quantity,
        COUNT(DISTINCT pd.purchase_id)::int as purchase_count_last_90_days
      FROM ingredients i
      LEFT JOIN purchase_details pd ON pd.ingredient_id = i.ingredient_id 
        AND pd.created_at AT TIME ZONE 'UTC' >= NOW() - INTERVAL '90 days'
        AND pd.deleted_at IS NULL
      WHERE i.stock > i.minimum_stock * 3
        AND i.minimum_stock > 0
        AND i.deleted_at IS NULL
      GROUP BY i.ingredient_id, i.name, i.stock, i.minimum_stock, i.unit
      ORDER BY stock_ratio DESC
      LIMIT 10
    `
    const result = await client.query(query)

    return result.rows.map(row => ({
      id: `overstock-${row.ingredient_id}`,
      type: 'overstock',
      severity: 'info',
      title: `Sobrestock: ${row.name}`,
      message: `Stock actual es ${parseFloat(row.stock_ratio)}x el mínimo requerido (valor: S/. ${row.stock_value})`,
      data: {
        ingredientId: row.ingredient_id,
        ingredientName: row.name,
        currentStock: parseFloat(row.stock),
        minimumStock: parseFloat(row.minimum_stock),
        unit: row.unit,
        stockValue: parseFloat(row.stock_value),
        stockRatio: parseFloat(row.stock_ratio),
        avgPurchaseQuantity: parseFloat(row.avg_purchase_quantity),
        recentPurchases: row.purchase_count_last_90_days
      },
      action: 'Reducir cantidad en próximas compras',
      timestamp: new Date().toISOString()
    }))
  },

  async _getSalesProjections (client, days) {
    const query = `
      WITH daily_sales AS (
        SELECT 
          DATE_TRUNC('day', created_at AT TIME ZONE 'UTC')::date as sale_date,
          COUNT(*)::int as order_count,
          ROUND(CAST(SUM(total) AS numeric), 2) as daily_revenue
        FROM sales
        WHERE created_at AT TIME ZONE 'UTC' >= NOW() - INTERVAL '90 days'
          AND status != 'Cancelled'
          AND deleted_at IS NULL
        GROUP BY DATE_TRUNC('day', created_at AT TIME ZONE 'UTC')
      ),
      stats AS (
        SELECT 
          ROUND(CAST(AVG(order_count) AS numeric), 2) as avg_orders_per_day,
          ROUND(CAST(AVG(daily_revenue) AS numeric), 2) as avg_revenue_per_day,
          ROUND(CAST(STDDEV(daily_revenue) AS numeric), 2) as stddev_revenue
        FROM daily_sales
      )
      SELECT 
        avg_orders_per_day,
        avg_revenue_per_day,
        stddev_revenue,
        ROUND(CAST(avg_orders_per_day * $1 AS numeric), 0) as projected_orders,
        ROUND(CAST(avg_revenue_per_day * $1 AS numeric), 2) as projected_revenue,
        ROUND(CAST((avg_revenue_per_day - stddev_revenue) * $1 AS numeric), 2) as conservative_projection,
        ROUND(CAST((avg_revenue_per_day + stddev_revenue) * $1 AS numeric), 2) as optimistic_projection
      FROM stats
    `
    const result = await client.query(query, [days])
    const row = result.rows[0] || {}

    return {
      period: `${days} días`,
      avgOrdersPerDay: parseFloat(row.avg_orders_per_day) || 0,
      avgRevenuePerDay: parseFloat(row.avg_revenue_per_day) || 0,
      projectedOrders: parseInt(row.projected_orders) || 0,
      projectedRevenue: parseFloat(row.projected_revenue) || 0,
      range: {
        conservative: parseFloat(row.conservative_projection) || 0,
        optimistic: parseFloat(row.optimistic_projection) || 0
      }
    }
  },

  async _getStockProjections (client, days) {
    const query = `
      WITH ingredient_usage AS (
        SELECT 
          i.ingredient_id,
          i.name,
          i.stock,
          i.minimum_stock,
          i.unit,
          COALESCE(
            (SELECT AVG(pd.unit_price) 
             FROM purchase_details pd 
             WHERE pd.ingredient_id = i.ingredient_id 
               AND pd.deleted_at IS NULL
             LIMIT 5),
            0
          ) as avg_unit_price,
          COALESCE(
            SUM(di.quantity_used * sd.quantity) / 
            NULLIF(EXTRACT(EPOCH FROM (MAX(s.created_at AT TIME ZONE 'UTC') - MIN(s.created_at AT TIME ZONE 'UTC'))) / 86400, 0),
            0
          ) as daily_usage
        FROM ingredients i
        LEFT JOIN dish_ingredients di ON di.ingredient_id = i.ingredient_id
        LEFT JOIN sale_details sd ON sd.dish_id = di.dish_id AND sd.deleted_at IS NULL
        LEFT JOIN sales s ON s.sale_id = sd.sale_id 
          AND s.created_at AT TIME ZONE 'UTC' >= NOW() - INTERVAL '60 days'
          AND s.status != 'Cancelled'
          AND s.deleted_at IS NULL
        WHERE i.deleted_at IS NULL
          AND i.stock > 0
        GROUP BY i.ingredient_id, i.name, i.stock, i.minimum_stock, i.unit
        HAVING COALESCE(
          SUM(di.quantity_used * sd.quantity) / 
          NULLIF(EXTRACT(EPOCH FROM (MAX(s.created_at AT TIME ZONE 'UTC') - MIN(s.created_at AT TIME ZONE 'UTC'))) / 86400, 0),
          0
        ) > 0
      )
      SELECT 
        ingredient_id,
        name,
        stock,
        minimum_stock,
        unit,
        avg_unit_price,
        ROUND(CAST(daily_usage AS numeric), 3) as daily_usage,
        ROUND(CAST(stock / NULLIF(daily_usage, 0) AS numeric), 1) as days_until_depleted,
        CASE 
          WHEN (stock / NULLIF(daily_usage, 0)) < $1 THEN 
            ROUND(CAST((daily_usage * $1 - stock + minimum_stock) AS numeric), 2)
          ELSE 0
        END as recommended_order_quantity,
        CASE 
          WHEN (stock / NULLIF(daily_usage, 0)) < $1 THEN 
            ROUND(CAST((daily_usage * $1 - stock + minimum_stock) * avg_unit_price AS numeric), 2)
          ELSE 0
        END as estimated_cost
      FROM ingredient_usage
      WHERE (stock / NULLIF(daily_usage, 0)) <= $1 + 7
      ORDER BY days_until_depleted ASC
      LIMIT 20
    `
    const result = await client.query(query, [days])

    return result.rows.map(row => ({
      ingredientId: row.ingredient_id,
      ingredientName: row.name,
      currentStock: parseFloat(row.stock),
      minimumStock: parseFloat(row.minimum_stock),
      unit: row.unit,
      dailyUsage: parseFloat(row.daily_usage),
      daysUntilDepleted: parseFloat(row.days_until_depleted),
      recommendedOrderQuantity: parseFloat(row.recommended_order_quantity),
      estimatedCost: parseFloat(row.estimated_cost),
      priority: parseFloat(row.days_until_depleted) < days / 2 ? 'high' : 'medium'
    }))
  },

  async _getPurchaseRecommendations (client, days) {
    const stockProjections = await this._getStockProjections(client, days)

    const totalCost = stockProjections.reduce((sum, item) => sum + item.estimatedCost, 0)
    const highPriority = stockProjections.filter(item => item.priority === 'high')
    const mediumPriority = stockProjections.filter(item => item.priority === 'medium')

    return {
      summary: {
        totalItems: stockProjections.length,
        highPriorityItems: highPriority.length,
        mediumPriorityItems: mediumPriority.length,
        estimatedTotalCost: Math.round(totalCost * 100) / 100
      },
      recommendations: stockProjections,
      nextPurchaseDate: this._calculateNextPurchaseDate(stockProjections)
    }
  },

  _calculateNextPurchaseDate (projections) {
    if (projections.length === 0) {
      return null
    }

    const nearestDepletion = Math.min(...projections.map(p => p.daysUntilDepleted))
    const recommendedDays = Math.max(1, Math.floor(nearestDepletion - 2))

    const date = new Date()
    date.setDate(date.getDate() + recommendedDays)

    return {
      date: date.toISOString().split('T')[0],
      daysFromNow: recommendedDays,
      reason: `El ingrediente ${projections[0].ingredientName} se agotará en ${Math.round(nearestDepletion)} días`
    }
  },

  async _getFinancialMetrics (client) {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = this._getWeekStart(now)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const query = `
      SELECT 
        (SELECT COALESCE(SUM(total), 0) FROM sales WHERE sale_date >= $1 AND status = 'Completed' AND deleted_at IS NULL) as today_sales,
        (SELECT COALESCE(SUM(total), 0) FROM purchases WHERE purchase_date >= $1 AND deleted_at IS NULL) as today_purchases,
        
        (SELECT COALESCE(SUM(total), 0) FROM sales WHERE sale_date >= $2 AND status = 'Completed' AND deleted_at IS NULL) as week_sales,
        (SELECT COALESCE(SUM(total), 0) FROM purchases WHERE purchase_date >= $2 AND deleted_at IS NULL) as week_purchases,
        
        (SELECT COALESCE(SUM(total), 0) FROM sales WHERE sale_date >= $3 AND status = 'Completed' AND deleted_at IS NULL) as month_sales,
        (SELECT COALESCE(SUM(total), 0) FROM purchases WHERE purchase_date >= $3 AND deleted_at IS NULL) as month_purchases,
        
        (SELECT COALESCE(COUNT(*), 0) FROM sales WHERE sale_date >= $1 AND status = 'Completed' AND deleted_at IS NULL) as today_orders,
        (SELECT COALESCE(COUNT(*), 0) FROM sales WHERE sale_date >= $2 AND status = 'Completed' AND deleted_at IS NULL) as week_orders,
        (SELECT COALESCE(COUNT(*), 0) FROM sales WHERE sale_date >= $3 AND status = 'Completed' AND deleted_at IS NULL) as month_orders
    `

    const result = await client.query(query, [
      todayStart.toISOString().split('T')[0],
      weekStart.toISOString().split('T')[0],
      monthStart.toISOString().split('T')[0]
    ])

    const row = result.rows[0]

    const todaySales = parseFloat(row.today_sales) || 0
    const todayPurchases = parseFloat(row.today_purchases) || 0
    const weekSales = parseFloat(row.week_sales) || 0
    const weekPurchases = parseFloat(row.week_purchases) || 0
    const monthSales = parseFloat(row.month_sales) || 0
    const monthPurchases = parseFloat(row.month_purchases) || 0
    const monthOrders = parseInt(row.month_orders) || 0

    return {
      profitMargin: {
        today: todaySales > 0 ? Math.round(((todaySales - todayPurchases) / todaySales * 100) * 10) / 10 : 0,
        week: weekSales > 0 ? Math.round(((weekSales - weekPurchases) / weekSales * 100) * 10) / 10 : 0,
        month: monthSales > 0 ? Math.round(((monthSales - monthPurchases) / monthSales * 100) * 10) / 10 : 0
      },
      roi: {
        month: monthPurchases > 0 ? Math.round(((monthSales - monthPurchases) / monthPurchases * 100) * 10) / 10 : 0
      },
      costs: {
        averageCostPerDish: monthOrders > 0 ? Math.round((monthPurchases / monthOrders) * 100) / 100 : 0,
        foodCostPercentage: monthSales > 0 ? Math.round((monthPurchases / monthSales * 100) * 10) / 10 : 0
      },
      profit: {
        today: Math.round((todaySales - todayPurchases) * 100) / 100,
        week: Math.round((weekSales - weekPurchases) * 100) / 100,
        month: Math.round((monthSales - monthPurchases) * 100) / 100,
        averageProfitPerDish: monthOrders > 0 ? Math.round(((monthSales - monthPurchases) / monthOrders) * 100) / 100 : 0
      }
    }
  },

  _parsePeriod (period) {
    const match = period.match(/^(\d+)([dwmy])$/)
    if (!match) {
      throw new BadRequestError('Invalid period format. Use format like: 7d, 4w, 6m, 1y')
    }
    const [, value, unit] = match
    const multipliers = { d: 1, w: 7, m: 30, y: 365 }
    return parseInt(value) * multipliers[unit]
  },

  _getDateFormat (granularity) {
    const formats = {
      hourly: "TO_CHAR(DATE_TRUNC('hour', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD HH24:00')",
      daily: "TO_CHAR(DATE_TRUNC('day', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD')",
      weekly: "TO_CHAR(DATE_TRUNC('week', created_at AT TIME ZONE 'UTC'), 'YYYY-\"W\"IW')",
      monthly: "TO_CHAR(DATE_TRUNC('month', created_at AT TIME ZONE 'UTC'), 'YYYY-MM')",
      yearly: "TO_CHAR(DATE_TRUNC('year', created_at AT TIME ZONE 'UTC'), 'YYYY')"
    }
    if (!formats[granularity]) {
      throw new BadRequestError('Invalid granularity. Use: hourly, daily, weekly, monthly, yearly')
    }
    return formats[granularity]
  },

  _getDateTrunc (granularity) {
    const truncMap = {
      hourly: 'hour',
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
      yearly: 'year'
    }
    return truncMap[granularity] || 'day'
  },

  async getComparisons () {
    const client = await pool.connect()
    try {
      const comparisons = {
        sales: await this._getSalesComparisons(client),
        purchases: await this._getPurchasesComparisons(client),
        inventory: await this._getInventoryComparisons(client),
        dishes: await this._getDishesComparisons(client)
      }

      return comparisons
    } catch (error) {
      console.error('Error fetching comparisons:', error)
      throw new InternalServerError('Failed to fetch comparisons')
    } finally {
      client.release()
    }
  },

  async _getSalesComparisons (client) {
    const query = `
      WITH current_periods AS (
        SELECT
          -- Hoy
          COALESCE(SUM(CASE WHEN sale_date = CURRENT_DATE THEN total ELSE 0 END), 0) as today,
          -- Semana actual
          COALESCE(SUM(CASE WHEN sale_date >= CURRENT_DATE - INTERVAL '6 days' AND sale_date <= CURRENT_DATE THEN total ELSE 0 END), 0) as this_week,
          -- Mes actual
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) as this_month,
          -- Año actual
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', sale_date) = DATE_TRUNC('year', CURRENT_DATE) THEN total ELSE 0 END), 0) as this_year
        FROM sales
        WHERE status = 'Completed'
      ),
      previous_periods AS (
        SELECT
          -- Ayer
          COALESCE(SUM(CASE WHEN sale_date = CURRENT_DATE - INTERVAL '1 day' THEN total ELSE 0 END), 0) as yesterday,
          -- Semana anterior
          COALESCE(SUM(CASE WHEN sale_date >= CURRENT_DATE - INTERVAL '13 days' AND sale_date <= CURRENT_DATE - INTERVAL '7 days' THEN total ELSE 0 END), 0) as last_week,
          -- Mes anterior
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN total ELSE 0 END), 0) as last_month,
          -- Año anterior
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', sale_date) = DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year') THEN total ELSE 0 END), 0) as last_year
        FROM sales
        WHERE status = 'Completed'
      ),
      same_day_last_year AS (
        SELECT
          COALESCE(SUM(total), 0) as same_day_last_year
        FROM sales
        WHERE sale_date = CURRENT_DATE - INTERVAL '1 year'
          AND status = 'Completed'
      ),
      same_week_last_year AS (
        SELECT
          COALESCE(SUM(total), 0) as same_week_last_year
        FROM sales
        WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year') - INTERVAL '6 days'
          AND sale_date <= (CURRENT_DATE - INTERVAL '1 year')
          AND status = 'Completed'
      ),
      same_month_last_year AS (
        SELECT
          COALESCE(SUM(total), 0) as same_month_last_year
        FROM sales
        WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 year')
          AND status = 'Completed'
      )
      SELECT
        cp.today,
        pp.yesterday,
        sdly.same_day_last_year,
        CASE WHEN pp.yesterday > 0 THEN ROUND(((cp.today - pp.yesterday) / pp.yesterday * 100)::numeric, 1) ELSE NULL END as vs_yesterday_percent,
        CASE WHEN sdly.same_day_last_year > 0 THEN ROUND(((cp.today - sdly.same_day_last_year) / sdly.same_day_last_year * 100)::numeric, 1) ELSE NULL END as vs_same_day_last_year_percent,
        
        cp.this_week,
        pp.last_week,
        swly.same_week_last_year,
        CASE WHEN pp.last_week > 0 THEN ROUND(((cp.this_week - pp.last_week) / pp.last_week * 100)::numeric, 1) ELSE NULL END as vs_last_week_percent,
        CASE WHEN swly.same_week_last_year > 0 THEN ROUND(((cp.this_week - swly.same_week_last_year) / swly.same_week_last_year * 100)::numeric, 1) ELSE NULL END as vs_same_week_last_year_percent,
        
        cp.this_month,
        pp.last_month,
        smly.same_month_last_year,
        CASE WHEN pp.last_month > 0 THEN ROUND(((cp.this_month - pp.last_month) / pp.last_month * 100)::numeric, 1) ELSE NULL END as vs_last_month_percent,
        CASE WHEN smly.same_month_last_year > 0 THEN ROUND(((cp.this_month - smly.same_month_last_year) / smly.same_month_last_year * 100)::numeric, 1) ELSE NULL END as vs_same_month_last_year_percent,
        
        cp.this_year,
        pp.last_year,
        CASE WHEN pp.last_year > 0 THEN ROUND(((cp.this_year - pp.last_year) / pp.last_year * 100)::numeric, 1) ELSE NULL END as vs_last_year_percent
      FROM current_periods cp
      CROSS JOIN previous_periods pp
      CROSS JOIN same_day_last_year sdly
      CROSS JOIN same_week_last_year swly
      CROSS JOIN same_month_last_year smly
    `

    const result = await client.query(query)
    const row = result.rows[0]

    return {
      today: {
        current: parseFloat(row.today),
        vsYesterday: {
          value: parseFloat(row.yesterday),
          change: row.vs_yesterday_percent ? parseFloat(row.vs_yesterday_percent) : null
        },
        vsSameDayLastYear: {
          value: parseFloat(row.same_day_last_year),
          change: row.vs_same_day_last_year_percent ? parseFloat(row.vs_same_day_last_year_percent) : null
        }
      },
      week: {
        current: parseFloat(row.this_week),
        vsLastWeek: {
          value: parseFloat(row.last_week),
          change: row.vs_last_week_percent ? parseFloat(row.vs_last_week_percent) : null
        },
        vsSameWeekLastYear: {
          value: parseFloat(row.same_week_last_year),
          change: row.vs_same_week_last_year_percent ? parseFloat(row.vs_same_week_last_year_percent) : null
        }
      },
      month: {
        current: parseFloat(row.this_month),
        vsLastMonth: {
          value: parseFloat(row.last_month),
          change: row.vs_last_month_percent ? parseFloat(row.vs_last_month_percent) : null
        },
        vsSameMonthLastYear: {
          value: parseFloat(row.same_month_last_year),
          change: row.vs_same_month_last_year_percent ? parseFloat(row.vs_same_month_last_year_percent) : null
        }
      },
      year: {
        current: parseFloat(row.this_year),
        vsLastYear: {
          value: parseFloat(row.last_year),
          change: row.vs_last_year_percent ? parseFloat(row.vs_last_year_percent) : null
        }
      }
    }
  },

  async _getPurchasesComparisons (client) {
    const query = `
      WITH current_periods AS (
        SELECT
          COALESCE(SUM(CASE WHEN purchase_date = CURRENT_DATE THEN total ELSE 0 END), 0) as today,
          COALESCE(SUM(CASE WHEN purchase_date >= CURRENT_DATE - INTERVAL '6 days' AND purchase_date <= CURRENT_DATE THEN total ELSE 0 END), 0) as this_week,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', purchase_date) = DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) as this_month,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', purchase_date) = DATE_TRUNC('year', CURRENT_DATE) THEN total ELSE 0 END), 0) as this_year
        FROM purchases
      ),
      previous_periods AS (
        SELECT
          COALESCE(SUM(CASE WHEN purchase_date = CURRENT_DATE - INTERVAL '1 day' THEN total ELSE 0 END), 0) as yesterday,
          COALESCE(SUM(CASE WHEN purchase_date >= CURRENT_DATE - INTERVAL '13 days' AND purchase_date <= CURRENT_DATE - INTERVAL '7 days' THEN total ELSE 0 END), 0) as last_week,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', purchase_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN total ELSE 0 END), 0) as last_month,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', purchase_date) = DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year') THEN total ELSE 0 END), 0) as last_year
        FROM purchases
      ),
      same_periods_last_year AS (
        SELECT
          COALESCE(SUM(CASE WHEN purchase_date = CURRENT_DATE - INTERVAL '1 year' THEN total ELSE 0 END), 0) as same_day_last_year,
          COALESCE(SUM(CASE WHEN purchase_date >= (CURRENT_DATE - INTERVAL '1 year') - INTERVAL '6 days' AND purchase_date <= (CURRENT_DATE - INTERVAL '1 year') THEN total ELSE 0 END), 0) as same_week_last_year,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', purchase_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 year') THEN total ELSE 0 END), 0) as same_month_last_year
        FROM purchases
      )
      SELECT
        cp.*,
        pp.*,
        sp.*,
        CASE WHEN pp.yesterday > 0 THEN ROUND(((cp.today - pp.yesterday) / pp.yesterday * 100)::numeric, 1) ELSE NULL END as vs_yesterday_percent,
        CASE WHEN sp.same_day_last_year > 0 THEN ROUND(((cp.today - sp.same_day_last_year) / sp.same_day_last_year * 100)::numeric, 1) ELSE NULL END as vs_same_day_last_year_percent,
        CASE WHEN pp.last_week > 0 THEN ROUND(((cp.this_week - pp.last_week) / pp.last_week * 100)::numeric, 1) ELSE NULL END as vs_last_week_percent,
        CASE WHEN sp.same_week_last_year > 0 THEN ROUND(((cp.this_week - sp.same_week_last_year) / sp.same_week_last_year * 100)::numeric, 1) ELSE NULL END as vs_same_week_last_year_percent,
        CASE WHEN pp.last_month > 0 THEN ROUND(((cp.this_month - pp.last_month) / pp.last_month * 100)::numeric, 1) ELSE NULL END as vs_last_month_percent,
        CASE WHEN sp.same_month_last_year > 0 THEN ROUND(((cp.this_month - sp.same_month_last_year) / sp.same_month_last_year * 100)::numeric, 1) ELSE NULL END as vs_same_month_last_year_percent,
        CASE WHEN pp.last_year > 0 THEN ROUND(((cp.this_year - pp.last_year) / pp.last_year * 100)::numeric, 1) ELSE NULL END as vs_last_year_percent
      FROM current_periods cp
      CROSS JOIN previous_periods pp
      CROSS JOIN same_periods_last_year sp
    `

    const result = await client.query(query)
    const row = result.rows[0]

    return {
      today: {
        current: parseFloat(row.today),
        vsYesterday: {
          value: parseFloat(row.yesterday),
          change: row.vs_yesterday_percent ? parseFloat(row.vs_yesterday_percent) : null
        },
        vsSameDayLastYear: {
          value: parseFloat(row.same_day_last_year),
          change: row.vs_same_day_last_year_percent ? parseFloat(row.vs_same_day_last_year_percent) : null
        }
      },
      week: {
        current: parseFloat(row.this_week),
        vsLastWeek: {
          value: parseFloat(row.last_week),
          change: row.vs_last_week_percent ? parseFloat(row.vs_last_week_percent) : null
        },
        vsSameWeekLastYear: {
          value: parseFloat(row.same_week_last_year),
          change: row.vs_same_week_last_year_percent ? parseFloat(row.vs_same_week_last_year_percent) : null
        }
      },
      month: {
        current: parseFloat(row.this_month),
        vsLastMonth: {
          value: parseFloat(row.last_month),
          change: row.vs_last_month_percent ? parseFloat(row.vs_last_month_percent) : null
        },
        vsSameMonthLastYear: {
          value: parseFloat(row.same_month_last_year),
          change: row.vs_same_month_last_year_percent ? parseFloat(row.vs_same_month_last_year_percent) : null
        }
      },
      year: {
        current: parseFloat(row.this_year),
        vsLastYear: {
          value: parseFloat(row.last_year),
          change: row.vs_last_year_percent ? parseFloat(row.vs_last_year_percent) : null
        }
      }
    }
  },

  async _getInventoryComparisons (client) {
    const query = `
      SELECT
        COUNT(*) as current_total,
        COALESCE(SUM(CASE WHEN stock <= minimum_stock THEN 1 ELSE 0 END), 0) as current_low_stock,
        COALESCE(SUM(stock * COALESCE((
          SELECT AVG(unit_price)
          FROM purchase_details pd
          WHERE pd.ingredient_id = i.ingredient_id
        ), 0)), 0) as current_value
      FROM ingredients i
      WHERE status = 'Active'
    `

    const result = await client.query(query)
    const row = result.rows[0]

    const compareQuery = `
      SELECT
        COUNT(*) as past_total,
        0 as past_low_stock,
        0 as past_value
      FROM ingredients
      WHERE status = 'Active'
    `

    const compareResult = await client.query(compareQuery)
    const compareRow = compareResult.rows[0]

    return {
      totalIngredients: {
        current: parseInt(row.current_total),
        vs30DaysAgo: {
          value: parseInt(compareRow.past_total),
          change: compareRow.past_total > 0
            ? parseFloat(((row.current_total - compareRow.past_total) / compareRow.past_total * 100).toFixed(1))
            : null
        }
      },
      lowStockItems: {
        current: parseInt(row.current_low_stock),
        vs30DaysAgo: {
          value: parseInt(compareRow.past_low_stock),
          change: null
        }
      },
      totalValue: {
        current: parseFloat(row.current_value),
        vs30DaysAgo: {
          value: parseFloat(compareRow.past_value),
          change: null
        }
      }
    }
  },

  async _getDishesComparisons (client) {
    const query = `
      WITH current_month AS (
        SELECT
          d.dish_id,
          d.name,
          COALESCE(SUM(sd.quantity), 0) as quantity_sold,
          COALESCE(SUM(sd.quantity * sd.unit_price), 0) as revenue
        FROM dishes d
        LEFT JOIN sale_details sd ON d.dish_id = sd.dish_id
        LEFT JOIN sales s ON sd.sale_id = s.sale_id
        WHERE s.status = 'Completed'
          AND DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY d.dish_id, d.name
        ORDER BY quantity_sold DESC
        LIMIT 5
      ),
      last_month AS (
        SELECT
          d.dish_id,
          d.name,
          COALESCE(SUM(sd.quantity), 0) as quantity_sold,
          COALESCE(SUM(sd.quantity * sd.unit_price), 0) as revenue
        FROM dishes d
        LEFT JOIN sale_details sd ON d.dish_id = sd.dish_id
        LEFT JOIN sales s ON sd.sale_id = s.sale_id
        WHERE s.status = 'Completed'
          AND DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        GROUP BY d.dish_id, d.name
        ORDER BY quantity_sold DESC
        LIMIT 5
      )
      SELECT
        cm.dish_id,
        cm.name,
        cm.quantity_sold as current_quantity,
        cm.revenue as current_revenue,
        COALESCE(lm.quantity_sold, 0) as last_month_quantity,
        COALESCE(lm.revenue, 0) as last_month_revenue,
        CASE WHEN COALESCE(lm.quantity_sold, 0) > 0 
          THEN ROUND(((cm.quantity_sold - lm.quantity_sold) / lm.quantity_sold * 100)::numeric, 1)
          ELSE NULL 
        END as quantity_change_percent,
        CASE WHEN COALESCE(lm.revenue, 0) > 0 
          THEN ROUND(((cm.revenue - lm.revenue) / lm.revenue * 100)::numeric, 1)
          ELSE NULL 
        END as revenue_change_percent
      FROM current_month cm
      LEFT JOIN last_month lm ON cm.dish_id = lm.dish_id
      ORDER BY cm.quantity_sold DESC
    `

    const result = await client.query(query)

    return {
      topDishes: result.rows.map(row => ({
        id: row.dish_id,
        name: row.name,
        currentMonth: {
          quantitySold: parseInt(row.current_quantity),
          revenue: parseFloat(row.current_revenue)
        },
        lastMonth: {
          quantitySold: parseInt(row.last_month_quantity),
          revenue: parseFloat(row.last_month_revenue)
        },
        change: {
          quantityPercent: row.quantity_change_percent ? parseFloat(row.quantity_change_percent) : null,
          revenuePercent: row.revenue_change_percent ? parseFloat(row.revenue_change_percent) : null
        }
      }))
    }
  },

  async getSalesBreakdown () {
    const client = await pool.connect()
    try {
      return await this._getSalesBreakdown(client)
    } catch (error) {
      console.error('Error fetching sales breakdown:', error)
      throw new InternalServerError('Failed to fetch sales breakdown')
    } finally {
      client.release()
    }
  },

  async _getSalesBreakdown (client) {
    const query = `
      WITH category_sales AS (
        SELECT
          dc.category_id,
          dc.name as category_name,
          dc.description,
          COALESCE(SUM(CASE WHEN s.sale_date >= CURRENT_DATE - INTERVAL '6 days' THEN sd.quantity * sd.unit_price ELSE 0 END), 0) as week_revenue,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE) THEN sd.quantity * sd.unit_price ELSE 0 END), 0) as month_revenue,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', s.sale_date) = DATE_TRUNC('year', CURRENT_DATE) THEN sd.quantity * sd.unit_price ELSE 0 END), 0) as year_revenue,
          COALESCE(SUM(CASE WHEN s.sale_date >= CURRENT_DATE - INTERVAL '6 days' THEN sd.quantity ELSE 0 END), 0) as week_quantity,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE) THEN sd.quantity ELSE 0 END), 0) as month_quantity,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', s.sale_date) = DATE_TRUNC('year', CURRENT_DATE) THEN sd.quantity ELSE 0 END), 0) as year_quantity,
          COUNT(DISTINCT CASE WHEN s.sale_date >= CURRENT_DATE - INTERVAL '6 days' THEN d.dish_id END) as week_dishes_count,
          COUNT(DISTINCT CASE WHEN DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE) THEN d.dish_id END) as month_dishes_count
        FROM dish_categories dc
        LEFT JOIN dishes d ON dc.category_id = d.category_id
        LEFT JOIN sale_details sd ON d.dish_id = sd.dish_id
        LEFT JOIN sales s ON sd.sale_id = s.sale_id
        WHERE s.status = 'Completed' OR s.status IS NULL
        GROUP BY dc.category_id, dc.name, dc.description
      ),
      totals AS (
        SELECT
          SUM(week_revenue) as total_week_revenue,
          SUM(month_revenue) as total_month_revenue,
          SUM(year_revenue) as total_year_revenue
        FROM category_sales
      )
      SELECT
        cs.*,
        t.total_week_revenue,
        t.total_month_revenue,
        t.total_year_revenue,
        CASE WHEN t.total_week_revenue > 0 THEN ROUND((cs.week_revenue / t.total_week_revenue * 100)::numeric, 1) ELSE 0 END as week_percentage,
        CASE WHEN t.total_month_revenue > 0 THEN ROUND((cs.month_revenue / t.total_month_revenue * 100)::numeric, 1) ELSE 0 END as month_percentage,
        CASE WHEN t.total_year_revenue > 0 THEN ROUND((cs.year_revenue / t.total_year_revenue * 100)::numeric, 1) ELSE 0 END as year_percentage
      FROM category_sales cs
      CROSS JOIN totals t
      WHERE cs.month_revenue > 0 OR cs.week_revenue > 0 OR cs.year_revenue > 0
      ORDER BY cs.month_revenue DESC
    `

    const result = await client.query(query)

    return {
      byCategory: result.rows.map(row => ({
        categoryId: row.category_id,
        categoryName: row.category_name,
        description: row.description,
        week: {
          revenue: parseFloat(row.week_revenue),
          quantity: parseInt(row.week_quantity),
          dishesCount: parseInt(row.week_dishes_count),
          percentage: parseFloat(row.week_percentage)
        },
        month: {
          revenue: parseFloat(row.month_revenue),
          quantity: parseInt(row.month_quantity),
          dishesCount: parseInt(row.month_dishes_count),
          percentage: parseFloat(row.month_percentage)
        },
        year: {
          revenue: parseFloat(row.year_revenue),
          quantity: parseInt(row.year_quantity),
          percentage: parseFloat(row.year_percentage)
        }
      })),
      totals: {
        week: parseFloat(result.rows[0]?.total_week_revenue || 0),
        month: parseFloat(result.rows[0]?.total_month_revenue || 0),
        year: parseFloat(result.rows[0]?.total_year_revenue || 0)
      }
    }
  },

  async getPurchasesBreakdown () {
    const client = await pool.connect()
    try {
      return await this._getPurchasesBreakdown(client)
    } catch (error) {
      console.error('Error fetching purchases breakdown:', error)
      throw new InternalServerError('Failed to fetch purchases breakdown')
    } finally {
      client.release()
    }
  },

  async _getPurchasesBreakdown (client) {
    const query = `
      WITH category_purchases AS (
        SELECT
          ic.category_id,
          ic.name as category_name,
          ic.description,
          COALESCE(SUM(CASE WHEN p.purchase_date >= CURRENT_DATE - INTERVAL '6 days' THEN pd.quantity * pd.unit_price ELSE 0 END), 0) as week_cost,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', p.purchase_date) = DATE_TRUNC('month', CURRENT_DATE) THEN pd.quantity * pd.unit_price ELSE 0 END), 0) as month_cost,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', p.purchase_date) = DATE_TRUNC('year', CURRENT_DATE) THEN pd.quantity * pd.unit_price ELSE 0 END), 0) as year_cost,
          COALESCE(SUM(CASE WHEN p.purchase_date >= CURRENT_DATE - INTERVAL '6 days' THEN pd.quantity ELSE 0 END), 0) as week_quantity,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', p.purchase_date) = DATE_TRUNC('month', CURRENT_DATE) THEN pd.quantity ELSE 0 END), 0) as month_quantity,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('year', p.purchase_date) = DATE_TRUNC('year', CURRENT_DATE) THEN pd.quantity ELSE 0 END), 0) as year_quantity,
          COUNT(DISTINCT CASE WHEN p.purchase_date >= CURRENT_DATE - INTERVAL '6 days' THEN i.ingredient_id END) as week_ingredients_count,
          COUNT(DISTINCT CASE WHEN DATE_TRUNC('month', p.purchase_date) = DATE_TRUNC('month', CURRENT_DATE) THEN i.ingredient_id END) as month_ingredients_count
        FROM ingredient_categories ic
        LEFT JOIN ingredients i ON ic.category_id = i.category_id
        LEFT JOIN purchase_details pd ON i.ingredient_id = pd.ingredient_id
        LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
        GROUP BY ic.category_id, ic.name, ic.description
      ),
      totals AS (
        SELECT
          SUM(week_cost) as total_week_cost,
          SUM(month_cost) as total_month_cost,
          SUM(year_cost) as total_year_cost
        FROM category_purchases
      )
      SELECT
        cp.*,
        t.total_week_cost,
        t.total_month_cost,
        t.total_year_cost,
        CASE WHEN t.total_week_cost > 0 THEN ROUND((cp.week_cost / t.total_week_cost * 100)::numeric, 1) ELSE 0 END as week_percentage,
        CASE WHEN t.total_month_cost > 0 THEN ROUND((cp.month_cost / t.total_month_cost * 100)::numeric, 1) ELSE 0 END as month_percentage,
        CASE WHEN t.total_year_cost > 0 THEN ROUND((cp.year_cost / t.total_year_cost * 100)::numeric, 1) ELSE 0 END as year_percentage
      FROM category_purchases cp
      CROSS JOIN totals t
      WHERE cp.month_cost > 0 OR cp.week_cost > 0 OR cp.year_cost > 0
      ORDER BY cp.month_cost DESC
    `

    const result = await client.query(query)

    return {
      byCategory: result.rows.map(row => ({
        categoryId: row.category_id,
        categoryName: row.category_name,
        description: row.description,
        week: {
          cost: parseFloat(row.week_cost),
          quantity: parseFloat(row.week_quantity),
          ingredientsCount: parseInt(row.week_ingredients_count),
          percentage: parseFloat(row.week_percentage)
        },
        month: {
          cost: parseFloat(row.month_cost),
          quantity: parseFloat(row.month_quantity),
          ingredientsCount: parseInt(row.month_ingredients_count),
          percentage: parseFloat(row.month_percentage)
        },
        year: {
          cost: parseFloat(row.year_cost),
          quantity: parseFloat(row.year_quantity),
          percentage: parseFloat(row.year_percentage)
        }
      })),
      totals: {
        week: parseFloat(result.rows[0]?.total_week_cost || 0),
        month: parseFloat(result.rows[0]?.total_month_cost || 0),
        year: parseFloat(result.rows[0]?.total_year_cost || 0)
      }
    }
  }
}
