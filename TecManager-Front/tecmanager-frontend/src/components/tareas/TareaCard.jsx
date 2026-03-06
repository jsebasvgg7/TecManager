export default function TareaCard({ tarea, onEditar, onCambiarEstado, onVerHistorial, soloLectura }) {

  const getBadgeEstado = (estado) => {
    const clases = {
      PENDIENTE:  'badge badge-pendiente',
      EN_PROCESO: 'badge badge-en-proceso',
      FINALIZADA: 'badge badge-finalizada',
      EN_ESPERA:  'badge badge-en-espera',
    };
    return clases[estado] || 'badge';
  };

  const getBadgePrioridad = (prioridad) => {
    const clases = {
      ALTA:  'badge badge-alta',
      MEDIA: 'badge badge-media',
      BAJA:  'badge badge-baja',
    };
    return clases[prioridad] || 'badge';
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className={`tarea-card ${tarea.vencida ? 'tarea-vencida' : ''}`}>

      {/* Header de la card */}
      <div className="tarea-card-header">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className={getBadgeEstado(tarea.estado)}>{tarea.estado?.replace('_', ' ')}</span>
          <span className={getBadgePrioridad(tarea.prioridad)}>{tarea.prioridad}</span>
          {tarea.vencida && <span className="badge badge-alta">⚠️ VENCIDA</span>}
        </div>
        {!soloLectura && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn btn-secundario"
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={() => onEditar(tarea)}
            >
              ✏️
            </button>
            <button
              className="btn btn-secundario"
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={() => onVerHistorial(tarea.id)}
            >
              📜
            </button>
          </div>
        )}
      </div>

      {/* Título y descripción */}
      <h3 className="tarea-card-titulo">{tarea.titulo}</h3>
      {tarea.descripcion && (
        <p className="tarea-card-desc">{tarea.descripcion}</p>
      )}

      {/* Info */}
      <div className="tarea-card-info">
        {tarea.tecnicoNombre && (
          <span>👨‍🔧 {tarea.tecnicoNombre}</span>
        )}
        <span>📅 {formatFecha(tarea.fechaLimite)}</span>
        {tarea.tiempoEstimadoHoras && (
          <span>⏱️ {tarea.tiempoEstimadoHoras}h estimadas</span>
        )}
        {tarea.tiempoRealHoras != null && (
          <span>✅ {tarea.tiempoRealHoras}h reales</span>
        )}
      </div>

      {/* Botón cambiar estado */}
      {tarea.estado !== 'FINALIZADA' && (
        <button
          className="btn btn-primario"
          style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          onClick={() => onCambiarEstado(tarea)}
        >
          🔄 Cambiar Estado
        </button>
      )}

    </div>
  );
}