import mysql from 'mysql2/promise'

// Configuration with better defaults for local windows environments
const dbConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root', // Defaulting to 'root' as per common failure
  database: process.env.MYSQL_DATABASE || 'antiques_db',
  ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
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
  // If we are connecting to a remote host, bypass local discovery
  if (dbConfig.host !== '127.0.0.1' && dbConfig.host !== 'localhost') {
    return await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl
    })
  }

  const commonPasswords = ['', 'root', 'admin123', 'root123', 'admin']
  
  for (const pass of commonPasswords) {
    try {
      const conn = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
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
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    ssl: dbConfig.ssl
  })
}

export default pool
