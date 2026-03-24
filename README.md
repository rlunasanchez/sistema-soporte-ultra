# Sistema de Soporte Ultra - Documentación del Proyecto

## 📋 Información General

- **Nombre**: Sistema de Soporte Ultra
- **Cliente**: Banco Estado (Chile)
- **Desarrollador**: Rodrigo Luna
- **Tipo**: Sistema de gestión de órdenes de servicio técnico
- **Estado**: Desplegado y funcionando en producción

---

## 🚀 URLs de Producción

| Servicio | URL |
|----------|-----|
| **Frontend** | https://sistema-soporte-ultra-wngj.vercel.app |
| **Backend** | https://sistema-soporte-ultra.onrender.com |
| **Base de datos** | Neon (PostgreSQL) |

---

## 🔐 Credenciales de Acceso

| Usuario | Password | Rol |
|--------|----------|-----|
| admin | Rluna6498 | admin |
| rodrigo | 123456 | tecnico |
| diego | 123456 | tecnico |

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web REST API
- **PostgreSQL** - Base de datos (Neon)
- **JWT** - Autenticación segura
- **bcrypt** - Encriptación de contraseñas
- **Resend API** - Envío de correos
- **xlsx-populate** - Generación de Excel
- **pdfkit** - Generación de PDF

### Frontend
- **React** - Framework UI
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **Lucide React** - Iconos

---

## ☁️ Servicios en la Nube (Gratuitos)

| Servicio | Uso | Costo |
|----------|-----|-------|
| **Vercel** | Frontend | Gratis |
| **Render** | Backend | Gratis (750 horas/mes) |
| **Neon** | PostgreSQL | Gratis (0.5GB) |
| **Resend** | Emails | Gratis (3,000 emails/mes) |
| **GitHub** | Repositorio | Gratis |

---

## 📁 Estructura del Proyecto

```
sistema-soporte-ultra/
├── backend/
│   ├── server.js              # Servidor principal
│   ├── package.json           # Dependencias Node
│   ├── schema_postgres.sql    # Estructura DB PostgreSQL
│   ├── backup_db_postgres.sql # Backup completo DB
│   ├── datos_migrate.sql      # Datos de migración
│   ├── crear_base_datos.sql   # Script creación DB
│   ├── config/
│   │   ├── db.js              # Conexión PostgreSQL
│   │   └── email.js           # Configuración Resend
│   ├── middleware/
│   │   └── authMiddleware.js  # Autenticación JWT
│   └── routes/
│       ├── auth.js            # Rutas de autenticación
│       ├── ordenRoutes.js     # Rutas de órdenes
│       └── retiroRoutes.js    # Rutas de retiro bodega
│
├── frontend-ultra/
│   ├── package.json           # Dependencias React
│   ├── vite.config.js         # Config Vite
│   ├── vercel.json            # Config Vercel
│   └── src/
│       ├── App.jsx            # Componente principal
│       ├── services/
│       │   └── api.js         # Cliente Axios
│       ├── pages/
│       │   ├── Login.jsx      # Login
│       │   ├── GestionUsuarios.jsx
│       │   ├── Informacion.jsx
│       │   └── RetiroBodega.jsx
│       └── components/
│           ├── Ordenes.jsx
│           ├── Formulario.jsx
│           └── PrivateRoute.jsx
│
└── backup_db.sql              # Backup original MySQL
```

---

## 🔧 Configuración de Variables de Entorno

### Backend (Render)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL de Neon |
| `JWT_SECRET` | Clave secreta para JWT |
| `RESEND_API_KEY` | API Key de Resend para emails |
| `NODE_ENV` | production |

### Frontend (Vercel)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL del backend en Render |

---

## 📊 Base de Datos

### Tabla: usuarios
```sql
id, usuario, password, rol, activo, email, codigo_recuperacion, fecha_codigo, fecha_creacion
```

### Tabla: informe_tecnico
```sql
id, os, cliente, tecnico, asignacion, en_garantia, tipo, estado_actual, 
fecha_reparacion, solicitud_compra, n_denuncia, qty, anexo, fecha, 
equipo, marca, serie, modelo, procesador, disco, memoria, 
cargador, bateria, insumo, cabezal, otros, 
falla_informada, falla_detectada, conclusion, realizado_por,
fecha_diagnostico, diagnostico
```

### Tabla: equipos_retirados
```sql
id, equipo, serie, motivo, tecnico, fecha_retiro, estado
```

---

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registrar` - Crear usuario (admin)
- `PUT /api/auth/cambiar-password` - Cambiar contraseña
- `POST /api/auth/buscar-usuario` - Solicitar código recuperación
- `POST /api/auth/verificar-codigo` - Verificar código
- `POST /api/auth/cambiar-password-externo` - Cambiar password con código
- `GET /api/auth/usuarios` - Listar usuarios
- `PUT /api/auth/resetear-password/:id` - Resetear password (admin)
- `PUT /api/auth/activar-usuario/:id` - Activar/desactivar usuario
- `DELETE /api/auth/eliminar-usuario/:id` - Eliminar usuario

### Órdenes
- `GET /api/orden` - Listar órdenes (con paginación y filtros)
- `POST /api/orden` - Crear orden
- `PUT /api/orden/:id` - Actualizar orden
- `DELETE /api/orden/:id` - Eliminar orden
- `GET /api/orden/excel` - Exportar Excel FileMaker
- `GET /api/orden/excel-correo` - Exportar Excel Banco Estado
- `GET /api/orden/excel-respaldo` - Exportar Excel Respaldo
- `GET /api/orden/pdf` - Exportar PDF informe técnico
- `GET /api/orden/tecnicos` - Listar técnicos
- `GET /api/orden/filtros-valores` - Valores para filtros
- `GET /api/orden/valores-formulario` - Valores para formulario

### Retiro Bodega
- `GET /api/retiro` - Listar equipos retirados
- `POST /api/retiro` - Registrar retiro
- `PUT /api/retiro/:id` - Actualizar retiro
- `DELETE /api/retiro/:id` - Eliminar retiro
- `GET /api/retiro/excel` - Exportar Excel equipos retirados

---

## 🎯 Funcionalidades Principales

### Módulo de Órdenes
- ✅ Crear, editar y eliminar órdenes de servicio
- ✅ Filtros por: OS, cliente, técnico, estado, equipo, marca, modelo
- ✅ Filtros por fecha: asignación, reparación, fecha específica
- ✅ Paginación de resultados (5 por página)
- ✅ Exportar a Excel (3 formatos: FileMaker, Banco Estado, Respaldo)
- ✅ Exportar a PDF con formato de informe técnico

### Módulo de Usuarios
- ✅ Gestión de usuarios (admin)
- ✅ Roles: admin, técnico
- ✅ Cambio de contraseña
- ✅ Recuperación de contraseña por email

### Módulo de Retiro de Bodega
- ✅ Registrar equipos-retirados
- ✅ Seguimiento de estado
- ✅ Exportar a Excel

### Diseño Responsive
- ✅ Adaptable a escritorio, tablet y móvil
- ✅ Modo tarjetas para móvil
- ✅ Navegación optimizada para touchscreen

---

## 📦 Comandos Útiles

### Desarrollo local
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend-ultra
npm install
npm run dev
```

### Despliegue
```bash
# Subir cambios a GitHub
git add .
git commit -m "mensaje"
git push origin main

# El deploy es automático en Vercel y Render
```

---

## 🔒 Seguridad Implementada

- JWT con expiración de 8 horas
- Contraseñas encriptadas con bcrypt (10 rondas)
- Rate limiting: 100 peticiones/15min (general)
- Rate limiting: 5 intentos/15min (login)
- CORS configurado para orígenes específicos
- Parámetros seguros en consultas SQL (prepared statements)

---

## 📞 Notas Importantes

1. **Neon**: El proyecto usa Neon.tech para PostgreSQL gratis. La base de datos está configurada con SSL requerido.

2. **Render**: El backend está en el plan gratuito. Puede hibernar después de 15 minutos de inactividad. La primera petición después de hibernar puede tardar ~30 segundos.

3. **Resend**: Para emails se usa Resend API (gratis). La cuenta está configurada con el dominio `onboarding@resend.dev`.

4. **Vercel**: El frontend está configurado como SPA (Single Page Application) con rewrites para React Router.

5. **Datos**: Las órdenes y usuarios están sincronizados con la base de datos de Neon.

---

## ✅ Estado Actual

- [x] Frontend desplegado en Vercel
- [x] Backend desplegado en Render
- [x] Base de datos en Neon
- [x] Envío de emails funcionando
- [x] Login y autenticación funcionando
- [x] CRUD de órdenes funcionando
- [x] Exportación a Excel funcionando
- [x] Exportación a PDF funcionando
- [x] Gestión de usuarios funcionando
- [x] Módulo de retiro de bodega funcionando
- [x] Diseño responsive para móviles
- [x] Filtros de fecha funcionando correctamente

---

## 📱 Diseño Responsive

El sistema está optimizado para funcionar en diferentes tamaños de pantalla:

### Desktop y Notebook
- Tabla completa con todas las columnas visibles
- Botones de paginación con texto completo ("Anterior", "Siguiente")
- Navegación horizontal en header

### Tablet (768px)
- Transición intermedia
- Botones más compactos

### Móvil (<768px)
- **Órdenes de servicio**: Se muestran como tarjetas independientes
- **Paginación**: Botones simplificados (‹ ›) sin números de página
- **Header**: Botones en filas flexibles
- **Formularios**: Campos en una sola columna
- **Gestión de usuarios**: Tarjetas responsive con data-labels

---

**Última actualización**: Marzo 2026
**Versión**: 1.0.5