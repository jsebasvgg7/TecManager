import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../styles/historial.css';

const ACCIONES = {
  CREACION:      { icono: '✅', color: '#22c55e', label: 'Creación' },
  EDICION:       { icono: '✏️', color: '#3b82f6', label: 'Edición' },
  CAMBIO_ESTADO: { icono: '🔄', color: '#f59e0b', label: 'Cambio de Estado' },
  REASIGNACION:  { icono: '👤', color: '#8b5cf6', label: 'Reasignación' },
};

export default function HistorialPage() {
  const { tareaId } = useParams();
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [tarea, setTarea] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [vistaActiva, setVistaActiva] = useState('historial');

  useEffect(() => {
    cargarDatos();
  }, [tareaId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [historialRes, reportesRes, tareaRes] = await Promise.all([
        api.get(`/historial/tarea/${tareaId}`),
        api.get(`/reportes/tarea/${tareaId}`),
        api.get(`/tareas/${tareaId}`),
      ]);
      setHistorial(historialRes.data);
      setReportes(reportesRes.data);
      setTarea(tareaRes.data);
    } catch {
      setError('Error al cargar el historial');
    } finally {
      setCargando(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (cargando) return <div className="cargando">⏳ Cargando historial...</div>;

  return (
    <div className="contenedor">

      {/* Header */}
      <div className="page-header">
        <div>
          <button
            className="btn btn-secundario"
            style={{ marginBottom: '8px', fontSize: '13px' }}
            onClick={() => navigate('/tareas')}
          >
            ← Volver a Tareas
          </button>
          <h1>📜 Historial de Tarea</h1>
          {tarea && (
            <p className="texto-suave" style={{ marginTop: '4px' }}>
              {tarea.titulo}
            </p>
          )}
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}

      {/* Info de la tarea */}
      {tarea && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="tarea-info-grid">
            <div className="tarea-info-item">
              <span className="tarea-info-label">Estado</span>
              <span className={`badge badge-${tarea.estado?.toLowerCase().replace('_', '-')}`}>
                {tarea.estado?.replace('_', ' ')}
              </span>
            </div>
            <div className="tarea-info-item">
              <span className="tarea-info-label">Prioridad</span>
              <span className={`badge badge-${tarea.prioridad?.toLowerCase()}`}>
                {tarea.prioridad}
              </span>
            </div>
            <div className="tarea-info-item">
              <span className="tarea-info-label">Técnico</span>
              <span>{tarea.tecnicoNombre || '—'}</span>
            </div>
            <div className="tarea-info-item">
              <span className="tarea-info-label">Tiempo estimado</span>
              <span>{tarea.tiempoEstimadoHoras ? `${tarea.tiempoEstimadoHoras}h` : '—'}</span>
            </div>
            <div className="tarea-info-item">
              <span className="tarea-info-label">Tiempo real</span>
              <span>{tarea.tiempoRealHoras != null ? `${tarea.tiempoRealHoras}h` : '—'}</span>
            </div>
            <div className="tarea-info-item">
              <span className="tarea-info-label">Fecha límite</span>
              <span>{formatFecha(tarea.fechaLimite)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs — Historial / Reportes */}
      <div className="tabs">
        <button
          className={`tab ${vistaActiva === 'historial' ? 'tab-activo' : ''}`}
          onClick={() => setVistaActiva('historial')}
        >
          📋 Historial de Cambios
          <span className="tab-badge">{historial.length}</span>
        </button>
        <button
          className={`tab ${vistaActiva === 'reportes' ? 'tab-activo' : ''}`}
          onClick={() => setVistaActiva('reportes')}
        >
          📝 Reportes
          <span className="tab-badge">{reportes.length}</span>
        </button>
      </div>

      {/* Vista Historial */}
      {vistaActiva === 'historial' && (
        <div className="timeline">
          {historial.length === 0 ? (
            <div className="vacio">No hay cambios registrados</div>
          ) : (
            historial.map((cambio, index) => {
              const accion = ACCIONES[cambio.accion] || {
                icono: '📌', color: '#64748b', label: cambio.accion
              };
              return (
                <div key={cambio.id || index} className="timeline-item">
                  <div
                    className="timeline-icono"
                    style={{ background: `${accion.color}20`, color: accion.color }}
                  >
                    {accion.icono}
                  </div>
                  <div className="timeline-contenido">
                    <div className="timeline-header">
                      <span className="timeline-accion">{accion.label}</span>
                      <span className="timeline-fecha">{formatFecha(cambio.fecha)}</span>
                    </div>
                    {(cambio.valorAnterior || cambio.valorNuevo) && (
                      <div className="timeline-cambio">
                        {cambio.valorAnterior && (
                          <span className="cambio-anterior">
                            {cambio.valorAnterior}
                          </span>
                        )}
                        {cambio.valorAnterior && cambio.valorNuevo && (
                          <span style={{ color: '#94a3b8' }}>→</span>
                        )}
                        {cambio.valorNuevo && (
                          <span className="cambio-nuevo">
                            {cambio.valorNuevo}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vista Reportes */}
      {vistaActiva === 'reportes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reportes.length === 0 ? (
            <div className="vacio">No hay reportes para esta tarea</div>
          ) : (
            reportes.map((reporte, index) => (
              <div key={reporte.id || index} className="card reporte-card">
                <div className="reporte-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="reporte-avatar">
                      {reporte.tecnicoNombre?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {reporte.tecnicoNombre || 'Técnico'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {formatFecha(reporte.fecha)}
                      </div>
                    </div>
                  </div>
                  {reporte.estadoFinal && (
                    <span className={`badge badge-${reporte.estadoFinal?.toLowerCase().replace('_', '-')}`}>
                      {reporte.estadoFinal?.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <p className="reporte-comentario">{reporte.comentario}</p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}