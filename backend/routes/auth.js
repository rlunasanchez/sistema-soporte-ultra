import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { enviarEmail } from "../config/email.js";

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND activo = true",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ msg: "Usuario no encontrado o inactivo" });
    }

    const user = result.rows[0];
    const passwordValido = await bcrypt.compare(password, user.password);

    if (passwordValido) {
      const token = jwt.sign(
        { usuario: user.usuario, rol: user.rol },
        process.env.JWT_SECRET || "clave_secreta",
        { expiresIn: "8h" }
      );

      return res.json({ token });
    }

    res.status(401).json({ msg: "Credenciales incorrectas" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.post("/registrar", authMiddleware, async (req, res) => {
  const { usuario, password, rol, email } = req.body;

  try {
    const passwordEncriptada = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (usuario, password, rol, email, activo) VALUES ($1, $2, $3, $4, 1)",
      [usuario, passwordEncriptada, rol || "tecnico", email || null]
    );

    res.status(201).json({ msg: "Usuario creado correctamente" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.put("/cambiar-password", authMiddleware, async (req, res) => {
  const { usuario, passwordActual, nuevaPassword } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const passwordValida = await bcrypt.compare(passwordActual, user.password);

    if (!passwordValida) {
      return res.status(401).json({ msg: "Contraseña actual incorrecta" });
    }

    const nuevaPasswordEncriptada = await bcrypt.hash(nuevaPassword, 10);

    await pool.query(
      "UPDATE usuarios SET password = $1 WHERE usuario = $2",
      [nuevaPasswordEncriptada, usuario]
    );

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

// Endpoint de diagnóstico para verificar configuración de email (solo para testing)
router.get("/verificar-email-config", async (req, res) => {
  const configOk = !!process.env.RESEND_API_KEY;
  res.json({
    resendApiKeyConfigurada: configOk,
    nodeEnv: process.env.NODE_ENV || 'not set',
    mensaje: configOk ? "Configuración OK" : "RESEND_API_KEY no está configurada"
  });
});

router.post("/olvide-password", async (req, res) => {
  const { usuario } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ msg: "Usuario encontrado. Contacta al administrador para restablecer la contraseña." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.post("/buscar-usuario", async (req, res) => {
  const { usuario } = req.body;
  
  console.log(`[buscar-usuario] Iniciando para usuario: ${usuario}`);

  try {
    console.log(`[buscar-usuario] Buscando usuario en BD...`);
    const result = await pool.query(
      "SELECT id, email FROM usuarios WHERE usuario = $1 AND activo = true",
      [usuario]
    );
    console.log(`[buscar-usuario] Usuario encontrado: ${result.rows.length > 0}`);

    if (result.rows.length === 0) {
      console.log(`[buscar-usuario] Usuario no encontrado o inactivo`);
      return res.json({ existe: false });
    }

    const email = result.rows[0].email;
    console.log(`[buscar-usuario] Email del usuario: ${email ? '***' + email.slice(-10) : 'NO TIENE'}`);
    
    if (!email) {
      console.log(`[buscar-usuario] Usuario sin email registrado`);
      return res.status(400).json({ msg: "El usuario no tiene email registrado. Contacta al administrador." });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[buscar-usuario] Código generado: ${codigo}`);
    
    console.log(`[buscar-usuario] Guardando código en BD...`);
    await pool.query(
      "UPDATE usuarios SET codigo_recuperacion = $1, fecha_codigo = CURRENT_TIMESTAMP WHERE usuario = $2",
      [codigo, usuario]
    );
    console.log(`[buscar-usuario] Código guardado en BD`);

    const asunto = "Código de recuperación de contraseña";
    const mensaje = `Tu código de verificación es: ${codigo}\n\nEste código expira en 15 minutos.\n\nSistema de Soporte Ultra`;

    console.log(`[buscar-usuario] Intentando enviar email...`);
    const emailEnviado = await enviarEmail(email, asunto, mensaje);
    console.log(`[buscar-usuario] Resultado envío email: ${emailEnviado ? 'ÉXITO' : 'FALLO'}`);

    if (!emailEnviado) {
      console.log(`=== CÓDIGO DE RECUPERACIÓN (FALLBACK) ===`);
      console.log(`Usuario: ${usuario}, Email: ${email}, Código: ${codigo}`);
      
      // Solo mostrar código en respuesta si estamos en desarrollo local
      const esDesarrollo = process.env.NODE_ENV !== 'production';
      console.log(`[buscar-usuario] Modo desarrollo: ${esDesarrollo}`);
      
      if (esDesarrollo) {
        return res.json({ 
          existe: true, 
          mensaje: "No se pudo enviar el email. Código mostrado para desarrollo.", 
          codigo: codigo 
        });
      } else {
        return res.status(500).json({ 
          success: false,
          msg: "No se pudo enviar el código. Por favor contacta al administrador." 
        });
      }
    }

    console.log(`[buscar-usuario] Proceso completado exitosamente`);
    res.json({ success: true, existe: true, mensaje: "Código enviado a tu email" });
  } catch (err) {
    console.error(`[buscar-usuario] ERROR DETALLADO:`, err);
    console.error(`[buscar-usuario] Stack trace:`, err.stack);
    res.status(500).json({ 
      success: false,
      msg: "Error del servidor", 
      error: err.message 
    });
  }
});

router.post("/verificar-codigo", async (req, res) => {
  const { usuario, codigo } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, fecha_codigo FROM usuarios WHERE usuario = $1 AND codigo_recuperacion = $2",
      [usuario, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: "Código incorrecto" });
    }

    const fechaCodigo = new Date(result.rows[0].fecha_codigo);
    const ahora = new Date();
    const diferencia = (ahora - fechaCodigo) / (1000 * 60);

    if (diferencia > 15) {
      return res.status(400).json({ msg: "El código ha expirado. Solicita uno nuevo." });
    }

    res.json({ valido: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.post("/cambiar-password-externo", async (req, res) => {
  const { usuario, nuevaPassword } = req.body;

  try {
    const result = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = $1 AND activo = true",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado o inactivo" });
    }

    const passwordEncriptada = await bcrypt.hash(nuevaPassword, 10);

    await pool.query(
      "UPDATE usuarios SET password = $1, codigo_recuperacion = NULL, fecha_codigo = NULL WHERE usuario = $2",
      [passwordEncriptada, usuario]
    );

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.get("/usuarios", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, usuario, email, rol, activo, fecha_creacion FROM usuarios ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.put("/resetear-password/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const nuevaPasswordEncriptada = await bcrypt.hash(nuevaPassword, 10);

    await pool.query(
      "UPDATE usuarios SET password = $1 WHERE id = $2",
      [nuevaPasswordEncriptada, id]
    );

    res.json({ msg: "Contraseña restablecida correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.put("/activar-usuario/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;

  try {
    await pool.query(
      "UPDATE usuarios SET activo = $1 WHERE id = $2",
      [activo ? true : false, id]
    );

    res.json({ msg: activo ? "Usuario activado" : "Usuario desactivado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.delete("/eliminar-usuario/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.json({ msg: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.put("/actualizar-email/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    await pool.query(
      "UPDATE usuarios SET email = $1 WHERE id = $2",
      [email || null, id]
    );
    res.json({ msg: "Email actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

router.put("/actualizar-usuario/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { usuario, rol, email } = req.body;

  try {
    await pool.query(
      "UPDATE usuarios SET usuario = $1, rol = $2, email = $3 WHERE id = $4",
      [usuario, rol, email || null, id]
    );
    res.json({ msg: "Usuario actualizado correctamente" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

export default router;
