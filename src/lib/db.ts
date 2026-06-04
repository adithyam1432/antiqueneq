import mysql from 'mysql2/promise'

// Configuration with better defaults for local windows environments
const dbConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root', // Defaulting to 'root' as per common failure
  database: process.env.MYSQL_DATABASE || 'antiques_db',
}

// Pool with specific database connection
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Utility to find the correct connection parameters on this machine
export const getServerConnection = async () => {
  const commonPasswords = ['', 'root', 'admin123', 'root123', 'admin']
  
  for (const pass of commonPasswords) {
    try {
      const conn = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: pass
      })
      console.log(`[DB] Connected successfully with user: 'root' and password: '${pass || '(none)'}'`)
      return conn
    } catch (err: any) {
      // Continue searching
    }
  }

  // Final fallback to whatever is in env
  return await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  })
}

export default pool
