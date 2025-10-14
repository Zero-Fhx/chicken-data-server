import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const DishModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['d.deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push('(d.name LIKE ? OR d.description LIKE ?)')
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      if (filters.categoryId) {
        conditions.push('d.category_id = ?')
        params.push(filters.categoryId)
      }

      if (filters.minPrice !== undefined) {
        conditions.push('d.price >= ?')
        params.push(filters.minPrice)
      }

      if (filters.maxPrice !== undefined) {
        conditions.push('d.price <= ?')
        params.push(filters.maxPrice)
      }

      if (filters.status) {
        conditions.push('d.status = ?')
        params.push(filters.status)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM Dishes d 
        LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
        ${whereClause}
      `
      const [[{ total }]] = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT d.*, dc.name as category_name 
        FROM Dishes d 
        LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
        ${whereClause} 
        ORDER BY d.dish_id DESC 
        LIMIT ? OFFSET ?
      `
      const [dishRows] = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: dishRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [dishRows] = await pool.query(
        `SELECT d.*, dc.name as category_name 
         FROM Dishes d 
         LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
         WHERE d.dish_id = ? AND d.deleted_at IS NULL`,
        [id]
      )
      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }
      return dishRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (dishData) {
    try {
      const { name, description, categoryId = 1, price, status = 'Active' } = dishData
      const [result] = await pool.query(
        'INSERT INTO Dishes (name, description, category_id, price, status) VALUES (?, ?, ?, ?, ?)',
        [name, description, categoryId, price, status]
      )

      const [dishRows] = await pool.query(
        `SELECT d.*, dc.name as category_name 
         FROM Dishes d 
         LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
         WHERE d.dish_id = ?`,
        [result.insertId]
      )
      return dishRows[0]
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async update (id, dishData) {
    try {
      const { name, description, categoryId, price, status } = dishData

      const fields = []
      const values = []

      if (name !== undefined) {
        fields.push('name = ?')
        values.push(name)
      }
      if (description !== undefined) {
        fields.push('description = ?')
        values.push(description)
      }
      if (categoryId !== undefined) {
        fields.push('category_id = ?')
        values.push(categoryId)
      }
      if (price !== undefined) {
        fields.push('price = ?')
        values.push(price)
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
        `UPDATE Dishes SET ${fields.join(', ')} WHERE dish_id = ? AND deleted_at IS NULL`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Dish not found')
      }

      const [dishRows] = await pool.query(
        `SELECT d.*, dc.name as category_name 
         FROM Dishes d 
         LEFT JOIN Dish_Categories dc ON d.category_id = dc.category_id
         WHERE d.dish_id = ?`,
        [id]
      )
      return dishRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async delete (id) {
    try {
      const [checkDishRows] = await pool.query(
        'SELECT * FROM Dishes WHERE dish_id = ? AND deleted_at IS NULL',
        [id]
      )
      if (checkDishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      const dishToDelete = checkDishRows[0]

      const [result] = await pool.query(
        'UPDATE Dishes SET deleted_at = CURRENT_TIMESTAMP WHERE dish_id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Dish not found')
      }

      return dishToDelete
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  }
}
