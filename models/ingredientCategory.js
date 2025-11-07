import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const IngredientCategoryModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['deleted_at IS NULL']
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
          f_normalize(name) ILIKE $${params.length + 1} OR
          f_normalize(description) ILIKE $${params.length + 2}
        )`)
        const searchTerm = `%${normalizedSearch}%`
        params.push(searchTerm, searchTerm)
      }
      if (filters.status) {
        conditions.push(`status = $${params.length + 1}`)
        params.push(filters.status)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `SELECT COUNT(*) AS total FROM ingredient_categories ${whereClause}`
      const { rows: [{ total }] } = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT * FROM ingredient_categories 
        ${whereClause} 
        ORDER BY category_id ASC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `
      const { rows: categoryRows } = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: categoryRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const { rows: categoryRows } = await pool.query(
        'SELECT * FROM ingredient_categories WHERE category_id = $1 AND deleted_at IS NULL',
        [id]
      )
      if (categoryRows.length === 0) {
        throw new NotFoundError('Ingredient category not found')
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

      const { rows: existing } = await pool.query(
        'SELECT * FROM ingredient_categories WHERE name = $1 AND deleted_at IS NULL',
        [name]
      )

      if (existing.length > 0) {
        throw new BadRequestError('A category with this name already exists')
      }

      const { rows: categoryRows } = await pool.query(
        'INSERT INTO ingredient_categories (name, description, status) VALUES ($1, $2, $3) RETURNING *',
        [name, description, status]
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

      let paramIndex = 1
      if (name !== undefined) {
        const { rows: existing } = await pool.query(
          'SELECT * FROM ingredient_categories WHERE name = $1 AND category_id != $2 AND deleted_at IS NULL',
          [name, id]
        )

        if (existing.length > 0) {
          throw new BadRequestError('A category with this name already exists')
        }

        fields.push(`name = $${paramIndex++}`)
        values.push(name)
      }
      if (description !== undefined) {
        fields.push(`description = $${paramIndex++}`)
        values.push(description)
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
        `UPDATE ingredient_categories SET ${fields.join(', ')} WHERE category_id = $${paramIndex} AND deleted_at IS NULL`,
        values
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Ingredient category not found')
      }

      const { rows: categoryRows } = await pool.query(
        'SELECT * FROM ingredient_categories WHERE category_id = $1',
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

      const { rows: checkCategoryRows } = await pool.query(
        'SELECT * FROM ingredient_categories WHERE category_id = $1 AND deleted_at IS NULL',
        [id]
      )
      if (checkCategoryRows.length === 0) {
        throw new NotFoundError('Ingredient category not found')
      }

      const { rows: [{ count }] } = await pool.query(
        'SELECT COUNT(*) as count FROM ingredients WHERE category_id = $1 AND deleted_at IS NULL',
        [id]
      )

      if (count > 0) {
        throw new BadRequestError(`Cannot delete category. ${count} ingredient(s) are using this category`)
      }

      const categoryToDelete = checkCategoryRows[0]

      const result = await pool.query(
        'UPDATE ingredient_categories SET deleted_at = CURRENT_TIMESTAMP WHERE category_id = $1',
        [id]
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Ingredient category not found')
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
