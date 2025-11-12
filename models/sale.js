import pool from '../config/database.js'
import { BadRequestError, InsufficientStockError, InternalServerError, isCustomUserError, NotFoundError } from '../utils/errors.js'

export const SaleModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['deleted_at IS NULL']
      const params = []

      if (filters.search) {
        const { normalizeString } = await import('../utils/stringUtils.js')
        const normalizedSearch = normalizeString(filters.search, {
          toLowerCase: true,
          removeAccents: true,
          trim: true,
          removeExtraSpaces: true
        })
        conditions.push(`(
          f_normalize(notes) ILIKE $${params.length + 1} OR
          f_normalize(customer) ILIKE $${params.length + 2}
        )`)
        const searchTerm = `%${normalizedSearch}%`
        params.push(searchTerm, searchTerm)
      }
      if (filters.status) {
        conditions.push(`status = $${params.length + 1}`)
        params.push(filters.status)
      }

      if (filters.startDate) {
        conditions.push(`sale_date >= $${params.length + 1}`)
        params.push(filters.startDate)
      }

      if (filters.endDate) {
        conditions.push(`sale_date <= $${params.length + 1}`)
        params.push(filters.endDate)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const query = `
        SELECT 
          s.*,
          -- Agregamos los detalles como un array JSON
          COALESCE(
            (
              SELECT json_agg(json_build_object(
                'sale_detail_id', sd.sale_detail_id,
                'sale_id', sd.sale_id,
                'dish_id', sd.dish_id,
                'quantity', sd.quantity,
                'unit_price', sd.unit_price,
                'discount', sd.discount,
                'subtotal', sd.subtotal,
                'dish_name', d.name,
                'dish_description', d.description,
                'dish_price', d.price,
                'dish_status', d.status,
                'dish_category_id', dc.category_id,
                'dish_category_name', dc.name
              ))
              FROM sale_details sd
              LEFT JOIN dishes d ON sd.dish_id = d.dish_id
              LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
              WHERE sd.sale_id = s.sale_id
            ), 
            '[]'::json -- Devuelve un array vacío si no hay detalles
          ) as details
        FROM sales s
        ${whereClause}
        GROUP BY s.sale_id -- Agrupamos por sale_id
        ORDER BY s.sale_date DESC, s.sale_id DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `
      params.push(parseInt(limit), offset)

      const { rows: saleRows } = await pool.query(query, params)

      const countQuery = `SELECT COUNT(*) AS total FROM sales ${whereClause}`

      const { rows: [{ total }] } = await pool.query(countQuery, params.slice(0, -2))
      return { data: saleRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const query = `
        SELECT 
          s.*,
          COALESCE(
            (
              SELECT json_agg(json_build_object(
                'sale_detail_id', sd.sale_detail_id,
                'sale_id', sd.sale_id,
                'dish_id', sd.dish_id,
                'quantity', sd.quantity,
                'unit_price', sd.unit_price,
                'discount', sd.discount,
                'subtotal', sd.subtotal,
                'dish_name', d.name,
                'dish_description', d.description,
                'dish_price', d.price,
                'dish_status', d.status,
                'dish_category_id', dc.category_id,
                'dish_category_name', dc.name
              ))
              FROM sale_details sd
              LEFT JOIN dishes d ON sd.dish_id = d.dish_id
              LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
              WHERE sd.sale_id = s.sale_id
            ), 
            '[]'::json
          ) as details
        FROM sales s
        WHERE s.sale_id = $1
        GROUP BY s.sale_id
      `

      const { rows: saleRows } = await pool.query(query, [id])

      if (saleRows.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const sale = saleRows[0]

      return sale
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (saleData, options = { forceSale: false }) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const { saleDate, customer, notes, details } = saleData
      const { forceSale } = options

      if (!details || !Array.isArray(details) || details.length === 0) {
        throw new BadRequestError('Sale must have at least one detail item')
      }

      if (!forceSale) {
        const stockValidation = await this.validateIngredientsStock(details)

        if (!stockValidation.isValid) {
          throw new InsufficientStockError(
            'Insufficient ingredients stock for sale',
            stockValidation.insufficientDishes
          )
        }
      }

      const { rows: [sale] } = await client.query(
        'INSERT INTO sales (sale_date, customer, notes) VALUES ($1, $2, $3) RETURNING sale_id',
        [saleDate, customer || '', notes]
      )

      const saleId = sale.sale_id

      for (const detail of details) {
        const { dishId, quantity, unitPrice, discount = 0 } = detail

        await client.query(
          'INSERT INTO sale_details (sale_id, dish_id, quantity, unit_price, discount) VALUES ($1, $2, $3, $4, $5)',
          [saleId, dishId, quantity, unitPrice, discount]
        )
      }

      await client.query('COMMIT')

      if (forceSale) {
        await this.fixNegativeStock(client)
      }

      return await this.getById(saleId)
    } catch (error) {
      await client.query('ROLLBACK')
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      client.release()
    }
  },

  async update (id, saleData) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const { rows: existingSale } = await client.query('SELECT * FROM sales WHERE sale_id = $1', [id])
      if (existingSale.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const { saleDate, customer, notes } = saleData

      const fields = []
      const values = []
      let paramCount = 1

      if (saleDate !== undefined) {
        fields.push(`sale_date = $${paramCount++}`)
        values.push(saleDate)
      }
      if (customer !== undefined) {
        fields.push(`customer = $${paramCount++}`)
        values.push(customer || '')
      }
      if (notes !== undefined) {
        fields.push(`notes = $${paramCount++}`)
        values.push(notes)
      }

      if (fields.length > 0) {
        values.push(id)
        await client.query(
          `UPDATE sales SET ${fields.join(', ')} WHERE sale_id = $${paramCount}`,
          values
        )
      }

      await client.query('COMMIT')

      return await this.getById(id)
    } catch (error) {
      await client.query('ROLLBACK')
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      client.release()
    }
  },

  async delete (id) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const { rows: checkRows } = await client.query('SELECT * FROM sales WHERE sale_id = $1', [id])
      if (checkRows.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const saleToDelete = await this.getById(id)

      if (saleToDelete.deleted_at !== null) {
        throw new BadRequestError('Sale is already cancelled')
      }

      await client.query('DELETE FROM sale_details WHERE sale_id = $1', [id])

      await client.query(
        'UPDATE sales SET status = $1, deleted_at = CURRENT_TIMESTAMP WHERE sale_id = $2',
        ['Cancelled', id]
      )

      await client.query('COMMIT')

      return await this.getById(id)
    } catch (error) {
      await client.query('ROLLBACK')
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      client.release()
    }
  },

  async validateIngredientsStock (details) {
    try {
      const insufficientDishes = []

      for (const detail of details) {
        const { dishId, quantity } = detail

        const { rows: ingredients } = await pool.query(`
          SELECT 
            di.ingredient_id,
            i.name as ingredient_name,
            di.quantity_used,
            i.stock as available_stock,
            i.unit
          FROM dish_ingredients di
          INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
          WHERE di.dish_id = $1 AND i.deleted_at IS NULL
        `, [dishId])

        if (ingredients.length === 0) {
          continue
        }

        const insufficientIngredients = []

        for (const ing of ingredients) {
          const requiredQuantity = parseFloat(ing.quantity_used) * quantity
          const availableStock = parseFloat(ing.available_stock)

          if (availableStock < requiredQuantity) {
            insufficientIngredients.push({
              ingredientId: ing.ingredient_id,
              name: ing.ingredient_name,
              required: requiredQuantity,
              available: availableStock,
              shortfall: requiredQuantity - availableStock,
              unit: ing.unit
            })
          }
        }

        if (insufficientIngredients.length > 0) {
          const { rows: [dish] } = await pool.query(
            'SELECT dish_id, name FROM dishes WHERE dish_id = $1',
            [dishId]
          )

          insufficientDishes.push({
            dishId,
            dishName: dish ? dish.name : 'Unknown',
            quantity,
            insufficientIngredients
          })
        }
      }

      return {
        isValid: insufficientDishes.length === 0,
        insufficientDishes
      }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async fixNegativeStock (client) {
    try {
      await client.query(`
        UPDATE ingredients 
        SET stock = 0 
        WHERE stock < 0
      `)
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  }

}
