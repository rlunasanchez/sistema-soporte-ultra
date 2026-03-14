import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import ordenRoutes from "./routes/ordenRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// Rate Limiting - Limitar intentos de solicitud
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por IP
  message: { msg: "Demasiadas solicitudes, intenta más tarde" },
  validate: { xForwardedForHeader: false }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login
  message: { msg: "Demasiados intentos de login, intenta en 15 minutos" },
  validate: { xForwardedForHeader: false }
});

// Middlewares de seguridad
app.use(limiter); // Rate limit general
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://sistema-soporte-ultra-wngj.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Rutas API
app.use("/api/auth/login", loginLimiter); // Rate limit específico para login
app.use("/api/auth", authRoutes);
app.use("/api/orden", ordenRoutes);

app.listen(5000, () => {
  console.log("Servidor de Rodrigo ejecutándose en puerto 5000");
});
