import { Pencil, ScrollText, User, Calendar, Clock, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function TareaCard({ tarea, onEditar, onCambiarEstado, onVerHistorial, soloLectura }) {

  const ESTADO_CONFIG = {
    PENDIENTE:  { label: 'Pendiente',  cls: 'badge-pendiente',  dot: '#f59e0b' },
    EN_PROCESO: { label: 'En Proceso', cls: 'badge-en-proceso', dot: '#3b82f6' },
    FINALIZADA: { label: 'Finalizada', cls: 'badge-finalizada', dot: '#22c55e' },
    EN_ESPERA:  { label: 'En Espera',  cls: 'badge-en-espera',  dot: '#a855f7' },
  };

  const PRIORIDAD_CONFIG = {
    ALTA:  { label: 'Alta',  cls: 'badge-alta'  },
    MEDIA: { label: 'Media', cls: 'badge-media' },
    BAJA:  { label: 'Baja',  cls: 'badge-baja'  },
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const estado    = ESTADO_CONFIG[tarea.estado]    || { label: tarea.estado,    cls: 'badge' };
  const prioridad = PRIORIDAD_CONFIG[tarea.prioridad] || { label: tarea.prioridad, cls: 'badge' };

  return (
    <div className={`tarea-card ${tarea.vencida ? 'tarea-vencida' : ''}`}>

      {/* Header */}
      <div className="tarea-card-header">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Dot + estado */}
          <span className={`badge ${estado.cls}`}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: estado.dot, display: 'inline-block', marginRight: 5, flexShrink: 0
            }}/>
            {estado.label}
          </span>
          <span className={`badge ${prioridad.cls}`}>{prioridad.label}</span>
          {tarea.vencida && (
            <span className="badge badge-alta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={10} strokeWidth={2.5} /> Vencida
            </span>
          )}
        </div>

        {!soloLectura && (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              className="tarea-icon-btn"
              onClick={() => onEditar(tarea)}
              title="Editar"
            >
              <Pencil size={13} strokeWidth={2} />
            </button>
            <button
              className="tarea-icon-btn"
              onClick={() => onVerHistorial(tarea.id)}
              title="Ver historial"
            >
              <ScrollText size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Título */}
      <h3 className="tarea-card-titulo">{tarea.titulo}</h3>

      {/* Descripción */}
      {tarea.descripcion && (
        <p className="tarea-card-desc">{tarea.descripcion}</p>
      )}

      {/* Info chips */}
      <div className="tarea-card-info">
        {tarea.tecnicoNombre && (
          <span><User size={10} strokeWidth={2.5} style={{ marginRight: 4, verticalAlign: 'middle' }} />{tarea.tecnicoNombre}</span>
        )}
        <span><Calendar size={10} strokeWidth={2.5} style={{ marginRight: 4, verticalAlign: 'middle' }} />{formatFecha(tarea.fechaLimite)}</span>
        {tarea.tiempoEstimadoHoras && (
          <span><Clock size={10} strokeWidth={2.5} style={{ marginRight: 4, verticalAlign: 'middle' }} />{tarea.tiempoEstimadoHoras}h est.</span>
        )}
        {tarea.tiempoRealHoras != null && (
          <span><CheckCircle2 size={10} strokeWidth={2.5} style={{ marginRight: 4, verticalAlign: 'middle' }} />{tarea.tiempoRealHoras}h real</span>
        )}
      </div>

      {/* Botón cambiar estado */}
      {tarea.estado !== 'FINALIZADA' && (
        <button
          className="tarea-estado-btn"
          onClick={() => onCambiarEstado(tarea)}
        >
          <RefreshCw size={13} strokeWidth={2.5} />
          Cambiar estado
        </button>
      )}

    </div>
  );
}