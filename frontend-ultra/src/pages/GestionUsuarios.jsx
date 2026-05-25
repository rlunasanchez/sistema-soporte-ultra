import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Plus, Save, Trash2, 
  ToggleLeft, ToggleRight, LogOut, ArrowLeft,
  Key, Lock, Edit
} from "lucide-react";
import api from "../services/api";

function GestionUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: "",
    password: "",
    rol: "tecnico",
    email: ""
  });

  const [cambioPassword, setCambioPassword] = useState({
    passwordActual: "",
    nuevaPassword: "",
    confirmarPassword: ""
  });

  const token = localStorage.getItem("token");
  let usuarioActual = "Usuario";
  let rol = "tecnico";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      usuarioActual = payload.usuario;
      rol = payload.rol || "tecnico";
    } catch {
      usuarioActual = "Usuario";
    }
  }

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("/api/auth/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      if (usuarioEditando) {
        await api.put(`/api/auth/actualizar-usuario/${usuarioEditando.id}`, {
          usuario: nuevoUsuario.usuario,
          rol: nuevoUsuario.rol,
          email: nuevoUsuario.email
        });
        alert("Usuario actualizado correctamente");
      } else {
        await api.post("/api/auth/registrar", nuevoUsuario);
        alert("Usuario creado correctamente");
      }
      setNuevoUsuario({ usuario: "", password: "", rol: "tecnico", email: "" });
      setUsuarioEditando(null);
      setMostrarFormulario(false);
      fetchUsuarios();
    } catch (err) {
      alert(err.response?.data?.msg || "Error al guardar usuario");
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoUsuario({
      usuario: usuario.usuario,
      password: "",
      rol: usuario.rol,
      email: usuario.email || ""
    });
    setMostrarFormulario(true);
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/api/auth/eliminar-usuario/${id}`);
      fetchUsuarios();
    } catch (err) {
      alert("Error al eliminar usuario");
    }
  };

  const toggleActivo = async (id, activo) => {
    try {
      await api.put(`/api/auth/activar-usuario/${id}`, { activo: !activo });
      fetchUsuarios();
    } catch (err) {
      alert("Error al cambiar estado");
    }
  };

  const resetearPassword = async (id) => {
    const nuevaPassword = prompt("Ingrese la nueva contraseña:");
    if (!nuevaPassword) return;
    try {
      await api.put(`/api/auth/resetear-password/${id}`, { nuevaPassword });
      alert("Password restablecida correctamente");
    } catch (err) {
      alert("Error al restablecer password");
    }
  };

  const cambiarMiPassword = async (e) => {
    e.preventDefault();
    if (cambioPassword.nuevaPassword !== cambioPassword.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      await api.put("/api/auth/cambiar-password", {
        usuario: usuarioActual,
        passwordActual: cambioPassword.passwordActual,
        nuevaPassword: cambioPassword.nuevaPassword
      });
      alert("Contraseña actualizada correctamente");
      setCambioPassword({ passwordActual: "", nuevaPassword: "", confirmarPassword: "" });
      setMostrarCambioPassword(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Error al cambiar contraseña");
    }
  };

  if (mostrarCambioPassword) {
    return (
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h2><Lock /> Cambiar Mi Contraseña</h2>
          </div>
          <form onSubmit={cambiarMiPassword} className="form-grid">
            <div className="form-group full-width">
              <label>Contraseña Actual</label>
              <input
                type="password"
                value={cambioPassword.passwordActual}
                onChange={(e) => setCambioPassword({...cambioPassword, passwordActual: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={cambioPassword.nuevaPassword}
                onChange={(e) => setCambioPassword({...cambioPassword, nuevaPassword: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={cambioPassword.confirmarPassword}
                onChange={(e) => setCambioPassword({...cambioPassword, confirmarPassword: e.target.value})}
                required
              />
            </div>
            <div className="form-actions form-actions-space">
              <button type="button" className="cancel-btn" onClick={() => setMostrarCambioPassword(false)}>
                <ArrowLeft /> Cancelar
              </button>
              <button type="submit" className="main-btn">
                <Save /> Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (mostrarFormulario) {
    return (
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h2><Plus /> {usuarioEditando ? "Editar Usuario" : "Crear Usuario"}</h2>
          </div>
          <form onSubmit={crearUsuario} className="form-grid">
            <div className="form-group">
              <label>Usuario</label>
              <input
                placeholder="Nombre de usuario"
                value={nuevoUsuario.usuario}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, usuario: e.target.value})}
                required
              />
            </div>
            {!usuarioEditando && (
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={nuevoUsuario.password}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select
                value={nuevoUsuario.rol}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
              >
                <option value="tecnico">Técnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-actions form-actions-space">
              <button type="button" className="cancel-btn" onClick={() => {
                setMostrarFormulario(false);
                setUsuarioEditando(null);
                setNuevoUsuario({ usuario: "", password: "", rol: "tecnico", email: "" });
              }}>
                <ArrowLeft /> Cancelar
              </button>
              <button type="submit" className="main-btn">
                <Save /> {usuarioEditando ? "Actualizar" : "Crear Usuario"}
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
          <h1><Users /> {rol === 'admin' ? 'Gestión de Usuarios' : 'Mi Cuenta'}</h1>
        </div>
        <div className="user-info">
          <button onClick={() => setMostrarCambioPassword(true)} className="logout-btn accent-btn">
            <Key />
            Cambiar Password
          </button>
          <button onClick={() => navigate("/ordenes")} className="logout-btn">
            <ArrowLeft />
            Volver
          </button>
          <button onClick={cerrarSesion} className="logout-btn">
            <LogOut />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {rol === 'admin' && (
        <div className="actions-bar">
          <button onClick={() => setMostrarFormulario(true)} className="main-btn">
            <Plus />
            Nuevo Usuario
          </button>
        </div>
      )}

      {rol === 'admin' ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td data-label="ID">{u.id}</td>
                  <td data-label="Usuario"><strong>{u.usuario}</strong></td>
                  <td data-label="Correo">{u.email || '-'}</td>
                  <td data-label="Rol">
                    <span className={`badge ${u.rol === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td data-label="Estado">
                    <button
                      className={`table-btn ${u.activo ? 'table-btn-success' : 'table-btn-danger'}`}
                      onClick={() => toggleActivo(u.id, u.activo)}
                    >
                      {u.activo ? <ToggleRight /> : <ToggleLeft />}
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td data-label="Fecha">{u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString("es-CL") : '-'}</td>
                  <td data-label="Acciones">
                    <div className="action-buttons">
                      {rol === 'admin' && (
                        <>
                          <button className="table-btn edit-btn" onClick={() => editarUsuario(u)}>
                            <Edit /> Editar
                          </button>
                          <button className="table-btn reset-pw-btn" onClick={() => resetearPassword(u.id)}>
                            <Key /> Reset
                          </button>
                          {u.usuario !== 'admin' && (
                            <button className="table-btn delete-btn" onClick={() => eliminarUsuario(u.id)}>
                              <Trash2 /> Eliminar
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container user-info-card">
          <h2>Información de tu cuenta</h2>
          <p className="user-info-line">
            <strong>Usuario:</strong> {usuarioActual}
          </p>
          <p className="user-info-line">
            <strong>Rol:</strong> {rol}
          </p>
          <p className="user-info-muted">
            Contacta al administrador si necesitas cambios en tu cuenta.
          </p>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;
