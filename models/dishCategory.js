import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const DishCategoryModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      
      const conditions = ['deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push('(name LIKE ? OR description LIKE ?)')
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      if (filters.status) {
        conditions.push('status = ?')
        params.push(filters.status)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `SELECT COUNT(*) AS total FROM Dish_Categories ${whereClause}`
      const [[{ total }]] = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT * FROM Dish_Categories 
        ${whereClause} 
        ORDER BY category_id ASC 
        LIMIT ? OFFSET ?
      `
      const [categoryRows] = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: categoryRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [categoryRows] = await pool.query(
        'SELECT * FROM Dish_Categories WHERE category_id = ? AND deleted_at IS NULL',
        [id]
      )
      if (categoryRows.length === 0) {
        throw new NotFoundError('Dish category not found')
      }
      return categoryRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (categoryData) {
    try {
      const { name, description, status = 'Active' } = categoryData
      
      const [existing] = await pool.query(
        'SELECT * FROM Dish_Categories WHERE name = ? AND deleted_at IS NULL',
        [name]
      )
      
      if (existing.length > 0) {
        throw new BadRequestError('A category with this name already exists')
      }

      const [result] = await pool.query(
        'INSERT INTO Dish_Categories (name, description, status) VALUES (?, ?, ?)',
        [name, description, status]
      )

      const [categoryRows] = await pool.query(
        'SELECT * FROM Dish_Categories WHERE category_id = ?',
        [result.insertId]
      )
      return categoryRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async update (id, categoryData) {
    try {
      const { name, description, status } = categoryData

      if (parseInt(id) === 1) {
        throw new BadRequestError('Cannot modify the General category')
      }

      const fields = []
      const values = []

      if (name !== undefined) {
        const [existing] = await pool.query(
          'SELECT * FROM Dish_Categories WHERE name = ? AND category_id != ? AND deleted_at IS NULL',
          [name, id]
        )
        
        if (existing.length > 0) {
          throw new BadRequestError('A category with this name already exists')
        }
        
        fields.push('name = ?')
        values.push(name)
      }
      if (description !== undefined) {
        fields.push('description = ?')
        values.push(description)
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
        `UPDATE Dish_Categories SET ${fields.join(', ')} WHERE category_id = ? AND deleted_at IS NULL`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Dish category not found')
      }

      const [categoryRows] = await pool.query(
        'SELECT * FROM Dish_Categories WHERE category_id = ?',
        [id]
      )
      return categoryRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async delete (id) {
    try {
      if (parseInt(id) === 1) {
        throw new BadRequestError('Cannot delete the General category')
      }

      const [checkCategoryRows] = await pool.query(
        'SELECT * FROM Dish_Categories WHERE category_id = ? AND deleted_at IS NULL',
        [id]
      )
      if (checkCategoryRows.length === 0) {
        throw new NotFoundError('Dish category not found')
      }

      const [[{ count }]] = await pool.query(
        'SELECT COUNT(*) as count FROM Dishes WHERE category_id = ? AND deleted_at IS NULL',
        [id]
      )

      if (count > 0) {
        throw new BadRequestError(`Cannot delete category. ${count} dish(es) are using this category`)
      }

      const categoryToDelete = checkCategoryRows[0]

      const [result] = await pool.query(
        'UPDATE Dish_Categories SET deleted_at = CURRENT_TIMESTAMP WHERE category_id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Dish category not found')
      }

      return categoryToDelete
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  }
}
