import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, FileText, Monitor, User, Calendar, Edit } from "lucide-react";
import api from "../services/api";

function Formulario({ orden, onCerrar }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    os: "",
    cliente: "",
    tecnico: "",
    asignacion: "",
    en_garantia: "NO",
    tipo: "REPARACION",
    estado_actual: "",
    fecha_reparacion: "",
    solicitud_compra: "",
    n_denuncia: "",
    qty: "",
    anexo: "",
    fecha: "",
    equipo: "",
    marca: "",
    serie: "",
    modelo: "",
    procesador: "",
    disco: "",
    memoria: "",
    cargador: false,
    bateria: false,
    insumo: false,
    cabezal: false,
    otros: "",
    falla_informada: "",
    falla_detectada: "",
    conclusion: "",
    realizado_por: "",
  });

  const [guardando, setGuardando] = useState(false);
  const textareasRef = useRef({});

  useEffect(() => {
    if (orden) {
      setForm({
        ...orden,
        cargador: orden.cargador === 1,
        bateria: orden.bateria === 1,
        insumo: orden.insumo === 1,
        cabezal: orden.cabezal === 1,
      });
    }
  }, [orden]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (e.target.tagName === "TEXTAREA") {
      const ta = textareasRef.current[name];
      if (ta) {
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      let res;

      if (orden) {
        res = await api.put(`/api/orden/${orden.id}`, form);
      } else {
        res = await api.post("/api/orden", form);
      }

      alert(res.data?.msg || "Operación realizada correctamente");

      if (onCerrar) onCerrar();
      else navigate("/ordenes");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error del servidor");
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrar = () => {
    if (onCerrar) onCerrar();
    else navigate("/ordenes");
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>
          {orden ? <Edit size={24} /> : <FileText size={24} />}
          {orden ? "Editar OS" : "Nueva OS"}
        </h2>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>OS</label>
          <input
            name="os"
            placeholder="Número de OS"
            value={form.os}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cliente</label>
          <input
            name="cliente"
            placeholder="Nombre del cliente"
            value={form.cliente}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Técnico</label>
          <input
            name="tecnico"
            placeholder="Técnico responsable"
            value={form.tecnico}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha Asignación</label>
          <input
            type="date"
            name="asignacion"
            value={form.asignacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Garantía</label>
          <select
            name="en_garantia"
            value={form.en_garantia}
            onChange={handleChange}
          >
            <option value="NO">NO</option>
            <option value="SI">SI</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="REPARACION">Reparación</option>
            <option value="MANTENCION">Mantención</option>
            <option value="DOA">DOA</option>
          </select>
        </div>

        <div className="form-group">
          <label>Estado Actual</label>
          <input
            name="estado_actual"
            placeholder="Estado de la orden"
            value={form.estado_actual}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha Reparación</label>
          <input
            type="date"
            name="fecha_reparacion"
            value={form.fecha_reparacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Solicitud Compra</label>
          <input
            name="solicitud_compra"
            placeholder="N° Solicitud"
            value={form.solicitud_compra}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>N° Denuncia</label>
          <input
            name="n_denuncia"
            placeholder="Número de denuncia"
            value={form.n_denuncia}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cantidad</label>
          <input
            name="qty"
            placeholder="Cantidad"
            value={form.qty}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Anexo</label>
          <input
            name="anexo"
            placeholder="Anexo"
            value={form.anexo}
            onChange={handleChange}
          />
        </div>

        <div className="full-width" style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            marginBottom: '8px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}>
            <Monitor size={16} />
            INFORMACIÓN TÉCNICA
          </div>
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Equipo</label>
          <input
            name="equipo"
            placeholder="Tipo de equipo"
            value={form.equipo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Serie</label>
          <input
            name="serie"
            placeholder="Número de serie"
            value={form.serie}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Marca</label>
          <input
            name="marca"
            placeholder="Marca"
            value={form.marca}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Modelo</label>
          <input
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Procesador</label>
          <input
            name="procesador"
            placeholder="Procesador"
            value={form.procesador}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Disco</label>
          <input
            name="disco"
            placeholder="Disco"
            value={form.disco}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Memoria</label>
          <input
            name="memoria"
            placeholder="Memoria RAM"
            value={form.memoria}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Accesorios Incluidos</label>
          <div className="checkbox-grid">
            <label>
              <input
                type="checkbox"
                name="cargador"
                checked={form.cargador}
                onChange={handleChange}
              />
              Cargador
            </label>
            <label>
              <input
                type="checkbox"
                name="bateria"
                checked={form.bateria}
                onChange={handleChange}
              />
              Batería
            </label>
            <label>
              <input
                type="checkbox"
                name="insumo"
                checked={form.insumo}
                onChange={handleChange}
              />
              Insumo
            </label>
            <label>
              <input
                type="checkbox"
                name="cabezal"
                checked={form.cabezal}
                onChange={handleChange}
              />
              Cabezal
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Otros</label>
          <input
            name="otros"
            placeholder="Otros accesorios"
            value={form.otros}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Falla Informada</label>
          <textarea
            ref={(el) => (textareasRef.current["falla_informada"] = el)}
            name="falla_informada"
            placeholder="Describa la falla informada por el cliente"
            value={form.falla_informada}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Falla Detectada</label>
          <textarea
            ref={(el) => (textareasRef.current["falla_detectada"] = el)}
            name="falla_detectada"
            placeholder="Describa la falla detectada"
            value={form.falla_detectada}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Conclusión</label>
          <textarea
            ref={(el) => (textareasRef.current["conclusion"] = el)}
            name="conclusion"
            placeholder="Conclusion del trabajo realizado"
            value={form.conclusion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Realizado Por</label>
          <input
            name="realizado_por"
            placeholder="Técnico Asignado"
            value={form.realizado_por}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCerrar}
            style={{ whiteSpace: 'nowrap' }}
          >
            <ArrowLeft size={20} />
            Volver
          </button>

          <button type="submit" className="main-btn" disabled={guardando} style={{ whiteSpace: 'nowrap' }}>
            <Save size={20} />
            {guardando ? 'Guardando...' : (orden ? 'Guardar Cambios' : 'Guardar OS')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Formulario;
