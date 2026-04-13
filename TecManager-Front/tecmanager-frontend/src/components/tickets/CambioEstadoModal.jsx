import { useState } from 'react';
import { X, Clock, PauseCircle, Wrench, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';

const ESTADOS = [
  { valor: 'PENDIENTE',  label: 'Pendiente',  Icon: Clock,        color: '#f59e0b', bg: '#fef3c7' },
  { valor: 'EN_ESPERA',  label: 'En Espera',  Icon: PauseCircle,  color: '#a855f7', bg: '#f3e8ff' },
  { valor: 'EN_PROCESO', label: 'En Proceso', Icon: Wrench,       color: '#3b82f6', bg: '#dbeafe' },
  { valor: 'FINALIZADA', label: 'Finalizada', Icon: CheckCircle2, color: '#22c55e', bg: '#dcfce7' },
];

export default function CambioEstadoModal({ ticket, onGuardar, onCerrar }) {
  const [nuevoEstado, setNuevoEstado] = useState(ticket?.estado || 'EN_PROCESO');
  const [comentario, setComentario]   = useState('');
  const [error, setError]             = useState('');
  const [guardando, setGuardando]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) { setError('El comentario es obligatorio'); return; }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f7f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <RefreshCw size={16} strokeWidth={2} style={{ color: '#262424' }} />
            </div>
            <div>
              <h2>Cambiar Estado</h2>
              <p style={{ fontSize: 12, color: '#6b6868', marginTop: 1, fontWeight: 400 }}>{ticket?.titulo}</p>
            </div>
          </div>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alerta alerta-error">{error}</div>}

          {/* Selector visual */}
          <div className="form-grupo">
            <label>Nuevo estado</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ESTADOS.map(({ valor, label, Icon, color, bg }) => {
                const activo = nuevoEstado === valor;
                return (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setNuevoEstado(valor)}
                    style={{
                      padding: '10px 12px',
                      border: `1.5px solid ${activo ? color : '#EEE5DA'}`,
                      borderRadius: 10,
                      background: activo ? bg : '#fafaf9',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: activo ? 700 : 500,
                      color: activo ? color : '#6b6868',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {label}
                  </button>
                );
              })}
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

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando
                ? <><Loader2 size={14} className="spin" /> Guardando...</>
                : 'Confirmar cambio'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}