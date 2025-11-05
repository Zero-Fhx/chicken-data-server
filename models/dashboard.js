import pool from '../config/database.js'
import { InternalServerError } from '../utils/errors.js'

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
        recentActivity: await this._getRecentActivity(client)
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw new InternalServerError('Failed to fetch dashboard statistics')
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
  }
}
