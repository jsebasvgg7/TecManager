import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, PlusCircle, Pencil, ArrowRightLeft, UserCheck, Pin, RefreshCw, User, Clock } from 'lucide-react';
import '../styles/historial.css';

const ACCIONES = {
  CREACION:      { icon: PlusCircle,      color: '#22c55e', label: 'Creación'          },
  EDICION:       { icon: Pencil,          color: '#3b82f6', label: 'Edición'           },
  CAMBIO_ESTADO: { icon: ArrowRightLeft,  color: '#f59e0b', label: 'Cambio de estado'  },
  REASIGNACION:  { icon: UserCheck,       color: '#8b5cf6', label: 'Reasignación'      },
};

export default function HistorialPage() {
  const { tareaId } = useParams();
  const navigate    = useNavigate();

  const [historial,    setHistorial]    = useState([]);
  const [reportes,     setReportes]     = useState([]);
  const [tarea,        setTarea]        = useState(null);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState('');
  const [vistaActiva,  setVistaActiva]  = useState('historial');

  useEffect(() => { cargarDatos(); }, [tareaId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const tareaRes = await api.get(`/tareas/${tareaId}`);
      setTarea(tareaRes.data);

    try {
      const historialRes = await api.get(`/historial/tarea/${tareaId}`);
      setHistorial(historialRes.data || []);
    } catch {
      setHistorial([]);
    }

    // Reportes — opcional, puede estar vacío
    try {
      const reportesRes = await api.get(`/reportes/tarea/${tareaId}`);
      setReportes(reportesRes.data || []);
    } catch {
      setReportes([]);
    }

  } catch {
    setError('Error al cargar los datos de la tarea');
  } finally {
    setCargando(false);
  }
  };

  const fmt = (fecha) => fecha
    ? new Date(fecha).toLocaleString('es-CO', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
    : '—';

  if (cargando) return (
    <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando historial...</div>
  );

  return (
    <div className="contenedor">

      {/* Header */}
      <div className="page-header">
        <div>
          <button className="dash-refresh-btn" style={{ marginBottom:10 }} onClick={() => navigate('/tareas')}>
            <ArrowLeft size={13} strokeWidth={2.5} /> Volver a Tareas
          </button>
          <p className="dash-eyebrow">Trazabilidad</p>
          <h1>Historial de tarea</h1>
          {tarea && <p className="texto-suave" style={{ marginTop:3 }}>{tarea.titulo}</p>}
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}

      {/* Info tarea */}
      {tarea && (
        <div className="card hist-info-card">
          <div className="tarea-info-grid">
            {[
              { label: 'Estado',    val: <span className={`badge badge-${tarea.estado?.toLowerCase().replace('_','-')}`}>{tarea.estado?.replace('_',' ')}</span> },
              { label: 'Prioridad', val: <span className={`badge badge-${tarea.prioridad?.toLowerCase()}`}>{tarea.prioridad}</span> },
              { label: 'Técnico',   val: tarea.tecnicoNombre || '—' },
              { label: 'Est. (h)',  val: tarea.tiempoEstimadoHoras ? `${tarea.tiempoEstimadoHoras}h` : '—' },
              { label: 'Real (h)',  val: tarea.tiempoRealHoras != null ? `${tarea.tiempoRealHoras}h` : '—' },
              { label: 'Límite',   val: fmt(tarea.fechaLimite) },
            ].map(({ label, val }) => (
              <div className="tarea-info-item" key={label}>
                <span className="tarea-info-label">{label}</span>
                <span style={{ fontSize:13.5, color:'#262424', fontWeight:600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hist-tabs">
        {[
          { key:'historial', label:'Historial de cambios', count: historial.length },
          { key:'reportes',  label:'Reportes',             count: reportes.length  },
        ].map(({ key, label, count }) => (
          <button key={key}
            className={`hist-tab ${vistaActiva === key ? 'activo' : ''}`}
            onClick={() => setVistaActiva(key)}
          >
            {label}
            <span className="hist-tab-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Timeline historial */}
      {vistaActiva === 'historial' && (
        <div className="timeline">
          {!historial.length
            ? <div className="vacio">No hay cambios registrados</div>
            : historial.map((cambio, i) => {
                const cfg = ACCIONES[cambio.accion] || { icon: Pin, color:'#6b6868', label: cambio.accion };
                const Icon = cfg.icon;
                return (
                  <div key={cambio.id || i} className="timeline-item">
                    <div className="timeline-icono" style={{ background:`${cfg.color}18`, color: cfg.color }}>
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <div className="timeline-contenido">
                      <div className="timeline-header">
                        <span className="timeline-accion">{cfg.label}</span>
                        <span className="timeline-fecha">{fmt(cambio.fecha)}</span>
                      </div>
                      {(cambio.valorAnterior || cambio.valorNuevo) && (
                        <div className="timeline-cambio">
                          {cambio.valorAnterior && <span className="cambio-anterior">{cambio.valorAnterior}</span>}
                          {cambio.valorAnterior && cambio.valorNuevo && <span style={{ color:'#9b9898' }}>→</span>}
                          {cambio.valorNuevo    && <span className="cambio-nuevo">{cambio.valorNuevo}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {/* Reportes */}
      {vistaActiva === 'reportes' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {!reportes.length
            ? <div className="vacio">No hay reportes para esta tarea</div>
            : reportes.map((rep, i) => (
                <div key={rep.id || i} className="card reporte-card">
                  <div className="reporte-header">
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="reporte-avatar">{rep.tecnicoNombre?.charAt(0)}</div>
                      <div>
                        <div style={{ fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:14 }}>
                          {rep.tecnicoNombre || 'Técnico'}
                        </div>
                        <div style={{ fontSize:12, color:'#6b6868', display:'flex', alignItems:'center', gap:4 }}>
                          <Clock size={11} strokeWidth={2} />{fmt(rep.fecha)}
                        </div>
                      </div>
                    </div>
                    {rep.estadoFinal && (
                      <span className={`badge badge-${rep.estadoFinal?.toLowerCase().replace('_','-')}`}>
                        {rep.estadoFinal?.replace('_',' ')}
                      </span>
                    )}
                  </div>
                  <p className="reporte-comentario">{rep.comentario}</p>
                </div>
              ))
          }
        </div>
      )}

    </div>
  );
}