import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const IngredientModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)

      const conditions = ['i.deleted_at IS NULL']
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
          f_normalize(i.name) ILIKE $${params.length + 1}
        )`)
        const searchTerm = `%${normalizedSearch}%`
        params.push(searchTerm)
      }
      if (filters.categoryId) {
        conditions.push(`i.category_id = $${params.length + 1}`)
        params.push(filters.categoryId)
      }

      if (filters.status) {
        conditions.push(`i.status = $${params.length + 1}`)
        params.push(filters.status)
      }

      if (filters.lowStock === 'true') {
        conditions.push('i.stock <= i.minimum_stock')
      }

      if (filters.minStock !== undefined) {
        conditions.push(`i.stock >= $${params.length + 1}`)
        params.push(filters.minStock)
      }

      if (filters.maxStock !== undefined) {
        conditions.push(`i.stock <= $${params.length + 1}`)
        params.push(filters.maxStock)
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM ingredients i 
        LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
        ${whereClause}
      `
      const { rows: [{ total }] } = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT i.*, ic.name as category_name 
        FROM ingredients i 
        LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
        ${whereClause} 
        ORDER BY i.ingredient_id DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `
      const { rows: ingredientRows } = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: ingredientRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const { rows: ingredientRows } = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM ingredients i 
         LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
         WHERE i.ingredient_id = $1 AND i.deleted_at IS NULL`,
        [id]
      )
      if (ingredientRows.length === 0) {
        throw new NotFoundError('Ingredient not found')
      }
      return ingredientRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async create (ingredientData) {
    try {
      const { name, unit, categoryId = 1, status = 'Active', stock = 0, minimumStock = 0 } = ingredientData
      const { rows: [ingredient] } = await pool.query(
        'INSERT INTO ingredients (name, unit, category_id, status, stock, minimum_stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, unit, categoryId, status, stock, minimumStock]
      )

      const { rows: ingredientRows } = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM ingredients i 
         LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
         WHERE i.ingredient_id = $1`,
        [ingredient.ingredient_id]
      )
      return ingredientRows[0]
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async update (id, ingredientData) {
    try {
      const { name, unit, categoryId, status, stock, minimumStock } = ingredientData

      const fields = []
      const values = []

      let paramIndex = 1
      if (name !== undefined) {
        fields.push(`name = $${paramIndex++}`)
        values.push(name)
      }
      if (unit !== undefined) {
        fields.push(`unit = $${paramIndex++}`)
        values.push(unit)
      }
      if (categoryId !== undefined) {
        fields.push(`category_id = $${paramIndex++}`)
        values.push(categoryId)
      }
      if (status !== undefined) {
        fields.push(`status = $${paramIndex++}`)
        values.push(status)
      }
      if (stock !== undefined) {
        fields.push(`stock = $${paramIndex++}`)
        values.push(stock)
      }
      if (minimumStock !== undefined) {
        fields.push(`minimum_stock = $${paramIndex++}`)
        values.push(minimumStock)
      }

      if (fields.length === 0) {
        throw new BadRequestError('No fields to update')
      }

      values.push(id)
      const result = await pool.query(
        `UPDATE ingredients SET ${fields.join(', ')} WHERE ingredient_id = $${paramIndex} AND deleted_at IS NULL`,
        values
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const { rows: ingredientRows } = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM ingredients i 
         LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
         WHERE i.ingredient_id = $1`,
        [id]
      )
      return ingredientRows[0]
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async delete (id) {
    try {
      const { rows: checkIngredientRows } = await pool.query(
        'SELECT * FROM ingredients WHERE ingredient_id = $1 AND deleted_at IS NULL',
        [id]
      )
      if (checkIngredientRows.length === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const ingredientToDelete = checkIngredientRows[0]

      const result = await pool.query(
        'UPDATE ingredients SET deleted_at = CURRENT_TIMESTAMP WHERE ingredient_id = $1',
        [id]
      )

      if (result.rowCount === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      return ingredientToDelete
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  }
}
