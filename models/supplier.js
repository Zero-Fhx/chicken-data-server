import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const SupplierModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['s.deleted_at IS NULL']
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
          f_normalize(s.name) ILIKE $${params.length + 1} OR
          f_normalize(s.email) ILIKE $${params.length + 2} OR
          f_normalize(s.contact_person) ILIKE $${params.length + 3}
        )`)
        const searchTerm = `%${normalizedSearch}%`
        params.push(searchTerm, searchTerm, searchTerm)
      }
      if (filters.status) {
        conditions.push(`s.status = $${params.length + 1}`)
        params.push(filters.status)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `SELECT COUNT(*) AS total FROM suppliers s ${whereClause}`
      const { rows: [{ total }] } = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT s.* FROM suppliers s
        ${whereClause} 
        ORDER BY s.supplier_id DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `
      const { rows: supplierRows } = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: supplierRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const { rows: supplierRows } = await pool.query(
        'SELECT * FROM suppliers WHERE supplier_id = $1 AND deleted_at IS NULL',
        [id]
      )
      if (supplierRows.length === 0) {
        throw new NotFoundError('Supplier not found')
      }
      return supplierRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (supplierData) {
    try {
      const { name, ruc, phone, email, address, contactPerson, status = 'Active' } = supplierData
      const { rows: supplierRows } = await pool.query(
        'INSERT INTO suppliers (name, ruc, phone, email, address, contact_person, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, ruc, phone, email, address, contactPerson, status]
      )
      return supplierRows[0]
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async update (id, supplierData) {
    try {
      const { name, ruc, phone, email, address, contactPerson, status } = supplierData

      const fields = []
      const values = []

      let paramIndex = 1
      if (name !== undefined) {
        fields.push(`name = $${paramIndex++}`)
        values.push(name)
      }
      if (ruc !== undefined) {
        fields.push(`ruc = $${paramIndex++}`)
        values.push(ruc)
      }
      if (phone !== undefined) {
        fields.push(`phone = $${paramIndex++}`)
        values.push(phone)
      }
      if (email !== undefined) {
        fields.push(`email = $${paramIndex++}`)
        values.push(email)
      }
      if (address !== undefined) {
        fields.push(`address = $${paramIndex++}`)
        values.push(address)
      }
      if (contactPerson !== undefined) {
        fields.push(`contact_person = $${paramIndex++}`)
        values.push(contactPerson)
      }
      if (status !== undefined) {
        fields.push(`status = $${paramIndex++}`)
        values.push(status)
      }

      if (fields.length === 0) {
        throw new BadRequestError('No fields to update')
      }

      values.push(id)
      const result = await pool.query(
        `UPDATE suppliers SET ${fields.join(', ')} WHERE supplier_id = $${paramIndex} AND deleted_at IS NULL`,
        values
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Supplier not found')
      }

      const { rows: supplierRows } = await pool.query('SELECT * FROM suppliers WHERE supplier_id = $1', [id])
      return supplierRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async delete (id) {
    try {
      const { rows: checkSupplierRows } = await pool.query(
        'SELECT * FROM suppliers WHERE supplier_id = $1 AND deleted_at IS NULL',
        [id]
      )
      if (checkSupplierRows.length === 0) {
        throw new NotFoundError('Supplier not found')
      }

      const supplierToDelete = checkSupplierRows[0]

      const result = await pool.query(
        'UPDATE suppliers SET deleted_at = CURRENT_TIMESTAMP WHERE supplier_id = $1',
        [id]
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Supplier not found')
      }

      return supplierToDelete
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  }
}
