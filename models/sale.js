import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const SaleModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push('(notes LIKE ? OR customer LIKE ?)')
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      if (filters.status) {
        conditions.push('status = ?')
        params.push(filters.status)
      }

      if (filters.startDate) {
        conditions.push('sale_date >= ?')
        params.push(filters.startDate)
      }

      if (filters.endDate) {
        conditions.push('sale_date <= ?')
        params.push(filters.endDate)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const query = `
        SELECT * FROM sales 
        ${whereClause}
        ORDER BY sale_date DESC, sale_id DESC 
        LIMIT ? OFFSET ?
      `
      params.push(parseInt(limit), offset)

      const [saleRows] = await pool.query(query, params)

      for (const sale of saleRows) {
        const [detailRows] = await pool.query(`
          SELECT 
            sd.*,
            d.dish_id,
            d.name as dish_name,
            d.description as dish_description,
            d.price as dish_price,
            d.status as dish_status,
            d.created_at as dish_created_at,
            d.updated_at as dish_updated_at,
            dc.category_id as dish_category_id,
            dc.name as dish_category_name
          FROM sale_details sd
          LEFT JOIN dishes d ON sd.dish_id = d.dish_id
          LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
          WHERE sd.sale_id = ?
          ORDER BY sd.sale_detail_id
        `, [sale.sale_id])
        sale.details = detailRows
      }

      const countQuery = `SELECT COUNT(*) AS total FROM sales ${whereClause}`

      const [[{ total }]] = await pool.query(countQuery, params.slice(0, -2))
      return { data: saleRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [saleRows] = await pool.query(`
        SELECT * FROM sales 
        WHERE sale_id = ?
      `, [id])

      if (saleRows.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const sale = saleRows[0]

      const [detailRows] = await pool.query(`
        SELECT 
          sd.*,
          d.dish_id,
          d.name as dish_name,
          d.description as dish_description,
          d.price as dish_price,
          d.status as dish_status,
          d.created_at as dish_created_at,
          d.updated_at as dish_updated_at,
          dc.category_id as dish_category_id,
          dc.name as dish_category_name
        FROM sale_details sd
        LEFT JOIN dishes d ON sd.dish_id = d.dish_id
        LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
        WHERE sd.sale_id = ?
        ORDER BY sd.sale_detail_id
      `, [id])

      sale.details = detailRows

      return sale
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (saleData) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const { sale_date: saleDate, customer, notes, details } = saleData

      if (!details || !Array.isArray(details) || details.length === 0) {
        throw new BadRequestError('Sale must have at least one detail item')
      }

      // No calculamos el total manualmente, el trigger lo hará automáticamente
      // El trigger también convierte customer vacío a 'Público general'
      const [saleResult] = await connection.query(
        'INSERT INTO sales (sale_date, customer, notes) VALUES (?, ?, ?)',
        [saleDate, customer || '', notes]
      )

      const saleId = saleResult.insertId

      // Los triggers calcularán el subtotal, actualizarán el total y reducirán el stock según las recetas
      for (const detail of details) {
        const { dish_id: dishId, quantity, unit_price: unitPrice, discount = 0 } = detail

        await connection.query(
          'INSERT INTO sale_details (sale_id, dish_id, quantity, unit_price, discount) VALUES (?, ?, ?, ?, ?)',
          [saleId, dishId, quantity, unitPrice, discount]
        )
      }

      await connection.commit()

      return await this.getById(saleId)
    } catch (error) {
      await connection.rollback()
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      connection.release()
    }
  },

  async update (id, saleData) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [existingSale] = await connection.query('SELECT * FROM sales WHERE sale_id = ?', [id])
      if (existingSale.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const { sale_date: saleDate, customer, notes, details } = saleData

      if (details && Array.isArray(details)) {
        if (details.length === 0) {
          throw new BadRequestError('Sale must have at least one detail item')
        }

        // Eliminamos los detalles antiguos (los triggers revertirán el stock y el total automáticamente)
        await connection.query('DELETE FROM sale_details WHERE sale_id = ?', [id])

        // Actualizamos la venta (sin calcular el total manualmente)
        await connection.query(
          'UPDATE sales SET sale_date = ?, customer = ?, notes = ? WHERE sale_id = ?',
          [saleDate, customer || '', notes, id]
        )

        // Insertamos los nuevos detalles (los triggers calcularán subtotal, actualizarán total y stock)
        for (const detail of details) {
          const { dish_id: dishId, quantity, unit_price: unitPrice, discount = 0 } = detail

          await connection.query(
            'INSERT INTO sale_details (sale_id, dish_id, quantity, unit_price, discount) VALUES (?, ?, ?, ?, ?)',
            [id, dishId, quantity, unitPrice, discount]
          )
        }
      } else {
        const fields = []
        const values = []

        if (saleDate !== undefined) {
          fields.push('sale_date = ?')
          values.push(saleDate)
        }
        if (customer !== undefined) {
          fields.push('customer = ?')
          values.push(customer || '')
        }
        if (notes !== undefined) {
          fields.push('notes = ?')
          values.push(notes)
        }

        if (fields.length > 0) {
          values.push(id)
          await connection.query(
            `UPDATE sales SET ${fields.join(', ')} WHERE sale_id = ?`,
            values
          )
        }
      }

      await connection.commit()

      return await this.getById(id)
    } catch (error) {
      await connection.rollback()
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      connection.release()
    }
  },

  async delete (id) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [checkRows] = await connection.query('SELECT * FROM sales WHERE sale_id = ?', [id])
      if (checkRows.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const saleToDelete = await this.getById(id)

      if (saleToDelete.deleted_at !== null) {
        throw new BadRequestError('Sale is already cancelled')
      }

      // Eliminamos los detalles (los triggers revertirán el stock automáticamente)
      await connection.query('DELETE FROM sale_details WHERE sale_id = ?', [id])

      // Marcamos la venta como eliminada (soft delete)
      await connection.query(
        'UPDATE sales SET status = ?, deleted_at = CURRENT_TIMESTAMP WHERE sale_id = ?',
        ['Cancelled', id]
      )

      await connection.commit()

      return await this.getById(id)
    } catch (error) {
      await connection.rollback()
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      connection.release()
    }
  },

  async getDetailsBySaleId (saleId, { page = 1, limit = 10 } = {}) {
    try {
      const [saleRows] = await pool.query(
        'SELECT sale_id FROM sales WHERE sale_id = ?',
        [saleId]
      )

      if (saleRows.length === 0) {
        throw new NotFoundError('Sale not found')
      }

      const offset = (parseInt(page) - 1) * parseInt(limit)
      const [detailRows] = await pool.query(`
        SELECT 
          sd.*,
          d.name as dish_name,
          dc.name as dish_category
        FROM sale_details sd
        LEFT JOIN dishes d ON sd.dish_id = d.dish_id
        LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
        WHERE sd.sale_id = ?
        ORDER BY sd.sale_detail_id
        LIMIT ? OFFSET ?
      `, [saleId, parseInt(limit), offset])

      const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) AS total FROM sale_details WHERE sale_id = ?',
        [saleId]
      )

      return { data: detailRows, total }
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  }
}
