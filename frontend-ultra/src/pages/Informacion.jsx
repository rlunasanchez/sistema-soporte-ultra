import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Info, Server, Database, Shield, FileSpreadsheet, 
  Users, Wrench, LogOut, ArrowLeft, ChevronDown, ChevronUp
} from "lucide-react";

function Informacion() {
  const navigate = useNavigate();
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({});

  const toggleSeccion = (seccion) => {
    setSeccionesExpandidas(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");
  let usuario = "Usuario";
  let rol = "tecnico";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      usuario = payload.usuario;
      rol = payload.rol || "tecnico";
    } catch {
      usuario = "Usuario";
    }
  }

  const secciones = [
    {
      id: "resumen",
      titulo: "Resumen del Proyecto",
      icono: <Info size={20} />,
      contenido: (
        <div className="info-content">
          <p><strong>Sistema de Soporte Ultra</strong> es una aplicación web para la gestión de órdenes de servicio técnico. Permite crear, editar, eliminar y visualizar órdenes de reparación de equipos, con exportación a Excel para reportes.</p>
          <p><strong>Cliente:</strong> Banco Estado (Chile)</p>
          <p><strong>Desarrollador:</strong> Rodrigo Luna</p>
          <p><strong>Tipo:</strong> Sistema de gestión de soporte técnico</p>
          <p><strong>Estado:</strong> Desplegado en producción</p>
        </div>
      )
    },
    {
      id: "tecnologias",
      titulo: "Tecnologías Utilizadas",
      icono: <Server size={20} />,
      contenido: (
        <div className="info-content">
          <h4>Backend</h4>
          <ul>
            <li><strong>Node.js</strong> - Entorno de ejecución</li>
            <li><strong>Express.js</strong> - Framework web REST API</li>
            <li><strong>PostgreSQL</strong> - Base de datos (Neon)</li>
            <li><strong>JWT</strong> - Autenticación segura</li>
            <li><strong>bcrypt</strong> - Encriptación de contraseñas</li>
            <li><strong>Resend</strong> - Envío de correos</li>
            <li><strong>xlsx-populate</strong> - Generación de Excel</li>
          </ul>
          <h4>Frontend</h4>
          <ul>
            <li><strong>React</strong> - Framework UI</li>
            <li><strong>Vite</strong> - Build tool</li>
            <li><strong>Axios</strong> - Cliente HTTP</li>
            <li><strong>React Router</strong> - Navegación</li>
            <li><strong>Lucide React</strong> - Iconos</li>
          </ul>
        </div>
      )
    },
    {
      id: "despliegue",
      titulo: "Despliegue en la Nube",
      icono: <Database size={20} />,
      contenido: (
        <div className="info-content">
          <p>El sistema está desplegado utilizando servicios gratuitos de nube:</p>
          <h4>Servicios Utilizados</h4>
          <ul>
            <li><strong>Frontend:</strong> Vercel</li>
            <li><strong>Backend:</strong> Render</li>
            <li><strong>Base de datos:</strong> Neon (PostgreSQL)</li>
            <li><strong>Email:</strong> Resend (API)</li>
            <li><strong>Repositorio:</strong> GitHub</li>
          </ul>
          <h4>Costos</h4>
          <ul>
            <li><strong>Todos los servicios son gratuitos</strong></li>
            <li>Neon: PostgreSQL gratis hasta 0.5GB</li>
            <li>Render: 750 horas/mes gratis</li>
            <li>Vercel: Ilimitado para proyectos personales</li>
            <li>Resend: 3,000 emails gratis/mes</li>
          </ul>
        </div>
      )
    },
    {
      id: "caracteristicas",
      titulo: "Características del Sistema",
      icono: <Wrench size={20} />,
      contenido: (
        <div className="info-content">
          <h4>Autenticación</h4>
          <ul>
            <li>Login con usuario y contraseña</li>
            <li>Recuperación de contraseña por email</li>
            <li>Token JWT con expiración de 8 horas</li>
            <li>Rate limiting (protección contra ataques)</li>
          </ul>
          <h4>Gestión de Usuarios</h4>
          <ul>
            <li>Crear usuarios (solo admin)</li>
            <li>Editar usuarios</li>
            <li>Eliminar usuarios</li>
            <li>Activar/desactivar usuarios</li>
            <li>Resetear contraseñas</li>
            <li>Cambio de contraseña propio</li>
          </ul>
          <h4>Órdenes de Servicio</h4>
          <ul>
            <li>Crear nuevas órdenes</li>
            <li>Editar órdenes existentes</li>
            <li>Eliminar órdenes</li>
            <li>Paginación (5 por página)</li>
            <li>Filtros avanzados (OS, cliente, técnico, estado, fechas)</li>
          </ul>
          <h4>Exportación a Excel</h4>
          <ul>
            <li>Excel Carga: Formato FileMaker</li>
            <li>Excel Correo: Formato Banco Estado</li>
            <li>Excel Respaldo: Backup completo</li>
          </ul>
          <h4>Retiro de Bodega</h4>
          <ul>
            <li>Gestión de equipos retirada de bodega</li>
            <li>Crear, editar y eliminar retiros</li>
            <li>Filtros por fecha</li>
            <li>Paginación (5 por página)</li>
            <li>Exportación a Excel</li>
          </ul>
        </div>
      )
    },
    {
      id: "seguridad",
      titulo: "Seguridad",
      icono: <Shield size={20} />,
      contenido: (
        <div className="info-content">
          <h4>Autenticación</h4>
          <ul>
            <li>JWT con clave secreta</li>
            <li>Expiración de 8 horas</li>
            <li>Contraseñas encriptadas con bcrypt (10 rondas)</li>
          </ul>
          <h4>Protección</h4>
          <ul>
            <li>Rate limiting: 100 peticiones/15min (general)</li>
            <li>Rate limiting: 5 intentos/15min (login)</li>
            <li>CORS configurado para orígenes específicos</li>
            <li>Parámetros seguros en consultas SQL</li>
          </ul>
          <h4>Rutas Protegidas</h4>
          <ul>
            <li>Todas las rutas de órdenes requieren token</li>
            <li>Rutas de usuarios requieren token</li>
            <li>Solo admin puede crear/eliminar usuarios</li>
          </ul>
        </div>
      )
    },
    {
      id: "endpoints",
      titulo: "Endpoints de API",
      icono: <Database size={20} />,
      contenido: (
        <div className="info-content">
          <h4>Autenticación</h4>
          <table className="info-table">
            <thead>
              <tr>
                <th>Método</th>
                <th>Endpoint</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>POST</td><td>/api/auth/login</td><td>Iniciar sesión</td></tr>
              <tr><td>POST</td><td>/api/auth/registrar</td><td>Crear usuario (admin)</td></tr>
              <tr><td>PUT</td><td>/api/auth/cambiar-password</td><td>Cambiar mi password</td></tr>
              <tr><td>POST</td><td>/api/auth/buscar-usuario</td><td>Solicitar código</td></tr>
              <tr><td>POST</td><td>/api/auth/verificar-codigo</td><td>Verificar código</td></tr>
              <tr><td>GET</td><td>/api/auth/usuarios</td><td>Listar usuarios</td></tr>
            </tbody>
          </table>
          <h4>Órdenes</h4>
          <table className="info-table">
            <thead>
              <tr>
                <th>Método</th>
                <th>Endpoint</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>GET</td><td>/api/orden</td><td>Listar órdenes</td></tr>
              <tr><td>POST</td><td>/api/orden</td><td>Crear orden</td></tr>
              <tr><td>PUT</td><td>/api/orden/:id</td><td>Actualizar orden</td></tr>
              <tr><td>DELETE</td><td>/api/orden/:id</td><td>Eliminar orden</td></tr>
              <tr><td>GET</td><td>/api/orden/excel</td><td>Exportar Excel</td></tr>
            </tbody>
          </table>
          <h4>Retiro de Bodega</h4>
          <table className="info-table">
            <thead>
              <tr>
                <th>Método</th>
                <th>Endpoint</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>GET</td><td>/api/retiro</td><td>Listar retiros</td></tr>
              <tr><td>POST</td><td>/api/retiro</td><td>Crear retiro</td></tr>
              <tr><td>PUT</td><td>/api/retiro/:id</td><td>Actualizar retiro</td></tr>
              <tr><td>DELETE</td><td>/api/retiro/:id</td><td>Eliminar retiro</td></tr>
              <tr><td>GET</td><td>/api/retiro/excel</td><td>Exportar Excel</td></tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: "estructura",
      titulo: "Estructura de Archivos",
      icono: <FileSpreadsheet size={20} />,
      contenido: (
        <div className="info-content">
          <pre className="code-block">
{`sistema-soporte-ultra/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── crear_base_datos.sql
│   ├── datos_migrate.sql
│   ├── datos_completos.sql
│   ├── backup_db_postgres.sql
│   ├── equipos_retirados_postgres.sql
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
    ├── vercel.json
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
            ├── App.css
            └── index.css`}
          </pre>
        </div>
      )
    }
  ];

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1><Info size={28} /> Información del Sistema</h1>
        </div>
        <div className="user-info">
          <button onClick={() => navigate("/ordenes")} className="logout-btn">
            <ArrowLeft size={18} />
            Volver
          </button>
          <button onClick={cerrarSesion} className="logout-btn">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="info-container">
        <div className="info-header-section">
          <h2>Sistema de Soporte Ultra</h2>
          <p className="info-subtitle">Versión 1.0.1</p>
          <p className="info-description">
            Aplicación web para la gestión de órdenes de servicio técnico para Banco Estado Chile.
          </p>
          <div className="info-badges">
            <span className="badge badge-primary">Backend: Node.js + Express</span>
            <span className="badge badge-info">Frontend: React + Vite</span>
            <span className="badge badge-success">Database: PostgreSQL (Neon)</span>
            <span className="badge badge-warning">Desplegado: Vercel + Render</span>
            <span className="badge badge-primary">Retiro Bodega</span>
          </div>
        </div>

        <div className="secciones-accordion">
          {secciones.map((seccion) => (
            <div key={seccion.id} className="seccion-item">
              <div 
                className="seccion-titulo" 
                onClick={() => toggleSeccion(seccion.id)}
              >
                <span className="seccion-icono">{seccion.icono}</span>
                <span className="seccion-texto">{seccion.titulo}</span>
                <span className="seccion-flecha">
                  {seccionesExpandidas[seccion.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </div>
              {seccionesExpandidas[seccion.id] && (
                <div className="seccion-contenido">
                  {seccion.contenido}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="info-footer">
          <p>© {new Date().getFullYear()} Rodrigo Luna. Todos los derechos reservados.</p>
          <p>Desarrollado con React, Node.js y PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}

export default Informacion;
