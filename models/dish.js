import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const DishModel = {
  async getAll ({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      const [dishRows] = await pool.query(
        'SELECT * FROM dishes LIMIT ? OFFSET ?',
        [parseInt(limit), offset]
      )
      const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM dishes')
      return { data: dishRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [dishRows] = await pool.query('SELECT * FROM dishes WHERE dish_id = ?', [id])
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
      const { name, description, category, price, status = 'Active' } = dishData
      const [result] = await pool.query(
        'INSERT INTO dishes (name, description, category, price, status) VALUES (?, ?, ?, ?, ?)',
        [name, description, category, price, status]
      )

      const [dishRows] = await pool.query('SELECT * FROM dishes WHERE dish_id = ?', [result.insertId])
      return dishRows[0]
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async update (id, dishData) {
    try {
      const { name, description, category, price, status } = dishData

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
      if (category !== undefined) {
        fields.push('category = ?')
        values.push(category)
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
        `UPDATE dishes SET ${fields.join(', ')} WHERE dish_id = ?`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Dish not found')
      }

      const [dishRows] = await pool.query('SELECT * FROM dishes WHERE dish_id = ?', [id])
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
      const [checkDishRows] = await pool.query('SELECT * FROM dishes WHERE dish_id = ?', [id])
      if (checkDishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      const dishToDelete = checkDishRows[0]

      const [result] = await pool.query('DELETE FROM dishes WHERE dish_id = ?', [id])

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
