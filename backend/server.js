import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import ordenRoutes from "./routes/ordenRoutes.js";
import authRoutes from "./routes/auth.js";
import retiroRoutes from "./routes/retiroRoutes.js";
import { testConnection, closePool } from "./config/db.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Demasiadas solicitudes, intenta más tarde" }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Demasiados intentos de login, intenta en 15 minutos" }
});

app.use(limiter);
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://sistema-soporte-ultra-wngj.vercel.app'],
  credentials: true
}));
app.use(express.json());

const frontendPath = path.join(__dirname, "../frontend-ultra/dist");
app.use(express.static(frontendPath));

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/orden", ordenRoutes);
app.use("/api/retiro", retiroRoutes);

app.get("/api/health", async (req, res) => {
  const dbOk = await testConnection();
  const status = dbOk ? "ok" : "error";
  res.status(dbOk ? 200 : 503).json({
    status,
    database: dbOk ? "conectado" : "desconectado",
    timestamp: new Date().toISOString(),
  });
});

app.get("*path", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err.message);
  res.status(500).json({ msg: "Error interno del servidor" });
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("Servidor ejecutándose en puerto", process.env.PORT || 5000);
});

function gracefulShutdown(signal) {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  console.error("Excepción no capturada:", err.message);
  gracefulShutdown("uncaughtException");
});
process.on("unhandledRejection", (reason) => {
  console.error("Promesa rechazada sin capturar:", reason);
});
