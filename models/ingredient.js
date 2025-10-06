import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const IngredientModel = {
  async getAll ({ page = 1, limit = 10, filters = {} } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      
      const conditions = ['i.deleted_at IS NULL']
      const params = []

      if (filters.search) {
        conditions.push('(i.name LIKE ?)')
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm)
      }

      if (filters.categoryId) {
        conditions.push('i.category_id = ?')
        params.push(filters.categoryId)
      }

      if (filters.status) {
        conditions.push('i.status = ?')
        params.push(filters.status)
      }

      if (filters.lowStock === 'true') {
        conditions.push('i.stock <= i.minimum_stock')
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`

      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM Ingredients i 
        LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
        ${whereClause}
      `
      const [[{ total }]] = await pool.query(countQuery, params)

      const dataQuery = `
        SELECT i.*, ic.name as category_name 
        FROM Ingredients i 
        LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
        ${whereClause} 
        ORDER BY i.ingredient_id DESC 
        LIMIT ? OFFSET ?
      `
      const [ingredientRows] = await pool.query(dataQuery, [...params, parseInt(limit), offset])

      return { data: ingredientRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [ingredientRows] = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM Ingredients i 
         LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
         WHERE i.ingredient_id = ? AND i.deleted_at IS NULL`,
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
      const [result] = await pool.query(
        'INSERT INTO Ingredients (name, unit, category_id, status, stock, minimum_stock) VALUES (?, ?, ?, ?, ?, ?)',
        [name, unit, categoryId, status, stock, minimumStock]
      )

      const [ingredientRows] = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM Ingredients i 
         LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
         WHERE i.ingredient_id = ?`,
        [result.insertId]
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

      if (name !== undefined) {
        fields.push('name = ?')
        values.push(name)
      }
      if (unit !== undefined) {
        fields.push('unit = ?')
        values.push(unit)
      }
      if (categoryId !== undefined) {
        fields.push('category_id = ?')
        values.push(categoryId)
      }
      if (status !== undefined) {
        fields.push('status = ?')
        values.push(status)
      }
      if (stock !== undefined) {
        fields.push('stock = ?')
        values.push(stock)
      }
      if (minimumStock !== undefined) {
        fields.push('minimum_stock = ?')
        values.push(minimumStock)
      }

      if (fields.length === 0) {
        throw new BadRequestError('No fields to update')
      }

      values.push(id)
      const [result] = await pool.query(
        `UPDATE Ingredients SET ${fields.join(', ')} WHERE ingredient_id = ? AND deleted_at IS NULL`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const [ingredientRows] = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM Ingredients i 
         LEFT JOIN Ingredient_Categories ic ON i.category_id = ic.category_id
         WHERE i.ingredient_id = ?`,
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
      const [checkIngredientRows] = await pool.query(
        'SELECT * FROM Ingredients WHERE ingredient_id = ? AND deleted_at IS NULL',
        [id]
      )
      if (checkIngredientRows.length === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const ingredientToDelete = checkIngredientRows[0]

      const [result] = await pool.query(
        'UPDATE Ingredients SET deleted_at = CURRENT_TIMESTAMP WHERE ingredient_id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
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
