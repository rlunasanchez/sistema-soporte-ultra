import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, FileText, Monitor, Edit } from "lucide-react";
import api from "../services/api";
import CustomSelect from "./CustomSelect";

function Formulario({ orden, onCerrar }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    os: "",
    cliente: "",
    tecnico: "",
    asignacion: "",
    en_garantia: "NO",
    tipo: "",
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
    fecha_diagnostico: "",
    diagnostico: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false);
  const [valoresForm, setValoresForm] = useState({ 
    equipos: ["PC", "Notebook", "Monitor", "All in One", "Impresora", "Lector de huella"], 
    marcas: ["Lumidigm"], 
    modelos: ["V-302-20S"] 
  });
  const [opcionesCliente, setOpcionesCliente] = useState(["Banco Estado"]);
  const [opcionesTipo, setOpcionesTipo] = useState(["Reparación", "Mantención", "DOA"]);
  const [opcionesEstado, setOpcionesEstado] = useState(["Reparado en bodega", "Equipo irreparable en bodega"]);
  const textareasRef = useRef({});

  useEffect(() => {
    const cargarValoresForm = async () => {
      try {
        const res = await api.get("/api/orden/valores-formulario");
        setValoresForm(prev => ({
          equipos: [...new Set([...prev.equipos, ...(res.data.equipos || [])])],
          marcas: [...new Set([...prev.marcas, ...(res.data.marcas || [])])],
          modelos: [...new Set([...prev.modelos, ...(res.data.modelos || [])])]
        }));
      } catch (err) {
        console.error("Error cargando valores de formulario:", err);
      }
    };
    cargarValoresForm();
  }, []);

  useEffect(() => {
    if (orden) {
      setOpcionesCliente(prev => {
        if (orden.cliente && !prev.includes(orden.cliente)) return [...prev, orden.cliente];
        return prev;
      });
      setOpcionesTipo(prev => {
        if (orden.tipo && !prev.includes(orden.tipo)) return [...prev, orden.tipo];
        return prev;
      });
      setOpcionesEstado(prev => {
        if (orden.estado_actual && !prev.includes(orden.estado_actual)) return [...prev, orden.estado_actual];
        return prev;
      });
      if (valoresForm.equipos.length > 0) {
        setValoresForm(prev => {
          const newEquipos = orden.equipo && !prev.equipos.includes(orden.equipo) 
            ? [...prev.equipos, orden.equipo] : prev.equipos;
          const newMarcas = orden.marca && !prev.marcas.includes(orden.marca) 
            ? [...prev.marcas, orden.marca] : prev.marcas;
          const newModelos = orden.modelo && !prev.modelos.includes(orden.modelo) 
            ? [...prev.modelos, orden.modelo] : prev.modelos;
          if (newEquipos !== prev.equipos || newMarcas !== prev.marcas || newModelos !== prev.modelos) {
            return { equipos: newEquipos, marcas: newMarcas, modelos: newModelos };
          }
          return prev;
        });
      }
    }
  }, [orden, valoresForm.equipos.length]);

  const getDateValue = (fecha) => {
    if (!fecha) return "";
    if (typeof fecha === 'string' && fecha.includes('T')) {
      return fecha.split('T')[0];
    }
    if (typeof fecha === 'string') return fecha;
    return "";
  };

  useEffect(() => {
    if (orden) {
      setForm({
        tecnico: orden.tecnico || "",
        realizado_por: orden.realizado_por || "",
        equipo: orden.equipo || "",
        marca: orden.marca || "",
        modelo: orden.modelo || "",
        fecha_diagnostico: getDateValue(orden.fecha_diagnostico),
        diagnostico: orden.diagnostico || "",
        asignacion: getDateValue(orden.asignacion),
        fecha_reparacion: getDateValue(orden.fecha_reparacion),
        fecha: getDateValue(orden.fecha),
        cargador: orden.cargador === 1,
        bateria: orden.bateria === 1,
        insumo: orden.insumo === 1,
        cabezal: orden.cabezal === 1,
        os: orden.os || "",
        cliente: orden.cliente || "",
        en_garantia: orden.en_garantia || "NO",
        tipo: orden.tipo || "REPARACION",
        estado_actual: orden.estado_actual || "",
        solicitud_compra: orden.solicitud_compra || "",
        n_denuncia: orden.n_denuncia || "",
        qty: orden.qty || "",
        anexo: orden.anexo || "",
        serie: orden.serie || "",
        procesador: orden.procesador || "",
        disco: orden.disco || "",
        memoria: orden.memoria || "",
        otros: orden.otros || "",
        falla_informada: orden.falla_informada || "",
        falla_detectada: orden.falla_detectada || "",
        conclusion: orden.conclusion || "",
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
          {orden ? "Editar Informe Técnico" : "Nuevo Informe Técnico"}
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
          <CustomSelect
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            options={opcionesCliente}
            placeholder="Seleccionar cliente"
          />
        </div>

        <div className="form-group">
          <label>Técnico</label>
          <input
            name="tecnico"
            placeholder="Nombre del técnico"
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
          <CustomSelect
            name="en_garantia"
            value={form.en_garantia}
            onChange={handleChange}
            options={["NO", "SI"]}
            placeholder="Seleccionar garantía"
          />
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <CustomSelect
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={opcionesTipo}
            placeholder="Seleccionar tipo"
          />
        </div>

        <div className="form-group">
          <label>Estado Actual</label>
          <CustomSelect
            name="estado_actual"
            value={form.estado_actual}
            onChange={handleChange}
            options={opcionesEstado}
            placeholder="Seleccionar estado"
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
          <CustomSelect
            name="equipo"
            value={form.equipo}
            onChange={handleChange}
            options={valoresForm.equipos}
            placeholder="Seleccionar equipo"
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
          <CustomSelect
            name="marca"
            value={form.marca}
            onChange={handleChange}
            options={valoresForm.marcas}
            placeholder="Seleccionar marca"
          />
        </div>

        <div className="form-group">
          <label>Modelo</label>
          <CustomSelect
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            options={valoresForm.modelos}
            placeholder="Seleccionar modelo"
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
            placeholder="Nombre de quien realizó el trabajo"
            value={form.realizado_por}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCerrar}
              style={{ whiteSpace: 'nowrap' }}
            >
              <ArrowLeft size={20} />
              Volver
            </button>

            <button
              type="button"
              onClick={() => setMostrarDiagnostico(true)}
              className="main-btn"
              style={{ whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #009EE3 0%, #00B5E2 100%)' }}
            >
              <FileText size={20} />
              Diagnóstico
            </button>
          </div>

          <button type="submit" className="main-btn" disabled={guardando} style={{ whiteSpace: 'nowrap' }}>
            <Save size={20} />
            {guardando ? 'Guardando...' : (orden ? 'Guardar Cambios' : 'Guardar Informe')}
          </button>
        </div>
      </form>

      {mostrarDiagnostico && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#4f46e5' }}>Diagnóstico</h3>

            <div className="form-group">
              <label>Fecha Diagnóstico</label>
              <input
                type="date"
                name="fecha_diagnostico"
                value={form.fecha_diagnostico}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Diagnóstico</label>
              <textarea
                name="diagnostico"
                placeholder="Ingrese el diagnóstico..."
                value={form.diagnostico}
                onChange={handleChange}
                rows={8}
                style={{ minHeight: '150px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setMostrarDiagnostico(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formulario;
