import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Plus, ArrowLeft, LogOut, User, 
  Search, ChevronDown, ChevronUp, Edit, Trash2, FileSpreadsheet
} from "lucide-react";
import api from "../services/api";

function RetiroBodega() {
  const navigate = useNavigate();
  const [retiros, setRetiros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editarRetiro, setEditarRetiro] = useState(null);
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(true);

  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina] = useState(5);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [formData, setFormData] = useState({
    fecha_retiro: "",
    serie_reversa: "",
    equipo: ""
  });

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");
  let usuario = "Usuario";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      usuario = payload.usuario;
    } catch {
      usuario = "Usuario";
    }
  }

  const fetchRetiros = async () => {
    setCargando(true);
    try {
      const res = await api.get("/api/retiro", {
        params: {
          fechaDesde: filtroFechaDesde,
          fechaHasta: filtroFechaHasta,
          page: paginaActual,
          limit: registrosPorPagina,
        },
      });

      setRetiros(res.data.data || []);
      setTotalRegistros(res.data.pagination.total);
      setTotalPaginas(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setRetiros([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRetiros();
    }, 400);

    return () => clearTimeout(delay);
  }, [filtroFechaDesde, filtroFechaHasta, paginaActual]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarRetiro = async (e) => {
    e.preventDefault();
    try {
      if (editarRetiro) {
        await api.put(`/api/retiro/${editarRetiro.id}`, formData);
      } else {
        await api.post("/api/retiro", formData);
      }
      setFormData({ fecha_retiro: "", serie_reversa: "", equipo: "" });
      setEditarRetiro(null);
      setMostrarFormulario(false);
      fetchRetiros();
    } catch (err) {
      alert("Error al guardar");
    }
  };

  const editarItem = (item) => {
    setEditarRetiro(item);
    setFormData({
      fecha_retiro: item.fecha_retiro ? item.fecha_retiro.split("T")[0] : "",
      serie_reversa: item.serie_reversa || "",
      equipo: item.equipo || ""
    });
    setMostrarFormulario(true);
  };

  const eliminarItem = async (id) => {
    if (!window.confirm("¿Deseas eliminar este registro?")) return;
    try {
      await api.delete(`/api/retiro/${id}`);
      fetchRetiros();
    } catch {
      alert("Error al eliminar");
    }
  };

  const formatDate = (fecha) =>
    fecha ? new Date(fecha).toLocaleDateString("es-CL") : "-";

  const limpiarFiltros = () => {
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
    setPaginaActual(1);
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setEditarRetiro(null);
    setFormData({ fecha_retiro: "", serie_reversa: "", equipo: "" });
  };

  const descargarExcel = async () => {
    try {
      const response = await api.get("/api/retiro/excel", {
        params: {
          fechaDesde: filtroFechaDesde,
          fechaHasta: filtroFechaHasta,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Equipos Retirados.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("No se pudo descargar el Excel");
    }
  };

  if (mostrarFormulario) {
    return (
      <div className="container">
        <div className="header">
          <div className="header-left">
            <h1>
              <Package size={28} />
              {editarRetiro ? "Editar Retiro" : "Nuevo Retiro"}
            </h1>
          </div>
          <div className="user-info">
            <button onClick={cancelarFormulario} className="logout-btn">
              <ArrowLeft size={18} />
              Volver
            </button>
          </div>
        </div>

        <div className="form-container">
          <div className="form-header">
            <h2>
              <Package size={20} />
              Equipos Retirados Banco Estado
            </h2>
          </div>

          <form onSubmit={guardarRetiro}>
            <div className="form-grid">
              <div className="form-group">
                <label>Fecha de Retiro</label>
                <input
                  type="date"
                  name="fecha_retiro"
                  value={formData.fecha_retiro}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Serie Reversa</label>
                <input
                  type="text"
                  name="serie_reversa"
                  value={formData.serie_reversa}
                  onChange={handleChange}
                  placeholder="Ingrese serie"
                  required
                />
              </div>

              <div className="form-group">
                <label>Equipo</label>
                <input
                  type="text"
                  name="equipo"
                  value={formData.equipo}
                  onChange={handleChange}
                  placeholder="Ingrese equipo"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={cancelarFormulario} className="cancel-btn">
                <ArrowLeft size={18} />
                Cancelar
              </button>
              <button type="submit" className="main-btn">
                <Package size={18} />
                {editarRetiro ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1>
            <Package size={28} />
            Equipos Retirados Banco Estado
          </h1>
        </div>
        
        <div className="user-info">
          <div className="user-badge">
            <User size={18} />
            {usuario}
          </div>
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

      <div className="actions-bar">
        <button
          onClick={() => {
            setEditarRetiro(null);
            setFormData({ fecha_retiro: "", serie_reversa: "", equipo: "" });
            setMostrarFormulario(true);
          }}
          className="main-btn"
        >
          <Plus size={20} />
          Nuevo Retiro
        </button>

        <button onClick={descargarExcel} className="main-btn export-btn">
          <FileSpreadsheet size={20} />
          Exportar Excel
        </button>
      </div>

      <div className="filters-section">
        <div 
          className="filters-header"
          onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
        >
          <h3>
            <Search size={18} />
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
              <label>Fecha Desde</label>
              <input
                type="date"
                value={filtroFechaDesde}
                onChange={(e) => {
                  setFiltroFechaDesde(e.target.value);
                  setPaginaActual(1);
                }}
              />
            </div>

            <div className="filter-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filtroFechaHasta}
                onChange={(e) => {
                  setFiltroFechaHasta(e.target.value);
                  setPaginaActual(1);
                }}
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
          <span>Equipos Retirados ({totalRegistros} registros)</span>
        </div>

        {cargando ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : retiros.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>No se encontraron registros</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha Retiro</th>
                    <th>Serie Reversa</th>
                    <th>Equipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {retiros.map((r) => (
                    <tr key={r.id}>
                      <td data-label="ID">{r.id}</td>
                      <td data-label="Fecha Retiro">{formatDate(r.fecha_retiro)}</td>
                      <td data-label="Serie Reversa"><strong>{r.serie_reversa}</strong></td>
                      <td data-label="Equipo">{r.equipo}</td>
                      <td data-label="Acciones">
                        <div className="action-buttons">
                          <button
                            className="table-btn edit-btn"
                            onClick={() => editarItem(r)}
                          >
                            <Edit size={14} />
                            Editar
                          </button>
                          <button
                            className="table-btn delete-btn"
                            onClick={() => eliminarItem(r.id)}
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
              {retiros.map((r) => (
                <div className="mobile-card" key={r.id}>
                  <div className="mobile-card-header">
                    <span>Retiro #{r.id}</span>
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-row">
                      <label>Fecha:</label>
                      <span>{formatDate(r.fecha_retiro)}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Serie:</label>
                      <span>{r.serie_reversa}</span>
                    </div>
                    <div className="mobile-card-row">
                      <label>Equipo:</label>
                      <span>{r.equipo}</span>
                    </div>
                  </div>
                  <div className="mobile-card-footer">
                    <button className="table-btn edit-btn" onClick={() => editarItem(r)}>
                      <Edit size={14} />
                      Editar
                    </button>
                    <button className="table-btn delete-btn" onClick={() => eliminarItem(r.id)}>
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
            Mostrando {retiros.length > 0 ? (paginaActual - 1) * registrosPorPagina + 1 : 0} - {(paginaActual - 1) * registrosPorPagina + retiros.length} de {totalRegistros} registros
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

export default RetiroBodega;
