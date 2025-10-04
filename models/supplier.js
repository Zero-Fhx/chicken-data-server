import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const SupplierModel = {
  async getAll ({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      const [supplierRows] = await pool.query('SELECT * FROM suppliers LIMIT ? OFFSET ?', [parseInt(limit), offset])
      const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM suppliers')
      return { data: supplierRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [supplierRows] = await pool.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id])
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
      const { name, ruc, phone, email, address, contact_person: contactPerson } = supplierData
      const [result] = await pool.query(
        'INSERT INTO suppliers (name, ruc, phone, email, address, contact_person) VALUES (?, ?, ?, ?, ?, ?)',
        [name, ruc, phone, email, address, contactPerson]
      )

      const [supplierRows] = await pool.query('SELECT * FROM suppliers WHERE supplier_id = ?', [result.insertId])
      return supplierRows[0]
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async update (id, supplierData) {
    try {
      const { name, ruc, phone, email, address, contact_person: contactPerson } = supplierData

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

      if (fields.length === 0) {
        throw new BadRequestError('No fields to update')
      }

      values.push(id)
      const [result] = await pool.query(
        `UPDATE suppliers SET ${fields.join(', ')} WHERE supplier_id = ?`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Supplier not found')
      }

      const [supplierRows] = await pool.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id])
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
      const [checkSupplierRows] = await pool.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id])
      if (checkSupplierRows.length === 0) {
        throw new NotFoundError('Supplier not found')
      }

      const supplierToDelete = checkSupplierRows[0]

      const [result] = await pool.query('DELETE FROM suppliers WHERE supplier_id = ?', [id])

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
