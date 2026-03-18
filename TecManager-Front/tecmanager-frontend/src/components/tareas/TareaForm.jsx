import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { X, FileText, AlignLeft, Flag, User, Calendar, Clock, Loader2 } from 'lucide-react';

const PRIORIDADES = [
  { valor: 'ALTA',  label: 'Alta',  color: '#ef4444', bg: '#fee2e2' },
  { valor: 'MEDIA', label: 'Media', color: '#f59e0b', bg: '#fef3c7' },
  { valor: 'BAJA',  label: 'Baja',  color: '#22c55e', bg: '#dcfce7' },
];

export default function TareaForm({ tarea, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    titulo:              tarea?.titulo || '',
    descripcion:         tarea?.descripcion || '',
    prioridad:           tarea?.prioridad || 'MEDIA',
    tecnicoId:           tarea?.tecnicoId || '',
    fechaLimite:         tarea?.fechaLimite ? new Date(tarea.fechaLimite).toISOString().slice(0, 16) : '',
    tiempoEstimadoHoras: tarea?.tiempoEstimadoHoras || '',
  });
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError]       = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api.get('/usuarios/rol/TECNICO')
      .then(r => setTecnicos(r.data.filter(t => t.activo)))
      .catch(() => setError('Error al cargar técnicos'));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await onGuardar({
        ...form,
        fechaLimite: form.fechaLimite ? new Date(form.fechaLimite).toISOString().replace('Z','') : null,
        tiempoEstimadoHoras: form.tiempoEstimadoHoras ? parseInt(form.tiempoEstimadoHoras) : null,
        tecnicoId: form.tecnicoId || null,
      });
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 560 }}>

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f7f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FileText size={16} strokeWidth={2} style={{ color: '#262424' }} />
            </div>
            <h2>{tarea ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          </div>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alerta alerta-error">{error}</div>}

          {/* Título */}
          <div className="form-grupo">
            <label><FileText size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>Título *</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ej: Instalar servidor web" required />
          </div>

          {/* Descripción */}
          <div className="form-grupo">
            <label><AlignLeft size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Describe la tarea en detalle..." rows={3} style={{ resize: 'vertical' }} />
          </div>

          {/* Prioridad visual */}
          <div className="form-grupo">
            <label><Flag size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>Prioridad *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORIDADES.map(({ valor, label, color, bg }) => {
                const activo = form.prioridad === valor;
                return (
                  <button key={valor} type="button"
                    onClick={() => setForm({ ...form, prioridad: valor })}
                    style={{
                      flex: 1, padding: '8px 0',
                      border: `1.5px solid ${activo ? color : '#EEE5DA'}`,
                      borderRadius: 10, background: activo ? bg : '#fafaf9',
                      cursor: 'pointer', fontSize: 13,
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: activo ? 700 : 500,
                      color: activo ? color : '#6b6868',
                      transition: 'all 0.15s',
                    }}
                  >{label}</button>
                );
              })}
            </div>
          </div>

          {/* Técnico + Fecha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-grupo">
              <label><User size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>Técnico asignado</label>
              <select name="tecnicoId" value={form.tecnicoId} onChange={handleChange}>
                <option value="">Sin asignar</option>
                {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div className="form-grupo">
              <label><Calendar size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>Fecha límite *</label>
              <input name="fechaLimite" type="datetime-local" value={form.fechaLimite} onChange={handleChange} required />
            </div>
          </div>

          {/* Tiempo estimado */}
          <div className="form-grupo">
            <label><Clock size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>Tiempo estimado (horas)</label>
            <input name="tiempoEstimadoHoras" type="number" value={form.tiempoEstimadoHoras}
              onChange={handleChange} placeholder="Ej: 4" min="1" />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando
                ? <><Loader2 size={14} className="spin" /> Guardando...</>
                : tarea ? 'Actualizar tarea' : 'Crear tarea'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}