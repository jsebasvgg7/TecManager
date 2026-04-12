import {
  Pencil, ScrollText, User, Calendar, Clock,
  CheckCircle2, RefreshCw, AlertTriangle, Tag,
  Users, TrendingUp, Timer, Trash2
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

 const formatFechaCompleta = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
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

      {/* ── 1. AVATAR + TÍTULO + BOTÓN ELIMINAR ── */}
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
          <button className="tc-btn-icon tc-btn-danger" onClick={() => onEliminar(ticket.id)} title="Eliminar">
            <Trash2 size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* ── 2. CHIPS: estado · prioridad · categoría · alertas ── */}
      <div className="tc-chips-row">
        <span className={`tc-chip ${estado.cls}`}>
          <span className="tc-chip-dot" style={{ background: estado.dot }} />
          {estado.label}
        </span>
        <span className={`tc-chip ${prioridad.cls}`}>{prioridad.label}</span>
        {ticket.categoriaNombre && (
          <span
            className="tc-chip tc-chip-cat"
            style={{ color: ticket.categoriaColor || '#6b6868' }}
          >
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

      {/* ── 3. DESCRIPCIÓN ── */}
      {ticket.descripcion && (
        <p className="tc-desc">{ticket.descripcion}</p>
      )}

      {/* ── 4. BARRA DE AVANCE ── */}
      {ticket.estado !== 'FINALIZADA' && avance > 0 && (
        <div className="tc-avance-wrap">
          <div className="tc-avance-header">
            <span><TrendingUp size={10} strokeWidth={2.5} /> Avance</span>
            <span style={{ color: avanceColor }}>{avance}%</span>
          </div>
          <div className="tc-avance-track">
            <div className="tc-avance-fill" style={{ width: `${avance}%`, background: avanceColor }} />
          </div>
        </div>
      )}

      {/* ── ETIQUETAS ── */}
      {ticket.etiquetas?.length > 0 && (
        <div className="tc-tags-row">
          {ticket.etiquetas.map(tag => (
            <span key={tag} className="tc-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* ── DIVISOR ── */}
      <div className="tc-divider" />

      {/* ── 5. FOOTER: tiempo (izq) · fecha + acciones (der) ── */}
      <div className="tc-footer">

        <div className="tc-footer-left">
          {ticket.tiempoEstimadoHoras && (
            <span className="tc-tiempo">
              <Clock size={12} strokeWidth={2} />
              {ticket.tiempoEstimadoHoras}h est.
            </span>
          )}
          
        </div>

        <div className="tc-footer-right">
          <span className="tc-fecha">
            <Calendar size={11} strokeWidth={2} />
            {formatFechaCompleta(ticket.fechaLimite)}
          </span>

          {!soloLectura && (
            <div className="tc-acciones">
              {ticket.estado !== 'FINALIZADA' && (
                <button className="tc-btn-accion tc-btn-estado" onClick={() => onCambiarEstado(ticket)} title="Cambiar estado">
                  <RefreshCw size={12} strokeWidth={2.5} />
                </button>
              )}
              <button className="tc-btn-accion" onClick={() => onEditar(ticket)} title="Editar">
                <Pencil size={12} strokeWidth={2} />
              </button>
              <button className="tc-btn-accion" onClick={() => onVerHistorial(ticket.id)} title="Ver historial">
                <ScrollText size={12} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botón cambiar estado para TECNICO */}
      {soloLectura && ticket.estado !== 'FINALIZADA' && (
        <button className="tc-btn-cambio-estado" onClick={() => onCambiarEstado(ticket)}>
          <RefreshCw size={13} strokeWidth={2.5} />
          Cambiar estado
        </button>
      )}

    </div>
  );
}