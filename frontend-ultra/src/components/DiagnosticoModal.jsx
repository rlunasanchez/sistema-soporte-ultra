export default function DiagnosticoModal({ form, onChange, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Diagnóstico</h3>
        <div className="form-group">
          <label>Fecha Diagnóstico</label>
          <input type="date" name="fecha_diagnostico" value={form.fecha_diagnostico} onChange={onChange} />
        </div>
        <div className="form-group full-width">
          <label>Diagnóstico</label>
          <textarea name="diagnostico" placeholder="Ingrese el diagnóstico..." value={form.diagnostico} onChange={onChange} rows={8} />
        </div>
        <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
          <button type="button" className="cancel-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
