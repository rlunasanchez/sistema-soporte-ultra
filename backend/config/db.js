import dotenv from "dotenv";

dotenv.config();

let _pool;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  const pg = await import("pg");
  isPostgres = true;
  _pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  });
} else {
  const mysql = await import("mysql2/promise");
  _pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "soporte_ultra_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

_pool.on("error", (err) => {
  console.error("Error inesperado en el pool:", err.message);
});

export async function query(sql, params = []) {
  if (isPostgres) {
    return _pool.query(sql, params);
  }

  let mysqlSql = sql.replace(/\$(\d+)/g, "?");

  const returningMatch = mysqlSql.match(/RETURNING\s+(\w+)/i);
  let hasReturning = false;
  let returningColumn = "id";

  if (returningMatch) {
    hasReturning = true;
    returningColumn = returningMatch[1];
    mysqlSql = mysqlSql.replace(/RETURNING\s+\w+/i, "");
  }

  const [result] = await _pool.execute(mysqlSql, params);

  if (hasReturning) {
    const id = result.insertId;
    return {
      rows: id != null ? [{ [returningColumn]: id }] : [],
      rowCount: result.affectedRows || 0,
    };
  }

  if (Array.isArray(result)) {
    return { rows: result, rowCount: result.length };
  }

  return { rows: [], rowCount: result.affectedRows || 0 };
}

_pool.on("error", (err) => {
  console.error("Error inesperado en el pool:", err.message);
});

export async function testConnection() {
  try {
    await query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function closePool() {
  try {
    await _pool.end();
    console.log("Pool de conexiones cerrado.");
  } catch (err) {
    console.error("Error al cerrar pool:", err.message);
  }
}

export default _pool;
