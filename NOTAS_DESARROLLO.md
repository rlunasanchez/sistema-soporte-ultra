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

## Cambios Recientes - 20/03/2026

### 1. Renombrar Tabla
La tabla `ordenes_servicio` fue renombrada a `informe_tecnico`.

**SQL:**
```sql
ALTER TABLE ordenes_servicio RENAME TO informe_tecnico;
```

### 2. Campos Diagnóstico (NUEVO)

**SQL para agregar campos:**
```sql
ALTER TABLE informe_tecnico 
ADD COLUMN fecha_diagnostico TIMESTAMP NULL,
ADD COLUMN diagnostico TEXT NULL;
```

**Nota:** Estos campos NO se exportan a Excel ni PDF.

### 3. Cambios de Texto en la Interfaz

- Botón "Nueva OS" → "Informe Técnico"
- Título formulario: "Nueva OS" → "Nuevo Informe Técnico"
- Título al editar: "Editar OS" → "Editar Informe Técnico"
- Botón guardar: "Guardar OS" → "Guardar Informe"
- Título tabla: "Órdenes de Servicio" → "Informes"
- Mensaje vacío: "No se encontraron órdenes" → "No se encontraron informes"

### 4. Exportacion PDF Informes Tecnicos (NUEVO)

**Nueva funcionalidad:**
- Botón "Exportar PDF" en Ordenes.jsx (color rojo)
- Genera PDF con formato similar al formulario Nueva OS
- Cada orden aparece en una página separada
- Mismos campos que el formulario
- NO incluye campos de Diagnóstico

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

### Campos de la Tabla equipos_retirados
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | Identificador unico |
| fecha_retiro | TIMESTAMP | Fecha de retiro del equipo |
| serie_reversa | VARCHAR(100) | Numero de serie del equipo |
| equipo | VARCHAR(200) | Nombre/tipo de equipo |
| created_at | TIMESTAMP | Fecha creacion registro |
| updated_at | TIMESTAMP | Fecha actualizacion |

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

### 3. Tabla renombrada a informe_tecnico
Todas las consultas deben usar `informe_tecnico` en lugar de `ordenes_servicio`.

---

## Archivos Modificados

### Backend (v1.0.3)
- `backend/routes/ordenRoutes.js`
  - Tabla renombrada a `informe_tecnico`
  - Campos diagnostico agregados a INSERT y UPDATE
  - Ruta GET /api/orden/pdf (exportar PDF)
  - Ruta GET /api/orden/tecnicos (publica)
  - Ruta GET /api/orden/filtros-valores (publica)
  - Ruta GET /api/orden/valores-formulario (publica)

### Frontend (v1.0.3)
- `frontend-ultra/src/components/Ordenes.jsx`
  - Botón "Exportar PDF" (color rojo)
  - Botón "Informe Técnico"
  - Tabla "Informes"
  - Selects en filtros para cliente, tecnico, estado, equipo, marca, modelo

- `frontend-ultra/src/components/Formulario.jsx`
  - Modal de Diagnóstico (fecha_diagnostico, diagnostico)
  - Selects para cliente, tecnico, estado, equipo, marca, modelo
  - Texto actualizado: "Nuevo Informe Técnico", "Editar Informe Técnico"

---

## Desplegar cambios
1. **Frontend (Vercel):** GitHub connected, auto-deploy
2. **Backend (Render):** Manual deploy - hacer clic en "Manual Deploy" > "Deploy latest commit"

---

## Estado del Proyecto
- Modulo Retiro Bodega: COMPLETADO
- Exportacion PDF: COMPLETADO
- Modulo Diagnostico: COMPLETADO
- Cambios de texto interfaz: COMPLETADO
- Tabla renombrada a informe_tecnico: COMPLETADO
- Colores corporativos Sonda: COMPLETADO
- Produccion (PostgreSQL Neon): FUNCIONANDO

---

## Colores Corporativos Sonda

**Colores aplicados a todos los botones:**
- **Primary:** #0C4A8C (azul corporativo)
- **Primary Hover:** #0a3d75
- **Primary Light:** #e6f0fa
- **Secondary/Info:** #009EE3 (cyan)
- **Success:** #00B5E2
- **Success Light:** #e0f7fc
- **Danger:** #E53935
- **Warning:** #FF9800
- **Gradient:** linear-gradient(135deg, #0C4A8C 0%, #009EE3 100%)
