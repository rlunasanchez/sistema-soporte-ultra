# Sistema Soporte Ultra - Notas de Desarrollo

## Información General
- **Cliente:** Banco Estado (Chile)
- **Desarrollador:** Rodrigo Luna
- **Stack:** React + Vite (Frontend), Node.js + Express (Backend), PostgreSQL (DB Neon)
- **Repositorio:** https://github.com/rlunasanchez/sistema-soporte-ultra
- **Versión:** 1.0.3

## Infraestructura
- **Frontend:** Vercel
- **Backend:** Render (https://sistema-soporte-ultra.onrender.com)
- **Base de datos:** Neon PostgreSQL

---

## v1.0.3 (20-03-2026)

### Cambios de Texto en la Interfaz
- Botón "Nueva OS" → "Informe Técnico"
- Título tabla: "Órdenes de Servicio" → "Informes"
- Mensaje vacío: "No se encontraron órdenes" → "No se encontraron informes"

### Exportacion PDF Informes Tecnicos (NUEVO)

**Nueva funcionalidad:**
- Botón "Exportar PDF" en Ordenes.jsx (color rojo)
- Genera PDF con formato similar al formulario Nueva OS
- Cada orden aparece en una página separada
- Mismos campos que el formulario

**Backend - ordenRoutes.js:**
```javascript
// GET /api/orden/pdf
// Genera PDF con pdfkit
// Filtros aplicados: os, cliente, tecnico, estado, equipo, marca, modelo
// Maximo 100 ordenes por exportacion
```

**Frontend - Ordenes.jsx:**
```javascript
// Funcion descargarPDF()
// Envia todos los filtros aplicados al backend
// Descarga archivo informes_tecnicos.pdf
```

**Libreria necesaria:**
```bash
npm install pdfkit
```

---

## v1.0.2 (19-03-2026)

### Cambio en Retiro Bodega
- En vista móvil, el header de las tarjetas ahora muestra "Fecha retiro: [fecha]" en lugar de "Retiro #[id]"

---

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

---

## Correcciones Importantes

### 1. Sintaxis PostgreSQL
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

### 2. Campo activo es boolean en PostgreSQL
```sql
-- CORRECTO
SELECT usuario FROM usuarios WHERE activo = true

-- INCORRECTO (causa error)
SELECT usuario FROM usuarios WHERE activo = 1
```

### 3. Problema de Zona Horaria
Chile esta en UTC-3/UTC-4. Las fechas se guardaban con 1 dia de diferencia.

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

### 4. Funcion Helper para Extraer Fechas al Editar
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

---

## Archivos Modificados

### Backend (v1.0.3)
- `backend/routes/ordenRoutes.js`
  - Nueva ruta GET /api/orden/pdf (exportar PDF con pdfkit)
  - Filtros para equipo, marca, modelo en buildFilterQuery

### Frontend (v1.0.3)
- `frontend-ultra/src/components/Ordenes.jsx`
  - Botón "Exportar PDF" (color rojo)
  - Botón "Informe Técnico"
  - Tabla "Informes"
  - Mensaje vacío actualizado

---

## Desplegar cambios
1. **Frontend (Vercel):** GitHub connected, auto-deploy
2. **Backend (Render):** Manual deploy - hacer clic en "Manual Deploy" > "Deploy latest commit"

---

## Estado del Proyecto
- Modulo Retiro Bodega: COMPLETADO
- Exportacion PDF: COMPLETADO
- Cambios de texto interfaz: COMPLETADO
- Produccion (PostgreSQL Neon): FUNCIONANDO
