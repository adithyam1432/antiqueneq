import { NextRequest, NextResponse } from 'next/server'
import { getServerConnection } from '@/lib/db'
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  // Security guard: require a secret token in production
  const setupSecret = req.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.SETUP_SECRET || process.env.NEXTAUTH_SECRET
  if (process.env.NODE_ENV === 'production' && setupSecret !== expectedSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let connection: mysql.Connection | null = null;
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql')
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`)
    }
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Connect to MySQL server (without a specific database)
    connection = await getServerConnection()
    
    // 1. Create the database if it doesn't exist
    const dbName = process.env.MYSQL_DATABASE || 'antiquity_db'
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`)
    console.log(`[Setup] Database ${dbName} confirmed.`)
    
    // 2. Select the database
    await connection.query(`USE ${dbName}`)
    
    // 3. Drop existing tables for a clean sync (Development mode only)
    await connection.query("SET FOREIGN_KEY_CHECKS = 0")
    await connection.query("DROP TABLE IF EXISTS cart_items, payouts, orders, antiques, seller_profiles, users")
    await connection.query("SET FOREIGN_KEY_CHECKS = 1")
    console.log(`[Setup] Old tables dropped. Starting fresh.`)

    // 4. Split schema into individual queries and run them
    const queries = schema
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    for (const query of queries) {
      if (query.toLowerCase().startsWith('create database') || query.toLowerCase().startsWith('use ')) continue
      await connection.query(query)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database '${dbName}' and tables successfully synchronized with the latest schema.` 
    })
  } catch (error: any) {
    console.error("Database initialization failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

