import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config({ quiet: true })

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    connection.release()
    return true
  } catch (error) {
    return false
  }
}

export default pool
