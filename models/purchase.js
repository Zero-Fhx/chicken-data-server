import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const PurchaseModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['p.deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push('(p.notes LIKE ? OR s.name LIKE ?)')
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      if (filters.status) {
        conditions.push('p.status = ?')
        params.push(filters.status)
      }

      if (filters.supplierId) {
        conditions.push('p.supplier_id = ?')
        params.push(filters.supplierId)
      }

      if (filters.startDate) {
        conditions.push('p.purchase_date >= ?')
        params.push(filters.startDate)
      }

      if (filters.endDate) {
        conditions.push('p.purchase_date <= ?')
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
          s.updated_at as supplier_updated_at
        FROM purchases p 
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        ${whereClause}
        ORDER BY p.purchase_date DESC, p.purchase_id DESC 
        LIMIT ? OFFSET ?
      `
      params.push(parseInt(limit), offset)

      const [purchaseRows] = await pool.query(query, params)

      for (const purchase of purchaseRows) {
        const [detailRows] = await pool.query(`
          SELECT 
            pd.*,
            i.ingredient_id,
            i.name as ingredient_name,
            i.unit as ingredient_unit,
            i.status as ingredient_status,
            i.stock as ingredient_stock,
            i.minimum_stock as ingredient_minimum_stock,
            i.created_at as ingredient_created_at,
            i.updated_at as ingredient_updated_at,
            ic.category_id as ingredient_category_id,
            ic.name as ingredient_category_name
          FROM purchase_details pd
          LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
          LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
          WHERE pd.purchase_id = ?
          ORDER BY pd.purchase_detail_id
        `, [purchase.purchase_id])
        purchase.details = detailRows
      }

      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM purchases p 
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        ${whereClause}
      `

      const [[{ total }]] = await pool.query(countQuery, params.slice(0, -2))
      return { data: purchaseRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [purchaseRows] = await pool.query(`
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
          s.updated_at as supplier_updated_at
        FROM purchases p 
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        WHERE p.purchase_id = ?
      `, [id])

      if (purchaseRows.length === 0) {
        throw new NotFoundError('Purchase not found')
      }

      const purchase = purchaseRows[0]

      const [detailRows] = await pool.query(`
        SELECT 
          pd.*,
          i.ingredient_id,
          i.name as ingredient_name,
          i.unit as ingredient_unit,
          i.status as ingredient_status,
          i.stock as ingredient_stock,
          i.minimum_stock as ingredient_minimum_stock,
          i.created_at as ingredient_created_at,
          i.updated_at as ingredient_updated_at,
          ic.category_id as ingredient_category_id,
          ic.name as ingredient_category_name
        FROM purchase_details pd
        LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
        LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
        WHERE pd.purchase_id = ?
        ORDER BY pd.purchase_detail_id
      `, [id])

      purchase.details = detailRows

      return purchase
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (purchaseData) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const { supplier_id: supplierId, purchase_date: purchaseDate, notes, details } = purchaseData

      if (!details || !Array.isArray(details) || details.length === 0) {
        throw new BadRequestError('Purchase must have at least one detail item')
      }

      // No calculamos el total manualmente, el trigger lo hará automáticamente
      const [purchaseResult] = await connection.query(
        'INSERT INTO purchases (supplier_id, purchase_date, notes) VALUES (?, ?, ?)',
        [supplierId, purchaseDate, notes]
      )

      const purchaseId = purchaseResult.insertId

      // Los triggers calcularán el subtotal, actualizarán el total de la compra y el stock automáticamente
      for (const detail of details) {
        const { ingredient_id: ingredientId, quantity, unit_price: unitPrice } = detail

        await connection.query(
          'INSERT INTO purchase_details (purchase_id, ingredient_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [purchaseId, ingredientId, quantity, unitPrice]
        )
      }

      await connection.commit()

      return await this.getById(purchaseId)
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

  async update (id, purchaseData) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const originalPurchase = await this.getById(id)
      if (!originalPurchase) {
        throw new NotFoundError('Purchase not found')
      }

      const { supplier_id: supplierId, purchase_date: purchaseDate, notes, details } = purchaseData

      // Eliminamos los detalles antiguos (los triggers revertirán el stock y el total automáticamente)
      await connection.query('DELETE FROM purchase_details WHERE purchase_id = ?', [id])

      // Actualizamos la compra (sin calcular el total manualmente)
      await connection.query(
        'UPDATE purchases SET supplier_id = ?, purchase_date = ?, notes = ? WHERE purchase_id = ?',
        [supplierId, purchaseDate, notes, id]
      )

      // Insertamos los nuevos detalles (los triggers calcularán subtotal, actualizarán total y stock)
      for (const detail of details) {
        const { ingredient_id: ingredientId, quantity, unit_price: unitPrice } = detail

        await connection.query(
          'INSERT INTO purchase_details (purchase_id, ingredient_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [id, ingredientId, quantity, unitPrice]
        )
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

      const purchaseToDelete = await this.getById(id)
      if (!purchaseToDelete) {
        throw new NotFoundError('Purchase not found')
      }

      if (purchaseToDelete.deleted_at !== null) {
        throw new BadRequestError('Purchase is already cancelled')
      }

      // Eliminamos los detalles (los triggers revertirán el stock automáticamente)
      await connection.query('DELETE FROM purchase_details WHERE purchase_id = ?', [id])

      // Marcamos la compra como eliminada (soft delete)
      await connection.query(
        'UPDATE purchases SET status = ?, deleted_at = CURRENT_TIMESTAMP WHERE purchase_id = ?',
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

  async getDetailsByPurchaseId (purchaseId, { page = 1, limit = 10 } = {}) {
    try {
      const [purchaseRows] = await pool.query(
        'SELECT purchase_id FROM purchases WHERE purchase_id = ?',
        [purchaseId]
      )

      if (purchaseRows.length === 0) {
        throw new NotFoundError('Purchase not found')
      }

      const offset = (parseInt(page) - 1) * parseInt(limit)
      const [detailRows] = await pool.query(`
        SELECT 
          pd.*,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM purchase_details pd
        LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
        WHERE pd.purchase_id = ?
        ORDER BY pd.purchase_detail_id
        LIMIT ? OFFSET ?
      `, [purchaseId, parseInt(limit), offset])

      const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) AS total FROM purchase_details WHERE purchase_id = ?',
        [purchaseId]
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
