import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const PurchaseModel = {
  async getAll ({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      const [purchaseRows] = await pool.query(`
        SELECT 
          p.*,
          s.name as supplier_name 
        FROM purchases p 
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        ORDER BY p.purchase_date DESC, p.purchase_id DESC
        LIMIT ? OFFSET ?
      `, [parseInt(limit), offset])

      for (const purchase of purchaseRows) {
        const [detailRows] = await pool.query(`
          SELECT 
            pd.*,
            i.name as ingredient_name,
            i.unit as ingredient_unit
          FROM purchase_details pd
          LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
          WHERE pd.purchase_id = ?
          ORDER BY pd.purchase_detail_id
        `, [purchase.purchase_id])
        purchase.details = detailRows
      }

      const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM purchases')
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
          s.name as supplier_name 
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
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM purchase_details pd
        LEFT JOIN ingredients i ON pd.ingredient_id = i.ingredient_id
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

      const calculatedTotal = details.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) * parseFloat(detail.unit_price))
      }, 0)

      const [purchaseResult] = await connection.query(
        'INSERT INTO purchases (supplier_id, purchase_date, notes, total) VALUES (?, ?, ?, ?)',
        [supplierId, purchaseDate, notes, calculatedTotal.toFixed(2)]
      )

      const purchaseId = purchaseResult.insertId

      for (const detail of details) {
        const { ingredient_id: ingredientId, quantity, unit_price: unitPrice } = detail
        const subtotal = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2)

        await connection.query(
          'INSERT INTO purchase_details (purchase_id, ingredient_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [purchaseId, ingredientId, quantity, unitPrice, subtotal]
        )

        await connection.query(
          'UPDATE ingredients SET stock = stock + ? WHERE ingredient_id = ?',
          [quantity, ingredientId]
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

      for (const detail of originalPurchase.details) {
        await connection.query(
          'UPDATE ingredients SET stock = stock - ? WHERE ingredient_id = ?',
          [detail.quantity, detail.ingredient_id]
        )
      }

      await connection.query('DELETE FROM purchase_details WHERE purchase_id = ?', [id])

      const calculatedTotal = details.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) * parseFloat(detail.unit_price))
      }, 0)

      await connection.query(
        'UPDATE purchases SET supplier_id = ?, purchase_date = ?, notes = ?, total = ? WHERE purchase_id = ?',
        [supplierId, purchaseDate, notes, calculatedTotal.toFixed(2), id]
      )

      for (const detail of details) {
        const { ingredient_id: ingredientId, quantity, unit_price: unitPrice } = detail
        const subtotal = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2)

        await connection.query(
          'INSERT INTO purchase_details (purchase_id, ingredient_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [id, ingredientId, quantity, unitPrice, subtotal]
        )

        await connection.query(
          'UPDATE ingredients SET stock = stock + ? WHERE ingredient_id = ?',
          [quantity, ingredientId]
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

      for (const detail of purchaseToDelete.details) {
        await connection.query(
          'UPDATE ingredients SET stock = stock - ? WHERE ingredient_id = ?',
          [detail.quantity, detail.ingredient_id]
        )
      }

      await connection.query('DELETE FROM purchase_details WHERE purchase_id = ?', [id])
      await connection.query('DELETE FROM purchases WHERE purchase_id = ?', [id])

      await connection.commit()

      return purchaseToDelete
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
