import {
  Pencil, ScrollText, User, Calendar, Clock,
  CheckCircle2, RefreshCw, AlertTriangle, Tag,
  TrendingUp, Timer, Trash2, Play
} from 'lucide-react';
import '../../styles/ticketCard.css';

export default function TicketCard({ ticket, onEditar, onCambiarEstado, onVerHistorial, onEliminar, soloLectura }) {

  const ESTADO_CONFIG = {
    PENDIENTE:  { label: 'Pendiente',  cls: 'tc-chip-pendiente',  dot: '#f59e0b' },
    EN_PROCESO: { label: 'En Proceso', cls: 'tc-chip-proceso',    dot: '#3b82f6' },
    FINALIZADA: { label: 'Finalizada', cls: 'tc-chip-finalizada', dot: '#22c55e' },
    EN_ESPERA:  { label: 'En Espera',  cls: 'tc-chip-espera',     dot: '#a855f7' },
  };

  const PRIORIDAD_CONFIG = {
    ALTA:  { label: 'Alta',  cls: 'tc-chip-alta'  },
    MEDIA: { label: 'Media', cls: 'tc-chip-media' },
    BAJA:  { label: 'Baja',  cls: 'tc-chip-baja'  },
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatFechaHora = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const estado    = ESTADO_CONFIG[ticket.estado]       || { label: ticket.estado,    cls: 'tc-chip' };
  const prioridad = PRIORIDAD_CONFIG[ticket.prioridad] || { label: ticket.prioridad, cls: 'tc-chip' };

  const slaVencido = ticket.slaVencido;
  const slaHorasRestantes = ticket.fechaLimiteSla
    ? Math.round((new Date(ticket.fechaLimiteSla) - new Date()) / 3600000)
    : null;
  const slaEnRiesgo = slaHorasRestantes !== null && slaHorasRestantes > 0 && slaHorasRestantes <= 2;

  const avance      = ticket.porcentajeAvance ?? 0;
  const avanceColor = avance >= 100 ? '#22c55e' : avance >= 50 ? '#3b82f6' : '#f59e0b';

  const iniciales = ticket.categoriaNombre
    ? ticket.categoriaNombre.slice(0, 2).toUpperCase()
    : null;

  return (
    <div className={`tc-card ${ticket.vencida ? 'tc-card-vencida' : ''} ${slaVencido ? 'tc-card-sla' : ''}`}>

      
      <div className="tc-row-top">
        <div
          className="tc-avatar"
          style={{ background: ticket.categoriaColor ? `${ticket.categoriaColor}15` : '#f0ece7' }}
        >
          {iniciales
            ? <span style={{ color: ticket.categoriaColor || '#6b6868' }}>{iniciales}</span>
            : <Tag size={15} strokeWidth={2} style={{ color: '#9b9898' }} />
          }
        </div>

        <div className="tc-header-info">
          <h3 className="tc-titulo">{ticket.titulo}</h3>
          {ticket.tecnicoNombre && (
            <p className="tc-subtitulo">
              <User size={11} strokeWidth={2} />
              {ticket.tecnicoNombre}
              {ticket.tecnicosIds?.length > 0 && (
                <span style={{ marginLeft: 4 }}>
                  · +{ticket.tecnicosIds.length} colab.
                </span>
              )}
            </p>
          )}
        </div>

        {!soloLectura && onEliminar && (
          <button className="tc-btn-icon tc-btn-danger"
            onClick={() => onEliminar(ticket.id)} title="Eliminar">
            <Trash2 size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      
      <div className="tc-chips-row">
        <span className={`tc-chip ${estado.cls}`}>
          <span className="tc-chip-dot" style={{ background: estado.dot }} />
          {estado.label}
        </span>
        <span className={`tc-chip ${prioridad.cls}`}>{prioridad.label}</span>
        {ticket.categoriaNombre && (
          <span className="tc-chip tc-chip-cat"
            style={{ color: ticket.categoriaColor || '#6b6868' }}>
            <Tag size={10} strokeWidth={2.5} />
            {ticket.categoriaNombre}
          </span>
        )}
        {ticket.vencida && (
          <span className="tc-chip tc-chip-alta">
            <AlertTriangle size={10} strokeWidth={2.5} /> Vencido
          </span>
        )}
        {slaVencido && !ticket.vencida && (
          <span className="tc-chip" style={{ background: '#fff7ed', color: '#c2410c' }}>
            <Timer size={10} strokeWidth={2.5} /> SLA vencido
          </span>
        )}
        {slaEnRiesgo && (
          <span className="tc-chip" style={{ background: '#fef3c7', color: '#92400e' }}>
            <Timer size={10} strokeWidth={2.5} /> {slaHorasRestantes}h restantes
          </span>
        )}
      </div>

    
      {ticket.descripcion && (
        <p className="tc-desc">{ticket.descripcion}</p>
      )}

      
      {ticket.estado !== 'FINALIZADA' && avance > 0 && (
        <div className="tc-avance-wrap">
          <div className="tc-avance-header">
            <span><TrendingUp size={10} strokeWidth={2.5} /> Avance</span>
            <span style={{ color: avanceColor }}>{avance}%</span>
          </div>
          <div className="tc-avance-track">
            <div className="tc-avance-fill"
              style={{ width: `${avance}%`, background: avanceColor }} />
          </div>
        </div>
      )}

      
      {ticket.etiquetas?.length > 0 && (
        <div className="tc-tags-row">
          {ticket.etiquetas.map(tag => (
            <span key={tag} className="tc-tag">{tag}</span>
          ))}
        </div>
      )}

      
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 5,
        padding: '8px 10px',
        background: '#f8fafc',
        borderRadius: 8,
        fontSize: 12,
      }}>
      
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
          <Calendar size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Creado:</span>
          <span>{formatFechaHora(ticket.fechaCreacion)}</span>
        </div>

        
        {ticket.fechaInicioProceso && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3b82f6' }}>
            <Play size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>Inicio:</span>
            <span>{formatFechaHora(ticket.fechaInicioProceso)}</span>
          </div>
        )}

        
        {ticket.estado === 'FINALIZADA' && ticket.tiempoRealHoras != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e' }}>
            <CheckCircle2 size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>Completado en:</span>
            <span style={{ fontWeight: 700 }}>{ticket.tiempoRealHoras}h</span>
          </div>
        )}
      </div>

  
      <div className="tc-divider" />

      
      <div className="tc-footer">
        <div className="tc-footer-left">
          <span className="tc-fecha">
            <Clock size={11} strokeWidth={2} />
            Límite: {formatFecha(ticket.fechaLimite)}
          </span>
        </div>

        <div className="tc-footer-right">
          {!soloLectura && (
            <div className="tc-acciones">
              {ticket.estado !== 'FINALIZADA' && (
                <button className="tc-btn-accion tc-btn-estado"
                  onClick={() => onCambiarEstado(ticket)} title="Cambiar estado">
                  <RefreshCw size={12} strokeWidth={2.5} />
                </button>
              )}
              <button className="tc-btn-accion"
                onClick={() => onEditar(ticket)} title="Editar">
                <Pencil size={12} strokeWidth={2} />
              </button>
              <button className="tc-btn-accion"
                onClick={() => onVerHistorial(ticket.id)} title="Ver historial">
                <ScrollText size={12} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>


      {soloLectura && ticket.estado !== 'FINALIZADA' && (
        <button className="tc-btn-cambio-estado" onClick={() => onCambiarEstado(ticket)}>
          <RefreshCw size={13} strokeWidth={2.5} />
          Cambiar estado
        </button>
      )}

    </div>
  );
}