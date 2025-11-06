import pool from '../config/database.js'

/**
 * Servicio para obtener timestamps desde PostgreSQL
 * Esto asegura consistencia entre los timestamps de la base de datos y la API
 */
export const TimestampService = {
  /**
   * Obtiene el timestamp actual de PostgreSQL
   * @returns {Promise<string>} Timestamp en formato ISO 8601
   */
  async getDbTimestamp () {
    try {
      const result = await pool.query('SELECT NOW() as timestamp')
      return result.rows[0].timestamp.toISOString()
    } catch (error) {
      console.error('Error getting database timestamp:', error)
      // Fallback a Node.js si falla la consulta
      return new Date().toISOString()
    }
  }
}
