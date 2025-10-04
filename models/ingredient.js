import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const IngredientModel = {
  async getAll ({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit)
      const [ingredientRows] = await pool.query('SELECT * FROM ingredients LIMIT ? OFFSET ?', [parseInt(limit), offset])
      const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM ingredients')
      return { data: ingredientRows, total }
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async getById (id) {
    try {
      const [ingredientRows] = await pool.query('SELECT * FROM ingredients WHERE ingredient_id = ?', [id])
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
      const { name, unit, category, status = 'Active', stock = 0, minimum_stock: minimumStock = 0 } = ingredientData
      const [result] = await pool.query(

        'INSERT INTO ingredients (name, unit, category, status, stock, minimum_stock) VALUES (?, ?, ?, ?, ?, ?)',
        [name, unit, category, status, stock, minimumStock]
      )

      const [ingredientRows] = await pool.query('SELECT * FROM ingredients WHERE ingredient_id = ?', [result.insertId])
      return ingredientRows[0]
    } catch (error) {
      throw new InternalServerError(error.message)
    }
  },

  async update (id, ingredientData) {
    try {
      const { name, unit, category, status, stock, minimum_stock: minimumStock } = ingredientData

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
      if (category !== undefined) {
        fields.push('category = ?')
        values.push(category)
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
        `UPDATE ingredients SET ${fields.join(', ')} WHERE ingredient_id = ?`,
        values
      )

      if (result.affectedRows === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const [ingredientRows] = await pool.query('SELECT * FROM ingredients WHERE ingredient_id = ?', [id])
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
      const [checkIngredientRows] = await pool.query('SELECT * FROM ingredients WHERE ingredient_id = ?', [id])
      if (checkIngredientRows.length === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const ingredientToDelete = checkIngredientRows[0]

      const [result] = await pool.query('DELETE FROM ingredients WHERE ingredient_id = ?', [id])

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
