# Sistema Soporte Ultra - Notas de Desarrollo

## Información General
- **Cliente:** Banco Estado (Chile)
- **Desarrollador:** Rodrigo Luna
- **Stack:** React + Vite (Frontend), Node.js + Express (Backend), PostgreSQL (DB Neon)
- **Repositorio:** https://github.com/rlunasanchez/sistema-soporte-ultra
- **Versión:** 1.0.1

## Infraestructura
- **Frontend:** Vercel
- **Backend:** Render (https://sistema-soporte-ultra.onrender.com)
- **Base de datos:** Neon PostgreSQL

## Modulo: Retiro Bodega (COMPLETADO)

### Descripcion
Modulo independiente para registrar equipos retireidos de bodega con filtros por fecha de retiro.

### Archivos Creados

**Frontend:**
- `frontend-ultra/src/pages/RetiroBodega.jsx`
  - Formulario para crear/editar retiros
  - Tabla con paginacion (5 por pagina)
  - Filtros por rango de fechas
  - Exportacion a Excel con filtros aplicados
  - Editar y Eliminar registros
  - Vista movil (mobile-cards)

**Backend:**
- `backend/routes/retiroRoutes.js` - API completa PostgreSQL
  - GET /api/retiro - Listar con paginacion y filtros
  - POST /api/retiro - Crear
  - PUT /api/retiro/:id - Actualizar
  - DELETE /api/retiro/:id - Eliminar
  - GET /api/retiro/excel - Exportar Excel con filtros

**Base de Datos:**
- Tabla: `equipos_retirados`
- SQL: `backend/equipos_retirados_postgres.sql`

### Campos de la Tabla equipos_retirados
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | Identificador unico |
| fecha_retiro | TIMESTAMP | Fecha de retiro del equipo |
| serie_reversa | VARCHAR(100) | Numero de serie del equipo |
| equipo | VARCHAR(200) | Nombre/tipo de equipo |
| created_at | TIMESTAMP | Fecha creacion registro |
| updated_at | TIMESTAMP | Fecha actualizacion |

### SQL para crear la tabla
```sql
CREATE TABLE equipos_retirados (
    id SERIAL PRIMARY KEY,
    fecha_retiro TIMESTAMP NOT NULL,
    serie_reversa VARCHAR(100) NOT NULL,
    equipo VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fecha_retiro ON equipos_retirados(fecha_retiro);
```

### Rutas Agregadas en Backend (server.js)
```javascript
import retiroRoutes from "./routes/retiroRoutes.js";
app.use("/api/retiro", retiroRoutes);
```

### Rutas Agregadas en Frontend (App.jsx)
```javascript
import RetiroBodega from "./pages/RetiroBodega";

<Route path="/retiro-bodega" element={<PrivateRoute><RetiroBodega /></PrivateRoute>} />
```

### Boton en Ordenes.jsx
```javascript
<button onClick={() => navigate("/retiro-bodega")} className="main-btn" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
  <Package size={20} />
  Retiro Bodega
</button>
```

---

## Correcciones Importantes Aplicadas

### 1. Sintaxis PostgreSQL (NO MySQL)
PostgreSQL usa `$1, $2, $3` para parametros y `result.rows` para obtener resultados.

**INCORRECTO (MySQL):**
```javascript
const [rows] = await pool.query(sql, params);
```

**CORRECTO (PostgreSQL):**
```javascript
const result = await pool.query(sql, params);
const rows = result.rows;
```

### 2. Problema de Zona Horaria
Chile esta en UTC-3/UTC-4. Las fechas se guardaban con 1 dia de diferencia.

**Solucion aplicada:**
- Enviar fechas con hora fija: `T12:00:00`
- Mostrar fechas usando UTC: `getUTCDate()`, `getUTCMonth()`
- Filtros usan `DATE(campo)` simple

**Format Date correcto (frontend):**
```javascript
const formatDate = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
```

**Guardado de fechas (frontend - ordenes):**
```javascript
const dataToSend = {
  ...form,
  asignacion: form.asignacion ? form.asignacion + "T12:00:00" : "",
  fecha_reparacion: form.fecha_reparacion ? form.fecha_reparacion + "T12:00:00" : "",
  fecha: form.fecha ? form.fecha + "T12:00:00" : "",
};
```

**Guardado de fechas (frontend - retiro bodega):**
```javascript
const dataToSend = {
  ...formData,
  fecha_retiro: formData.fecha_retiro ? formData.fecha_retiro + "T12:00:00" : null
};
```

### 3. Formato de Fecha en Backend
```javascript
const formatDate = (d) => {
  if (!d) return null;
  if (d.includes('T')) return d;
  return d + 'T12:00:00';
};
```

### 4. Funcion Helper para Extraer Fechas al Editar
En el formulario de ordenes, al editar se usa una funcion para manejar diferentes formatos de fecha:

```javascript
const getDateValue = (fecha) => {
  if (!fecha) return "";
  if (typeof fecha === 'string' && fecha.includes('T')) {
    return fecha.split('T')[0];
  }
  if (typeof fecha === 'string') return fecha;
  return "";
};
```

Esto asegura que al editar una orden, las fechas se muestren correctamente en los campos de tipo date.

---

## Archivos Modificados

### Backend
- `backend/server.js` - Agregada ruta /api/retiro
- `backend/routes/retiroRoutes.js` - API completa
- `backend/equipos_retirados_postgres.sql` - SQL para tabla

### Frontend
- `frontend-ultra/src/App.jsx` - Nueva ruta /retiro-bodega
- `frontend-ultra/src/pages/RetiroBodega.jsx` - Nuevo componente
- `frontend-ultra/src/pages/Informacion.jsx` - Actualizado con documentación de Retiro Bodega
- `frontend-ultra/src/components/Ordenes.jsx` - Boton "Retiro Bodega" y formatDate corregido
- `frontend-ultra/src/components/Formulario.jsx` - Ajuste de fechas al guardar y editar

---

## Estilos CSS
Usa las mismas clases que el resto de la aplicacion:
- `.container`, `.header`, `.actions-bar`, `.main-btn`
- `.filters-section`, `.table-container`, `.pagination`
- `.form-container`, `.form-grid`, `.form-actions`

---

## Para Continuar
- No hay tareas pendientes conocidas
- Modulo completo y funcional en producción
- Filtro de fechas funcionando correctamente
- Exportación Excel funcionando
- Páginas de órdenes y retiro bodega funcionando con zona horaria corregida
- Documentación del sistema actualizada en página de información (v1.0.1)

## v1.0.2 (19-03-2026)

### Cambio en Retiro Bodega
- En vista móvil, el header de las tarjetas ahora muestra "Fecha: [fecha]" en lugar de "Retiro #[id]"
- Archivo: `frontend-ultra/src/pages/RetiroBodega.jsx` línea 411

---

## Comandos Git
```bash
# Estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "mensaje"

# Subir
git push
```

## Desplegar cambios
1. Frontend (Vercel): GitHub connected, auto-deploy
2. Backend (Render): Deploy latest commit
