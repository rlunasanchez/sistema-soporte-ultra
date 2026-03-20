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

### Cambios en Formulario de Nueva OS

**Campos convertidos a SELECT:**
- **Cliente:** Valor por defecto "Banco Estado" (editable)
- **Técnico:** Select con técnicos de la BD (tabla usuarios activos)
- **Estado Actual:** Select con opciones:
  - Reparado en bodega
  - Equipo irreparable en bodega
- **Realizado Por:** Select con técnicos de la BD
- **Equipo:** Select con equipos existentes en la BD
- **Marca:** Select con marcas existentes en la BD
- **Modelo:** Select con modelos existentes en la BD

### Cambios en Filtros (Ordenes.jsx)

**Nuevos filtros convertidos a SELECT:**
- **Cliente:** Select con opción "Banco Estado"
- **Técnico:** Select con técnicos de la BD
- **Estado:** Select con "Reparado en bodega" y "Equipo irreparable en bodega"
- **Equipo:** Select dinámico desde la BD
- **Marca:** Select dinámico desde la BD
- **Modelo:** Select dinámico desde la BD

### API Nuevas Rutas (Backend - ordenRoutes.js)

```javascript
// GET /api/orden/tecnicos (PUBLICA, sin auth)
// Retorna lista de usuarios activos para selects
router.get("/tecnicos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT usuario FROM usuarios WHERE activo = true ORDER BY usuario ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo técnicos" });
  }
});

// GET /api/orden/filtros-valores (PUBLICA)
// Retorna valores distintos de equipo, marca, modelo para filtros
router.get("/filtros-valores", async (req, res) => {
  // Retorna: { equipos: [], marcas: [], modelos: [] }
});

// GET /api/orden/valores-formulario (PUBLICA)
// Retorna valores distintos de equipo, marca, modelo para formulario
router.get("/valores-formulario", async (req, res) => {
  // Retorna: { equipos: [], marcas: [], modelos: [] }
});
```

### Nota Importante: PostgreSQL Boolean
El campo `activo` en la tabla `usuarios` es de tipo `boolean` en PostgreSQL, no `integer` como en MySQL.

**CONSULTA CORRECTA:**
```sql
SELECT usuario FROM usuarios WHERE activo = true ORDER BY usuario ASC
```

### Carga de Técnicos en Frontend
```javascript
useEffect(() => {
  const cargarTecnicos = async () => {
    try {
      const res = await api.get("/api/orden/tecnicos");
      let data = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data.rows && Array.isArray(res.data.rows)) {
          data = res.data.rows;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        }
      }
      setTecnicos(data);
    } catch (err) {
      setTecnicos([]);
    }
  };
  cargarTecnicos();
}, []);
```

### Carga de Valores de Formulario (Equipo, Marca, Modelo)
```javascript
const [valoresForm, setValoresForm] = useState({ equipos: [], marcas: [], modelos: [] });

useEffect(() => {
  const cargarValoresForm = async () => {
    try {
      const res = await api.get("/api/orden/valores-formulario");
      setValoresForm(res.data);
    } catch (err) {
      console.error("Error cargando valores de formulario:", err);
    }
  };
  cargarValoresForm();
}, []);
```

### Carga de Datos al Editar
Al editar una orden, los campos Técnico, Realizado Por, Equipo, Marca y Modelo ahora muestran el valor guardado correctamente.

```javascript
useEffect(() => {
  if (orden) {
    setForm((prev) => ({
      ...orden,
      asignacion: getDateValue(orden.asignacion),
      fecha_reparacion: getDateValue(orden.fecha_reparacion),
      fecha: getDateValue(orden.fecha),
      cargador: orden.cargador === 1 || orden.cargador === true,
      bateria: orden.bateria === 1 || orden.bateria === true,
      insumo: orden.insumo === 1 || orden.insumo === true,
      cabezal: orden.cabezal === 1 || orden.cabezal === true,
    }));
  }
}, [orden]);

// Agregar tecnico al select si no existe en la lista
useEffect(() => {
  if (orden && tecnicos.length > 0) {
    const tecnicoOptions = tecnicos.map(t => t.usuario);
    if (!tecnicoOptions.includes(orden.tecnico) && orden.tecnico) {
      setTecnicos(prev => [...prev, { usuario: orden.tecnico }]);
    }
  }
}, [orden, tecnicos]);
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
  - Nueva ruta GET /api/orden/tecnicos (publica)
  - Nueva ruta GET /api/orden/filtros-valores (publica)
  - Nueva ruta GET /api/orden/valores-formulario (publica)
  - Filtros para equipo, marca, modelo en buildFilterQuery

### Frontend (v1.0.3)
- `frontend-ultra/src/components/Formulario.jsx`
  - Selects para cliente, tecnico, estado, equipo, marca, modelo, realizado_por
  - Valor por defecto cliente: "Banco Estado"
  - Valor por defecto estado: "Reparado en bodega"
  - Carga de tecnicos y valores de formulario desde la BD
  - Correccion de carga de datos al editar

- `frontend-ultra/src/components/Ordenes.jsx`
  - Selects en filtros para cliente, tecnico, estado, equipo, marca, modelo
  - Carga de tecnicos y valores de filtros desde la BD

---

## Estructura de Archivos Actual

```
sistema-soporte-ultra/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       ├── auth.js
│       ├── ordenRoutes.js
│       └── retiroRoutes.js
│
└── frontend-ultra/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── services/
        │   └── api.js
        ├── pages/
        │   ├── Login.jsx
        │   ├── GestionUsuarios.jsx
        │   ├── Informacion.jsx
        │   └── RetiroBodega.jsx
        ├── components/
        │   ├── Ordenes.jsx
        │   ├── Formulario.jsx
        │   └── PrivateRoute.jsx
        └── styles/
            └── App.css
```

---

## Desplegar cambios
1. **Frontend (Vercel):** GitHub connected, auto-deploy
2. **Backend (Render):** Manual deploy - hacer clic en "Manual Deploy" > "Deploy latest commit"

---

## Estado del Proyecto
- Modulo Retiro Bodega: COMPLETADO
- Selects en formulario (cliente, tecnico, estado, equipo, marca, modelo): COMPLETADO
- Filtros con selects: COMPLETADO
- Carga de datos al editar: COMPLETADO
- Produccion (PostgreSQL Neon): FUNCIONANDO
