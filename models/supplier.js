import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const SupplierModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      
      const conditions = ['s.deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push('(s.name LIKE ? OR s.ruc LIKE ? OR s.email LIKE ?)')
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm, searchTerm)
      }

      if (filters.status) {
        conditions.push('s.status = ?')
        params.push(filters.status)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `SELECT COUNT(*) AS total FROM Suppliers s ${whereClause}`
      const [[{ total }]] = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT s.* FROM Suppliers s
        ${whereClause} 
        ORDER BY s.supplier_id DESC 
        LIMIT ? OFFSET ?
      `
      const [supplierRows] = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: supplierRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [supplierRows] = await pool.query(
        'SELECT * FROM Suppliers WHERE supplier_id = ? AND deleted_at IS NULL',
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
      const [result] = await pool.query(
        'INSERT INTO Suppliers (name, ruc, phone, email, address, contact_person, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, ruc, phone, email, address, contactPerson, status]
      )

      const [supplierRows] = await pool.query('SELECT * FROM Suppliers WHERE supplier_id = ?', [result.insertId])
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

      if (name !== undefined) {
        fields.push('name = ?')
        values.push(name)
      }
      if (ruc !== undefined) {
        fields.push('ruc = ?')
        values.push(ruc)
      }
      if (phone !== undefined) {
        fields.push('phone = ?')
        values.push(phone)
      }
      if (email !== undefined) {
        fields.push('email = ?')
        values.push(email)
      }
      if (address !== undefined) {
        fields.push('address = ?')
        values.push(address)
      }
      if (contactPerson !== undefined) {
        fields.push('contact_person = ?')
        values.push(contactPerson)
      }
      if (status !== undefined) {
        fields.push('status = ?')
        values.push(status)
      }

      if (fields.length === 0) {
        throw new BadRequestError('No fields to update')
      }

      values.push(id)
      const [result] = await pool.query(
        `UPDATE Suppliers SET ${fields.join(', ')} WHERE supplier_id = ? AND deleted_at IS NULL`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Supplier not found')
      }

      const [supplierRows] = await pool.query('SELECT * FROM Suppliers WHERE supplier_id = ?', [id])
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
      const [checkSupplierRows] = await pool.query(
        'SELECT * FROM Suppliers WHERE supplier_id = ? AND deleted_at IS NULL',
        [id]
      )
      if (checkSupplierRows.length === 0) {
        throw new NotFoundError('Supplier not found')
      }

      const supplierToDelete = checkSupplierRows[0]

      const [result] = await pool.query(
        'UPDATE Suppliers SET deleted_at = CURRENT_TIMESTAMP WHERE supplier_id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
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
