import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const DishIngredientModel = {
  async getByDishId (dishId) {
    try {
      const { rows: dishRows } = await pool.query(
        'SELECT dish_id FROM dishes WHERE dish_id = $1 AND deleted_at IS NULL',
        [dishId]
      )

      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      const { rows } = await pool.query(`
        SELECT 
          di.dish_ingredient_id,
          di.dish_id,
          di.ingredient_id,
          di.quantity_used,
          i.name as ingredient_name,
          i.unit as ingredient_unit,
          i.stock as ingredient_stock,
          i.status as ingredient_status,
          ic.category_id as ingredient_category_id,
          ic.name as ingredient_category_name
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        LEFT JOIN ingredient_categories ic ON i.category_id = ic.category_id
        WHERE di.dish_id = $1
        ORDER BY di.dish_ingredient_id
      `, [dishId])

      return rows
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async addIngredient (dishId, ingredientData) {
    try {
      const { ingredientId, quantityUsed } = ingredientData

      const { rows: dishRows } = await pool.query(
        'SELECT dish_id FROM dishes WHERE dish_id = $1 AND deleted_at IS NULL',
        [dishId]
      )

      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      const { rows: ingredientRows } = await pool.query(
        'SELECT ingredient_id FROM ingredients WHERE ingredient_id = $1 AND deleted_at IS NULL',
        [ingredientId]
      )

      if (ingredientRows.length === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      const { rows: existingRows } = await pool.query(
        'SELECT * FROM dish_ingredients WHERE dish_id = $1 AND ingredient_id = $2',
        [dishId, ingredientId]
      )

      if (existingRows.length > 0) {
        throw new BadRequestError('This ingredient is already in the dish recipe')
      }

      const { rows: [dishIngredient] } = await pool.query(
        'INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_used) VALUES ($1, $2, $3) RETURNING *',
        [dishId, ingredientId, quantityUsed]
      )

      const { rows: newRows } = await pool.query(`
        SELECT 
          di.dish_ingredient_id,
          di.dish_id,
          di.ingredient_id,
          di.quantity_used,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_ingredient_id = $1
      `, [dishIngredient.dish_ingredient_id])

      return newRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async updateQuantity (dishId, ingredientId, quantityUsed) {
    try {
      const { rows: existingRows } = await pool.query(
        'SELECT * FROM dish_ingredients WHERE dish_id = $1 AND ingredient_id = $2',
        [dishId, ingredientId]
      )

      if (existingRows.length === 0) {
        throw new NotFoundError('Ingredient not found in dish recipe')
      }

      await pool.query(
        'UPDATE dish_ingredients SET quantity_used = $1 WHERE dish_id = $2 AND ingredient_id = $3',
        [quantityUsed, dishId, ingredientId]
      )

      const { rows: updatedRows } = await pool.query(`
        SELECT 
          di.dish_ingredient_id,
          di.dish_id,
          di.ingredient_id,
          di.quantity_used,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_id = $1 AND di.ingredient_id = $2
      `, [dishId, ingredientId])

      return updatedRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async removeIngredient (dishId, ingredientId) {
    try {
      const { rows: existingRows } = await pool.query(`
        SELECT 
          di.*,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_id = $1 AND di.ingredient_id = $2
      `, [dishId, ingredientId])

      if (existingRows.length === 0) {
        throw new NotFoundError('Ingredient not found in dish recipe')
      }

      const deletedRecord = existingRows[0]

      await pool.query(
        'DELETE FROM dish_ingredients WHERE dish_id = $1 AND ingredient_id = $2',
        [dishId, ingredientId]
      )

      return deletedRecord
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  async replaceAllIngredients (dishId, ingredients) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const { rows: dishRows } = await client.query(
        'SELECT dish_id FROM dishes WHERE dish_id = $1 AND deleted_at IS NULL',
        [dishId]
      )

      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      await client.query('DELETE FROM dish_ingredients WHERE dish_id = $1', [dishId])

      if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          const { ingredientId, quantityUsed } = ingredient

          const { rows: ingredientRows } = await client.query(
            'SELECT ingredient_id FROM ingredients WHERE ingredient_id = $1 AND deleted_at IS NULL',
            [ingredientId]
          )

          if (ingredientRows.length === 0) {
            throw new NotFoundError(`Ingredient with id ${ingredientId} not found`)
          }

          await client.query(
            'INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_used) VALUES ($1, $2, $3)',
            [dishId, ingredientId, quantityUsed]
          )
        }
      }

      await client.query('COMMIT')

      return await this.getByDishId(dishId)
    } catch (error) {
      await client.query('ROLLBACK')
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      client.release()
    }
  }
}
