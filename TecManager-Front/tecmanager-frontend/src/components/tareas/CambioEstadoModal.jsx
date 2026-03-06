import { useState } from 'react';

const ESTADOS = [
  { valor: 'PENDIENTE',  label: '⏳ Pendiente',  color: '#f59e0b' },
  { valor: 'EN_ESPERA',  label: '⏸️ En Espera',  color: '#a855f7' },
  { valor: 'EN_PROCESO', label: '⚙️ En Proceso', color: '#3b82f6' },
  { valor: 'FINALIZADA', label: '✅ Finalizada',  color: '#22c55e' },
];

export default function CambioEstadoModal({ tarea, onGuardar, onCerrar }) {
  const [nuevoEstado, setNuevoEstado] = useState(tarea?.estado || 'EN_PROCESO');
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      setError('El comentario es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      await onGuardar({ nuevoEstado, comentario });
    } catch (err) {
      setError(err.message || 'Error al cambiar estado');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>🔄 Cambiar Estado</h2>
          <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
          Tarea: <strong>{tarea?.titulo}</strong>
        </p>

        <form onSubmit={handleSubmit}>

          {error && <div className="alerta alerta-error">{error}</div>}

          {/* Selector visual de estado */}
          <div className="form-grupo">
            <label>Nuevo estado</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ESTADOS.map(estado => (
                <button
                  key={estado.valor}
                  type="button"
                  onClick={() => setNuevoEstado(estado.valor)}
                  style={{
                    padding: '10px',
                    border: `2px solid ${nuevoEstado === estado.valor ? estado.color : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: nuevoEstado === estado.valor ? `${estado.color}20` : 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: nuevoEstado === estado.valor ? '600' : '400',
                    color: nuevoEstado === estado.valor ? estado.color : '#64748b',
                    transition: 'all 0.2s',
                  }}
                >
                  {estado.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grupo">
            <label>Comentario / Reporte *</label>
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="Describe lo que hiciste o el motivo del cambio..."
              rows={4}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Confirmar Cambio'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}