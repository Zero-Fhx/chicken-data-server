import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config({ quiet: true })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export const testConnection = async () => {
  try {
    const client = await pool.connect()
    client.release()
    return true
  } catch (error) {
    return false
  }
}

export default pool
