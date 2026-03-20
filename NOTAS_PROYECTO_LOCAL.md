# Sistema Soporte Ultra - Notas de Desarrollo (Local MySQL)

## Informacion General
- **Cliente:** Banco Estado (Chile)
- **Desarrollador:** Rodrigo Luna
- **Stack:** React + Vite (Frontend), Node.js + Express (Backend), MySQL (DB)
- **Repositorio:** https://github.com/rlunasanchez/sistema-soporte-ultra
- **Ultima actualizacion:** 20 de Marzo 2026

## Infraestructura Local
- **Frontend:** Vite dev server (localhost:5173)
- **Backend:** Node.js puerto 5000
- **Base de datos:** MySQL local

## Ubicacion del Proyecto
`C:\wamp64\www\sistema-soporte-ultra\`

**Nota:** La tabla principal fue renombrada de `ordenes_servicio` a `informe_tecnico`.

---

## Cambios Recientes - 20/03/2026

### 1. Cambios de Texto en la Interfaz

- Botón "Nueva OS" → "Informe Técnico"
- Título formulario: "Nueva OS" → "Nuevo Informe Técnico"
- Título al editar: "Editar OS" → "Editar Informe Técnico"
- Botón guardar: "Guardar OS" → "Guardar Informe"
- Título tabla: "Órdenes de Servicio" → "Informes"
- Mensaje vacío: "No se encontraron órdenes" → "No se encontraron informes"

### 2. Selects en Formulario Nueva OS

**Campos convertidos a SELECT:**
- **Cliente:** Valor por defecto "Banco Estado" (editable)
- **Técnico:** Select con técnicos de la BD (tabla usuarios activos)
- **Garantía:** Select SI/NO
- **Estado Actual:** Select con opciones:
  - Reparado en bodega
  - Equipo irreparable en bodega
- **Realizado Por:** Select con técnicos de la BD
- **Equipo:** Select con equipos existentes en la BD
- **Marca:** Select con marcas existentes en la BD
- **Modelo:** Select con modelos existentes en la BD

### 3. Filtros en Ordenes.jsx

**Nuevos filtros convertidos a SELECT:**
- **Cliente:** Select con opción "Banco Estado"
- **Técnico:** Select con técnicos de la BD
- **Estado:** Select con "Reparado en bodega" y "Equipo irreparable en bodega"
- **Equipo:** Select dinámico desde la BD
- **Marca:** Select dinámico desde la BD
- **Modelo:** Select dinámico desde la BD

### 4. API Nuevas Rutas

**Backend - ordenRoutes.js:**
```javascript
// GET /api/orden/tecnicos (publica, sin auth)
// Retorna lista de usuarios activos para selects

// GET /api/orden/filtros-valores
// Retorna valores distintos de equipo, marca, modelo para filtros

// GET /api/orden/valores-formulario
// Retorna valores distintos de equipo, marca, modelo para formulario
```

### 5. Carga de Datos al Editar

Al editar una orden, los campos Técnico, Realizado Por, Equipo, Marca y Modelo ahora muestran el valor guardado correctamente.

### 6. Exportacion PDF Informes Tecnicos

**Nueva funcionalidad:**
- Botón "Exportar PDF" en Ordenes.jsx (color rojo)
- Genera PDF con formato similar al formulario Nueva OS
- Cada orden aparece en una página separada
- Mismos campos que el formulario
- NO incluye campos de Diagnóstico

**Backend - ordenRoutes.js:**
```javascript
// GET /api/orden/pdf
// Genera PDF con pdfkit
// Filtros aplicados: os, cliente, tecnico, estado, equipo, marca, modelo
// Maximo 100 ordenes por exportacion
```

**Libreria necesaria:**
```bash
npm install pdfkit
```

### 7. Modulo Diagnostico (NUEVO)

**Descripcion:**
- Botón "Diagnóstico" en el formulario (color morado)
- Modal con campos:
  - Fecha Diagnóstico (date)
  - Diagnóstico (textarea)
- Los campos NO se exportan a Excel ni PDF
- Solo se guardan en la base de datos

**Campos agregados a la base de datos:**
```sql
ALTER TABLE ordenes_servicio 
ADD COLUMN fecha_diagnostico DATETIME NULL,
ADD COLUMN diagnostico TEXT NULL;
```

**Backend - ordenRoutes.js:**
- INSERT: se agregaron fecha_diagnostico y diagnostico
- UPDATE: se agregaron fecha_diagnostico y diagnostico

**Frontend - Formulario.jsx:**
```javascript
// Estado para el modal
const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false);

// Campos en el formulario
fecha_diagnostico: "",
diagnostico: "",

// Modal con textarea para diagnostico
```

---

## Modulo: Retiro Bodega

### Descripcion
Modulo independiente para registrar equipos retireidos de bodega con filtros por fecha de retiro.

### Archivos Creados/Modificados

**Frontend:**
- `frontend-ultra/src/pages/RetiroBodega.jsx`
  - Formulario para crear/editar retiros
  - Tabla con paginacion (5 por pagina)
  - Filtros por rango de fechas
  - Exportacion a Excel con filtros aplicados
  - Editar y Eliminar registros
  - Vista movil (mobile-cards)
  - NO tiene campo ticket_laboratorio

- `frontend-ultra/src/components/Formulario.jsx`
  - Funcion `getDateValue` para extraer fechas al editar
  - Manejo de fechas con hora fija `T12:00:00`
  - Selects para tecnico, estado, equipo, marca, modelo
  - Modal de Diagnostico

- `frontend-ultra/src/components/Ordenes.jsx`
  - Boton "Retiro Bodega" verde
  - Selects en filtros para cliente, tecnico, estado, equipo, marca, modelo
  - Boton "Exportar PDF"
  - Botón "Informe Técnico"
  - Tabla "Informes"

**Backend:**
- `backend/routes/retiroRoutes.js` - API completa MySQL
- `backend/routes/ordenRoutes.js`
  - GET /api/orden/tecnicos (publica)
  - GET /api/orden/filtros-valores
  - GET /api/orden/valores-formulario
  - GET /api/orden/pdf (exportar PDF)
  - Filtros para equipo, marca, modelo en buildFilterQuery
  - Campos diagnostico agregados a INSERT y UPDATE

### Campos de la Tabla equipos_retirados
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | Primary Key |
| fecha_retiro | DATETIME | Fecha de retiro del equipo |
| serie_reversa | VARCHAR(100) | Numero de serie del equipo |
| equipo | VARCHAR(200) | Nombre/tipo de equipo |
| created_at | TIMESTAMP | Fecha creacion |
| updated_at | TIMESTAMP | Fecha actualizacion |

### SQL para crear la tabla equipos_retirados
```sql
CREATE TABLE equipos_retirados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_retiro DATETIME NOT NULL,
    serie_reversa VARCHAR(100) NOT NULL,
    equipo VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### SQL para agregar campos Diagnostico
```sql
ALTER TABLE ordenes_servicio 
ADD COLUMN fecha_diagnostico DATETIME NULL,
ADD COLUMN diagnostico TEXT NULL;

-- Renombrar tabla
ALTER TABLE ordenes_servicio RENAME TO informe_tecnico;
```

**Nota:** La tabla `ordenes_servicio` fue renombrada a `informe_tecnico`.

---

## Correcciones Implementadas

### 1. Funcion Helper para Extraer Fechas al Editar
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

### 2. Carga de Tecnicos en Formulario
```javascript
useEffect(() => {
  if (orden) {
    const tecnicoExiste = tecnicos.some(t => t.usuario === orden.tecnico);
    if (!tecnicoExiste && orden.tecnico) {
      setTecnicos(prev => [...prev, { usuario: orden.tecnico }]);
    }
    // Actualizar form con datos de la orden
  }
}, [orden, tecnicos]);
```

### 3. Carga de Valores de Formulario (Equipo, Marca, Modelo)
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

---

## Estructura de Archivos

```
sistema-soporte-ultra/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
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

## Comandos Utiles

### Iniciar Backend
```bash
cd C:\wamp64\www\sistema-soporte-ultra\backend
npm start
```

### Iniciar Frontend
```bash
cd C:\wamp64\www\sistema-soporte-ultra\frontend-ultra
npm run dev
```

### Instalar dependencias
```bash
cd backend
npm install pdfkit
```

---

## Notas Importantes

1. Los campos Diagnostico (fecha_diagnostico, diagnostico) NO se exportan a Excel ni PDF
2. La ruta `/api/orden/tecnicos` es publica (sin authMiddleware)
3. Los selects de Equipo, Marca y Modelo se llenan con valores existentes en la BD
4. El PDF muestra el mismo formato que el formulario (sin diagnostico)
5. Cambios de texto: "Informe Técnico" en toda la interfaz
6. El tecnico se agrega automaticamente al select si no existe en la lista

---

## Librerias Instaladas

### Backend
- `pdfkit` - Generacion de PDF

---

## Estado del Proyecto
- Modulo Retiro Bodega: COMPLETADO
- Correcciones de fechas: COMPLETADAS
- Selects en formulario: COMPLETADO
- Filtros con selects: COMPLETADO
- Exportacion PDF: COMPLETADO
- Modulo Diagnostico: COMPLETADO
- Cambios de texto interfaz: COMPLETADO
- Local (MySQL): FUNCIONANDO
- Produccion (PostgreSQL): FUNCIONANDO
