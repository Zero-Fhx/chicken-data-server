import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const PurchaseModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['p.deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push(`(p.notes ILIKE $${params.length + 1} OR s.name ILIKE $${params.length + 2})`)
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      if (filters.status) {
        conditions.push(`p.status = $${params.length + 1}`)
        params.push(filters.status)
      }

      if (filters.supplierId) {
        conditions.push(`p.supplier_id = $${params.length + 1}`)
        params.push(filters.supplierId)
      }

      if (filters.startDate) {
        conditions.push(`p.purchase_date >= $${params.length + 1}`)
        params.push(filters.startDate)
      }

      if (filters.endDate) {
        conditions.push(`p.purchase_date <= $${params.length + 1}`)
        params.push(filters.endDate)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const query = `
        SELECT 
          p.*,
          s.supplier_id,
          s.name as supplier_name,
          s.ruc as supplier_ruc,
          s.phone as supplier_phone,
          s.email as supplier_email,
          s.address as supplier_address,
          s.contact_person as supplier_contact_person,
          s.status as supplier_status,
          s.created_at as supplier_created_at,
          s.updated_at as supplier_updated_at,

          -- Agregamos los detalles como un array JSON
          COALESCE(
            (
              SELECT json_agg(json_build_object(
                'purchase_detail_id', pd.purchase_detail_id,
                'purchase_id', pd.purchase_id,
                'ingredient_id', pd.ingredient_id,
                'quantity', pd.quantity,
                'unit_price', pd.unit_price,
                'subtotal', pd.subtotal,
                'ingredient_name', i.name,
                'ingredient_unit', i.unit,
                'ingredient_status', i.status,
                'ingredient_stock', i.stock,
                'ingredient_minimum_stock', i.minimum_stock,
                'ingredient_category_id', ic.category_id,
                'ingredient_category_name', ic.name
              ))
              FROM purchase_details pd
              LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
              LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
              WHERE pd.purchase_id = p.purchase_id
            ), 
            '[]'::json -- Devuelve un array vacío si no hay detalles
          ) as details

        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        ${whereClause}
        GROUP BY p.purchase_id, s.supplier_id -- Agrupamos por las claves primarias
        ORDER BY p.purchase_date DESC, p.purchase_id DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `
      params.push(parseInt(limit), offset)

      const { rows: purchaseRows } = await pool.query(query, params)

      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM purchases p 
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        ${whereClause}
      `

      const { rows: [{ total }] } = await pool.query(countQuery, params.slice(0, -2))
      return { data: purchaseRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const query = `
        SELECT 
          p.*,
          s.supplier_id,
          s.name as supplier_name,
          s.ruc as supplier_ruc,
          s.phone as supplier_phone,
          s.email as supplier_email,
          s.address as supplier_address,
          s.contact_person as supplier_contact_person,
          s.status as supplier_status,
          s.created_at as supplier_created_at,
          s.updated_at as supplier_updated_at,

          COALESCE(
            (
              SELECT json_agg(json_build_object(
                'purchase_detail_id', pd.purchase_detail_id,
                'purchase_id', pd.purchase_id,
                'ingredient_id', pd.ingredient_id,
                'quantity', pd.quantity,
                'unit_price', pd.unit_price,
                'subtotal', pd.subtotal,
                'ingredient_name', i.name,
                'ingredient_unit', i.unit,
                'ingredient_status', i.status,
                'ingredient_stock', i.stock,
                'ingredient_minimum_stock', i.minimum_stock,
                'ingredient_category_id', ic.category_id,
                'ingredient_category_name', ic.name
              ))
              FROM purchase_details pd
              LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
              LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
              WHERE pd.purchase_id = p.purchase_id
            ), 
            '[]'::json
          ) as details

        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        WHERE p.purchase_id = $1
        GROUP BY p.purchase_id, s.supplier_id
      `

      const { rows: purchaseRows } = await pool.query(query, [id])

      if (purchaseRows.length === 0) {
        throw new NotFoundError('Purchase not found')
      }

      const purchase = purchaseRows[0]

      return purchase
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (purchaseData) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const { supplierId, purchaseDate, notes, details } = purchaseData

      if (!details || !Array.isArray(details) || details.length === 0) {
        throw new BadRequestError('Purchase must have at least one detail item')
      }

      const { rows: [purchase] } = await client.query(
        'INSERT INTO purchases (supplier_id, purchase_date, notes) VALUES ($1, $2, $3) RETURNING purchase_id',
        [supplierId, purchaseDate, notes]
      )

      const purchaseId = purchase.purchase_id

      for (const detail of details) {
        const { ingredientId, quantity, unitPrice } = detail

        await client.query(
          'INSERT INTO purchase_details (purchase_id, ingredient_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [purchaseId, ingredientId, quantity, unitPrice]
        )
      }

      await client.query('COMMIT')

      return await this.getById(purchaseId)
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

  async update (id, purchaseData) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const originalPurchase = await this.getById(id)
      if (!originalPurchase) {
        throw new NotFoundError('Purchase not found')
      }

      const { supplierId, purchaseDate, notes } = purchaseData

      const fields = []
      const values = []
      let paramCount = 1

      if (supplierId !== undefined) {
        fields.push(`supplier_id = $${paramCount++}`)
        values.push(supplierId)
      }
      if (purchaseDate !== undefined) {
        fields.push(`purchase_date = $${paramCount++}`)
        values.push(purchaseDate)
      }
      if (notes !== undefined) {
        fields.push(`notes = $${paramCount++}`)
        values.push(notes)
      }

      if (fields.length > 0) {
        values.push(id)
        await client.query(
          `UPDATE purchases SET ${fields.join(', ')} WHERE purchase_id = $${paramCount}`,
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

      const purchaseToDelete = await this.getById(id)
      if (!purchaseToDelete) {
        throw new NotFoundError('Purchase not found')
      }

      if (purchaseToDelete.deleted_at !== null) {
        throw new BadRequestError('Purchase is already cancelled')
      }

      await client.query(
        'UPDATE purchase_details SET deleted_at = CURRENT_TIMESTAMP WHERE purchase_id = $1',
        [id]
      )

      await client.query(
        'UPDATE purchases SET status = $1, deleted_at = CURRENT_TIMESTAMP WHERE purchase_id = $2',
        ['Cancelled', id]
      )

      if (purchaseToDelete.details && purchaseToDelete.details.length > 0) {
        for (const detail of purchaseToDelete.details) {
          const ingredientId = detail.ingredient_id
          const quantity = detail.quantity

          await client.query(
          `UPDATE Ingredients
           SET stock = GREATEST(0, Ingredients.stock - $1)
           WHERE ingredient_id = $2`,
          [quantity, ingredientId]
          )
        }
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

}
