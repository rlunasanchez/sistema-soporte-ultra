import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, Plus, Download, Mail, Save, 
  Search, ChevronDown, ChevronUp, LogOut,
  User, Edit, Trash2, Filter, FileSpreadsheet, Users, Info, Package
} from "lucide-react";
import api from "../services/api";
import Formulario from "./Formulario";

function Ordenes() {
  const navigate = useNavigate();

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

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(true);

  const [busquedaOS, setBusquedaOS] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroTecnico, setFiltroTecnico] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [fechaAsignacionDesde, setFechaAsignacionDesde] = useState("");
  const [fechaAsignacionHasta, setFechaAsignacionHasta] = useState("");
  const [fechaReparacionDesde, setFechaReparacionDesde] = useState("");
  const [fechaReparacionHasta, setFechaReparacionHasta] = useState("");

  const [fechaFiltro, setFechaFiltro] = useState("");

  const [ordenEditar, setOrdenEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const mostrarFormularioRef = useRef(mostrarFormulario);
  mostrarFormularioRef.current = mostrarFormulario;

  useEffect(() => {
    const handlePopState = (event) => {
      if (mostrarFormularioRef.current) {
        event.preventDefault();
        setOrdenEditar(null);
        setMostrarFormulario(false);
        fetchOrdenes();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina] = useState(5);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const fetchOrdenes = async () => {
    setCargando(true);
    try {
      const res = await api.get("/api/orden", {
        params: {
          os: busquedaOS,
          cliente: filtroCliente,
          tecnico: filtroTecnico,
          estado: filtroEstado,
          fechaAsignacionDesde,
          fechaAsignacionHasta,
          fechaReparacionDesde,
          fechaReparacionHasta,
          fecha: fechaFiltro,
          page: paginaActual,
          limit: registrosPorPagina,
        },
      });

      setOrdenes(res.data.data);
      setTotalRegistros(res.data.pagination.total);
      setTotalPaginas(res.data.pagination.totalPages);

    } catch (err) {
      console.error(err);
      setOrdenes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrdenes();
    }, 400);

    return () => clearTimeout(delay);

  }, [
    busquedaOS,
    filtroCliente,
    filtroTecnico,
    filtroEstado,
    fechaAsignacionDesde,
    fechaAsignacionHasta,
    fechaReparacionDesde,
    fechaReparacionHasta,
    fechaFiltro,
    paginaActual,
  ]);

  const eliminarOrden = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta orden?")) return;

    try {
      await api.delete(`/api/orden/${id}`);
      fetchOrdenes();
    } catch {
      alert("Error eliminando orden");
    }
  };

  const editarOrden = (orden) => {
    setOrdenEditar(orden);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setOrdenEditar(null);
    setMostrarFormulario(false);
    fetchOrdenes();
  };

  const formatDate = (fecha) =>
    fecha ? new Date(fecha).toLocaleDateString("es-CL") : "-";

  const getEstadoBadge = (estado) => {
    const estadoLower = (estado || '').toLowerCase();
    if (estadoLower.includes('complet') || estadoLower.includes('entreg')) {
      return <span className="badge badge-success">{estado || '-'}</span>;
    }
    if (estadoLower.includes('pendient') || estadoLower.includes('espera')) {
      return <span className="badge badge-warning">{estado || '-'}</span>;
    }
    if (estadoLower.includes('cancel') || estadoLower.includes('rechaz')) {
      return <span className="badge badge-danger">{estado || '-'}</span>;
    }
    return <span className="badge badge-info">{estado || '-'}</span>;
  };

  const getGarantiaBadge = (garantia) => {
    if (garantia === 'SI') {
      return <span className="badge badge-success">SI</span>;
    }
    return <span className="badge badge-primary">NO</span>;
  };

  const descargarExcel = async () => {
    try {
      const response = await api.get("/api/orden/excel", {
        params: {
          os: busquedaOS,
          cliente: filtroCliente,
          tecnico: filtroTecnico,
          estado: filtroEstado,
          fechaAsignacionDesde,
          fechaAsignacionHasta,
          fechaReparacionDesde,
          fechaReparacionHasta,
          fecha: fechaFiltro,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_tecnico.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch {
      alert("No se pudo descargar el Excel");
    }
  };

  const descargarExcelCorreo = async () => {
    try {
      const response = await api.get("/api/orden/excel-correo", {
        params: {
          os: busquedaOS,
          cliente: filtroCliente,
          tecnico: filtroTecnico,
          estado: filtroEstado,
          fechaAsignacionDesde,
          fechaAsignacionHasta,
          fechaReparacionDesde,
          fechaReparacionHasta,
          fecha: fechaFiltro,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "equipos_banco_estado.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch {
      alert("No se pudo descargar el Excel correo");
    }
  };

  const descargarExcelRespaldo = async () => {
    try {
      const response = await api.get("/api/orden/excel-respaldo", {
        params: {
          os: busquedaOS,
          cliente: filtroCliente,
          tecnico: filtroTecnico,
          estado: filtroEstado,
          fechaAsignacionDesde,
          fechaAsignacionHasta,
          fechaReparacionDesde,
          fechaReparacionHasta,
          fecha: fechaFiltro,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "respaldo_banco_estado.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch {
      alert("No se pudo descargar el Excel respaldo");
    }
  };

  const limpiarFiltros = () => {
    setBusquedaOS("");
    setFiltroCliente("");
    setFiltroTecnico("");
    setFiltroEstado("");
    setFechaAsignacionDesde("");
    setFechaAsignacionHasta("");
    setFechaReparacionDesde("");
    setFechaReparacionHasta("");
    setFechaFiltro("");
  };

  if (mostrarFormulario) {
    return (
      <div className="container">
        <Formulario orden={ordenEditar} onCerrar={cerrarFormulario} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1>
            <Wrench size={28} />
            Sistema de Carga OS
          </h1>
        </div>
        
        <div className="user-info">
          <div className="user-badge">
            <User size={18} />
            {usuario}
          </div>
          <button onClick={cerrarSesion} className="logout-btn">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="actions-bar">
        <button
          onClick={() => {
            setOrdenEditar(null);
            setMostrarFormulario(true);
          }}
          className="main-btn"
        >
          <Plus size={20} />
          Nueva OS
        </button>

        <button onClick={descargarExcel} className="main-btn export-btn">
          <FileSpreadsheet size={20} />
          Excel Carga
        </button>

        <button onClick={descargarExcelCorreo} className="main-btn export-btn">
          <Mail size={20} />
          Excel Correo
        </button>

        <button onClick={descargarExcelRespaldo} className="main-btn export-btn">
          <Save size={20} />
          Excel Respaldo
        </button>

        {rol === 'admin' ? (
          <button onClick={() => navigate("/usuarios")} className="main-btn export-btn">
            <Users size={20} />
            Usuarios
          </button>
        ) : (
          <button onClick={() => navigate("/usuarios")} className="main-btn export-btn">
            <Users size={20} />
            Mi Cuenta
          </button>
        )}

        <button onClick={() => navigate("/informacion")} className="main-btn info-btn">
          <Info size={20} />
          Datos del Software
        </button>

        <button onClick={() => navigate("/retiro-bodega")} className="main-btn" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
          <Package size={20} />
          Retiro Bodega
        </button>
      </div>

      <div className="filters-section">
        <div 
          className="filters-header"
          onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
        >
          <h3>
            <Filter size={18} />
            Filtros de Búsqueda
          </h3>
          <div className="filters-toggle">
            {filtrosExpandidos ? 'Ocultar' : 'Mostrar'}
            {filtrosExpandidos ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {filtrosExpandidos && (
          <div className="filters-content">
            <div className="filter-group">
              <label>Buscar OS</label>
              <input
                placeholder="Número de OS"
                value={busquedaOS}
                onChange={(e) => setBusquedaOS(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Cliente</label>
              <input
                placeholder="Filtrar por Cliente"
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Técnico</label>
              <input
                placeholder="Filtrar por Técnico"
                value={filtroTecnico}
                onChange={(e) => setFiltroTecnico(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Estado</label>
              <input
                placeholder="Filtrar por Estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Asignación Desde</label>
              <input
                type="date"
                value={fechaAsignacionDesde}
                onChange={(e) => setFechaAsignacionDesde(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Asignación Hasta</label>
              <input
                type="date"
                value={fechaAsignacionHasta}
                onChange={(e) => setFechaAsignacionHasta(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Reparación Desde</label>
              <input
                type="date"
                value={fechaReparacionDesde}
                onChange={(e) => setFechaReparacionDesde(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Reparación Hasta</label>
              <input
                type="date"
                value={fechaReparacionHasta}
                onChange={(e) => setFechaReparacionHasta(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Fecha</label>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
            </div>

            <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
              <button 
                onClick={limpiarFiltros}
                className="cancel-btn"
                style={{ marginTop: 'auto' }}
              >
                <Search size={16} />
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="table-container">
        <div className="table-header">
          <span>Órdenes de Servicio ({ordenes.length} registros)</span>
        </div>

        {cargando ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <p>No se encontraron órdenes</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>OS</th>
                    <th>Cliente</th>
                    <th>Técnico</th>
                    <th>Asignación</th>
                    <th>Estado</th>
                    <th>Fecha Rep.</th>
                    <th>Fecha</th>
                    <th>Equipo</th>
                    <th>Serie</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {ordenes.map((o) => (
                    <tr key={o.id}>
                      <td data-label="ID">{o.id}</td>
                      <td data-label="OS"><strong>{o.os}</strong></td>
                      <td data-label="Cliente">{o.cliente}</td>
                      <td data-label="Técnico">{o.tecnico}</td>
                      <td data-label="Asignación">{formatDate(o.asignacion)}</td>
                      <td data-label="Estado">{getEstadoBadge(o.estado_actual)}</td>
                      <td data-label="Fecha Rep.">{formatDate(o.fecha_reparacion)}</td>
                      <td data-label="Fecha">{formatDate(o.fecha)}</td>
                      <td data-label="Equipo">{o.equipo}</td>
                      <td data-label="Serie">{o.serie}</td>

                      <td data-label="Acciones">
                        <div className="action-buttons">
                          <button
                            className="table-btn edit-btn"
                            onClick={() => editarOrden(o)}
                          >
                            <Edit size={14} />
                            Editar
                          </button>

                          <button
                            className="table-btn delete-btn"
                            onClick={() => eliminarOrden(o.id)}
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-cards">
              {ordenes.map((o) => (
                <div className="mobile-card" key={o.id}>
                  <div className="mobile-card-header">
                    <span>OS: {o.os}</span>
                    {getEstadoBadge(o.estado_actual)}
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-row">
                      <label>Cliente:</label>
                      <span>{o.cliente}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Técnico:</label>
                      <span>{o.tecnico}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Asignación:</label>
                      <span>{formatDate(o.asignacion)}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Fecha Rep.:</label>
                      <span>{formatDate(o.fecha_reparacion)}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Equipo:</label>
                      <span>{o.equipo}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Serie:</label>
                      <span>{o.serie}</span>
                    </div>
                  </div>
                  <div className="mobile-card-footer">
                    <button className="table-btn edit-btn" onClick={() => editarOrden(o)}>
                      <Edit size={14} />
                      Editar
                    </button>
                    <button className="table-btn delete-btn" onClick={() => eliminarOrden(o.id)}>
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="pagination">
          <div className="pagination-info">
            Mostrando {ordenes.length > 0 ? (paginaActual - 1) * registrosPorPagina + 1 : 0} - {(paginaActual - 1) * registrosPorPagina + ordenes.length} de {totalRegistros} registros
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn-nav"
              onClick={() => setPaginaActual(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              ‹
            </button>

            <span className="page-numbers-desktop">
              {[...Array(totalPaginas)].map((_, i) => {
                const numero = i + 1;
                return (
                  <button
                    key={numero}
                    onClick={() => setPaginaActual(numero)}
                    className={paginaActual === numero ? 'active' : ''}
                  >
                    {numero}
                  </button>
                );
              })}
            </span>

            <button
              className="page-btn-nav"
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ordenes;
