import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Error inesperado en el pool:", err.message);
});

export async function testConnection() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function closePool() {
  try {
    await pool.end();
    console.log("Pool de conexiones cerrado.");
  } catch (err) {
    console.error("Error al cerrar pool:", err.message);
  }
}

export default pool;
