import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const DishModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['d.deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push(`(d.name LIKE $${params.length + 1} OR d.description LIKE $${params.length + 2})`)
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      if (filters.categoryId) {
        conditions.push(`d.category_id = $${params.length + 1}`)
        params.push(filters.categoryId)
      }

      if (filters.minPrice !== undefined) {
        conditions.push(`d.price >= $${params.length + 1}`)
        params.push(filters.minPrice)
      }

      if (filters.maxPrice !== undefined) {
        conditions.push(`d.price <= $${params.length + 1}`)
        params.push(filters.maxPrice)
      }

      if (filters.status) {
        conditions.push(`d.status = $${params.length + 1}`)
        params.push(filters.status)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM dishes d 
        LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
        ${whereClause}
      `
      const { rows: [{ total }] } = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT d.*, dc.name as category_name 
        FROM dishes d 
        LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
        ${whereClause} 
        ORDER BY d.dish_id DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `
      const { rows: dishRows } = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: dishRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const { rows: dishRows } = await pool.query(
        `SELECT d.*, dc.name as category_name 
         FROM dishes d 
         LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
         WHERE d.dish_id = $1 AND d.deleted_at IS NULL`,
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
      const { rows: [dish] } = await pool.query(
        'INSERT INTO dishes (name, description, category_id, price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, categoryId, price, status]
      )

      const { rows: dishRows } = await pool.query(
        `SELECT d.*, dc.name as category_name 
         FROM dishes d 
         LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
         WHERE d.dish_id = $1`,
        [dish.dish_id]
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

      let paramIndex = 1
      if (name !== undefined) {
        fields.push(`name = $${paramIndex++}`)
        values.push(name)
      }
      if (description !== undefined) {
        fields.push(`description = $${paramIndex++}`)
        values.push(description)
      }
      if (categoryId !== undefined) {
        fields.push(`category_id = $${paramIndex++}`)
        values.push(categoryId)
      }
      if (price !== undefined) {
        fields.push(`price = $${paramIndex++}`)
        values.push(price)
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
        `UPDATE dishes SET ${fields.join(', ')} WHERE dish_id = $${paramIndex} AND deleted_at IS NULL`,
        values
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Dish not found')
      }

      const { rows: dishRows } = await pool.query(
        `SELECT d.*, dc.name as category_name 
         FROM dishes d 
         LEFT JOIN dish_categories dc ON d.category_id = dc.category_id
         WHERE d.dish_id = $1`,
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
      const { rows: checkDishRows } = await pool.query(
        'SELECT * FROM dishes WHERE dish_id = $1 AND deleted_at IS NULL',
        [id]
      )
      if (checkDishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      const dishToDelete = checkDishRows[0]

      const result = await pool.query(
        'UPDATE dishes SET deleted_at = CURRENT_TIMESTAMP WHERE dish_id = $1',
        [id]
      )

      if (result.rowCount === 0) {
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
