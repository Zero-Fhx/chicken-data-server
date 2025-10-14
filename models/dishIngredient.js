import pool from '../config/database.js'
import { BadRequestError, InternalServerError, NotFoundError, isCustomUserError } from '../utils/errors.js'

export const DishIngredientModel = {
  /**
   * Obtiene todos los ingredientes (receta) de un plato
   */
  async getByDishId (dishId) {
    try {
      // Verificar que el plato existe
      const [dishRows] = await pool.query(
        'SELECT dish_id FROM dishes WHERE dish_id = ? AND deleted_at IS NULL',
        [dishId]
      )

      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      // Obtener ingredientes del plato
      const [rows] = await pool.query(`
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
        WHERE di.dish_id = ?
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

  /**
   * Agrega un ingrediente a la receta de un plato
   */
  async addIngredient (dishId, ingredientData) {
    try {
      const { ingredient_id: ingredientId, quantity_used: quantityUsed } = ingredientData

      // Verificar que el plato existe
      const [dishRows] = await pool.query(
        'SELECT dish_id FROM dishes WHERE dish_id = ? AND deleted_at IS NULL',
        [dishId]
      )

      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      // Verificar que el ingrediente existe
      const [ingredientRows] = await pool.query(
        'SELECT ingredient_id FROM ingredients WHERE ingredient_id = ? AND deleted_at IS NULL',
        [ingredientId]
      )

      if (ingredientRows.length === 0) {
        throw new NotFoundError('Ingredient not found')
      }

      // Verificar si ya existe esta relación
      const [existingRows] = await pool.query(
        'SELECT * FROM dish_ingredients WHERE dish_id = ? AND ingredient_id = ?',
        [dishId, ingredientId]
      )

      if (existingRows.length > 0) {
        throw new BadRequestError('This ingredient is already in the dish recipe')
      }

      // Insertar la relación
      const [result] = await pool.query(
        'INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_used) VALUES (?, ?, ?)',
        [dishId, ingredientId, quantityUsed]
      )

      // Obtener el registro completo insertado
      const [newRows] = await pool.query(`
        SELECT 
          di.dish_ingredient_id,
          di.dish_id,
          di.ingredient_id,
          di.quantity_used,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_ingredient_id = ?
      `, [result.insertId])

      return newRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  /**
   * Actualiza la cantidad de un ingrediente en la receta
   */
  async updateQuantity (dishId, ingredientId, quantityUsed) {
    try {
      // Verificar que la relación existe
      const [existingRows] = await pool.query(
        'SELECT * FROM dish_ingredients WHERE dish_id = ? AND ingredient_id = ?',
        [dishId, ingredientId]
      )

      if (existingRows.length === 0) {
        throw new NotFoundError('Ingredient not found in dish recipe')
      }

      // Actualizar la cantidad
      await pool.query(
        'UPDATE dish_ingredients SET quantity_used = ? WHERE dish_id = ? AND ingredient_id = ?',
        [quantityUsed, dishId, ingredientId]
      )

      // Obtener el registro actualizado
      const [updatedRows] = await pool.query(`
        SELECT 
          di.dish_ingredient_id,
          di.dish_id,
          di.ingredient_id,
          di.quantity_used,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_id = ? AND di.ingredient_id = ?
      `, [dishId, ingredientId])

      return updatedRows[0]
    } catch (error) {
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    }
  },

  /**
   * Elimina un ingrediente de la receta de un plato
   */
  async removeIngredient (dishId, ingredientId) {
    try {
      // Verificar que la relación existe
      const [existingRows] = await pool.query(`
        SELECT 
          di.*,
          i.name as ingredient_name,
          i.unit as ingredient_unit
        FROM dish_ingredients di
        INNER JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_id = ? AND di.ingredient_id = ?
      `, [dishId, ingredientId])

      if (existingRows.length === 0) {
        throw new NotFoundError('Ingredient not found in dish recipe')
      }

      const deletedRecord = existingRows[0]

      // Eliminar la relación
      await pool.query(
        'DELETE FROM dish_ingredients WHERE dish_id = ? AND ingredient_id = ?',
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

  /**
   * Reemplaza todos los ingredientes de un plato (actualización completa de receta)
   */
  async replaceAllIngredients (dishId, ingredients) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Verificar que el plato existe
      const [dishRows] = await connection.query(
        'SELECT dish_id FROM dishes WHERE dish_id = ? AND deleted_at IS NULL',
        [dishId]
      )

      if (dishRows.length === 0) {
        throw new NotFoundError('Dish not found')
      }

      // Eliminar todos los ingredientes existentes
      await connection.query('DELETE FROM dish_ingredients WHERE dish_id = ?', [dishId])

      // Insertar los nuevos ingredientes
      if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          const { ingredient_id: ingredientId, quantity_used: quantityUsed } = ingredient

          // Verificar que el ingrediente existe
          const [ingredientRows] = await connection.query(
            'SELECT ingredient_id FROM ingredients WHERE ingredient_id = ? AND deleted_at IS NULL',
            [ingredientId]
          )

          if (ingredientRows.length === 0) {
            throw new NotFoundError(`Ingredient with id ${ingredientId} not found`)
          }

          await connection.query(
            'INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_used) VALUES (?, ?, ?)',
            [dishId, ingredientId, quantityUsed]
          )
        }
      }

      await connection.commit()

      // Retornar la nueva receta completa
      return await this.getByDishId(dishId)
    } catch (error) {
      await connection.rollback()
      if (isCustomUserError(error)) {
        throw error
      }
      throw new InternalServerError(error.message)
    } finally {
      connection.release()
    }
  }
}
