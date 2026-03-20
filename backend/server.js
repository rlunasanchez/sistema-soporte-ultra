import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import ordenRoutes from "./routes/ordenRoutes.js";
import authRoutes from "./routes/auth.js";
import retiroRoutes from "./routes/retiroRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate Limiting - Limitar intentos de solicitud
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por IP
  message: { msg: "Demasiadas solicitudes, intenta más tarde" }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login
  message: { msg: "Demasiados intentos de login, intenta en 15 minutos" }
});

// Middlewares de seguridad
app.use(limiter); // Rate limit general
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Origins permitidos
  credentials: true
}));
app.use(express.json());

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, "../frontend-ultra/dist");
app.use(express.static(frontendPath));

// Rutas API
app.use("/api/auth/login", loginLimiter); // Rate limit específico para login
app.use("/api/auth", authRoutes);
app.use("/api/orden", ordenRoutes);
app.use("/api/retiro", retiroRoutes);

// Redirigir todas las demás solicitudes al index.html del frontend (SPA)
app.get("*path", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(5000, () => {
  console.log("Servidor de Rodrigo ejecutándose en puerto 5000");
});
