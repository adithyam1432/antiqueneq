const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Manual dotenv parser since dotenv isn't in package.json
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('[DB Setup] .env.local file not found! Please create it first.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      // Remove surrounding quotes if present
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      env[match[1].trim()] = val;
    }
  });
  return env;
}

async function run() {
  console.log('[DB Setup] Loading env configuration...');
  const env = loadEnv();

  const host = env.MYSQL_HOST || '127.0.0.1';
  const port = parseInt(env.MYSQL_PORT || '3306', 10);
  const user = env.MYSQL_USER || 'root';
  const password = env.MYSQL_PASSWORD || 'root';
  const database = env.MYSQL_DATABASE || 'antiques_db';
  const useSSL = env.MYSQL_SSL === 'true';

  console.log(`[DB Setup] Connecting to MySQL database at ${host}:${port}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
      multipleStatements: true
    });
    console.log('[DB Setup] Connected successfully!');
  } catch (err) {
    console.error('[DB Setup] Connection failed. If you are using Aiven, make sure the service is fully running and your IP is allowed in the Aiven console.');
    console.error(err);
    process.exit(1);
  }

  try {
    const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'schema.sql');
    console.log(`[DB Setup] Reading schema file from: ${schemaPath}`);
    let sql = fs.readFileSync(schemaPath, 'utf8');

    // Remove comments
    sql = sql.replace(/--.*$/gm, '');

    // Split statements by semicolon
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`[DB Setup] Executing ${statements.length} schema queries...`);
    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('[DB Setup] Database tables created successfully!');
  } catch (err) {
    console.error('[DB Setup] Failed to execute schema statements:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

run();
