import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import GraficaEstados from '../components/dashboard/GraficaEstados';
import GraficaPrioridad from '../components/dashboard/GraficaPrioridad';
import {
  ClipboardList, Clock, Wrench, CheckCircle2, AlertTriangle,
  PauseCircle, Target, Timer, Flame, RefreshCw, TrendingUp,
  TrendingDown, Minus, Users, Activity,
} from 'lucide-react';
import '../styles/dashboard.css';

const METRICAS = [
  { key: 'totalTareas',       label: 'Total Tareas',   icon: ClipboardList, bg: '#f0edf8', iconColor: '#6c3fbf', bar: '#9b6fdf' },
  { key: 'tareasPendientes',  label: 'Pendientes',     icon: Clock,         bg: '#fef5e7', iconColor: '#c07a10', bar: '#f0a830' },
  { key: 'tareasEnProceso',   label: 'En Proceso',     icon: Wrench,        bg: '#e8f0fc', iconColor: '#2a5abf', bar: '#4a7de8' },
  { key: 'tareasFinalizadas', label: 'Finalizadas',    icon: CheckCircle2,  bg: '#e6f5ee', iconColor: '#1e8a50', bar: '#34c478' },
  { key: 'tareasVencidas',    label: 'Vencidas',       icon: AlertTriangle, bg: '#fdecea', iconColor: '#c0392b', bar: '#e85a4a' },
  { key: 'tareasEnEspera',    label: 'En Espera',      icon: PauseCircle,   bg: '#e8f4f8', iconColor: '#1a7a8a', bar: '#2aabb8' },
];

// Format current date/time
const ahora = new Intl.DateTimeFormat('es-CO', {
  weekday: 'short', day: 'numeric', month: 'short',
  hour: '2-digit', minute: '2-digit',
}).format(new Date());

export default function DashboardPage() {
  const [datos, setDatos]       = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => { cargarDashboard(); }, []);

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      const res = await api.get('/dashboard');
      setDatos(res.data);
    } catch {
      setError('Error al cargar el dashboard');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return (
    <div className="dash-loading">
      <RefreshCw size={18} className="spin-icon" />
      <span>Cargando métricas...</span>
    </div>
  );
  if (error) return <div className="alerta alerta-error">{error}</div>;
  if (!datos) return null;

  const total = datos.totalTareas || 1;

  return (
    <div className="dash-root">

      {/* ── HEADER — technical ── */}
      <div className="dash-header">
        <div className="dash-header-left">
          <h1 className="dash-title">
            Centro de control operativo
          </h1>
        </div>
        <div className="dash-header-right">
          <span className="dash-timestamp">
            <Clock size={11} strokeWidth={2} />
            Actualizado · {ahora}
          </span>
          <button className="dash-refresh-btn" onClick={cargarDashboard}>
            <RefreshCw size={13} strokeWidth={2.5} />
            Sincronizar
          </button>
        </div>
      </div>

      {/* ══ TWO-COLUMN BODY ══ */}
      <div className="dash-body">

        {/* ─── LEFT COLUMN ─── */}
        <div className="dash-left">

          {/* Métricas 3×2 */}
          <div className="dash-metrics-grid">
            {METRICAS.map(({ key, label, icon: Icon, bg, iconColor, bar }, i) => {
              const val = datos[key] ?? 0;
              const pct = Math.round((val / total) * 100);
              return (
                <div className="metric-card" key={key} style={{ animationDelay: `${i * 55}ms` }}>
                  <div className="metric-top">
                    <div className="metric-icon-wrap" style={{ background: bg }}>
                      <Icon size={15} strokeWidth={2} style={{ color: iconColor }} />
                    </div>
                    <span className="metric-pct">
                      {key === 'totalTareas' ? '100%' : `${pct}%`}
                    </span>
                  </div>
                  <div className="metric-val">{val}</div>
                  <div className="metric-label">{label}</div>
                  <div className="metric-bar-track">
                    <div
                      className="metric-bar-fill"
                      style={{ width: key === 'totalTareas' ? '100%' : `${pct}%`, background: bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPIs + Técnicos — side by side */}
          <div className="dash-left-bottom">

            {/* KPI Panel */}
            <div className="dash-kpi-panel">
              <h2 className="dash-section-title">Indicadores clave</h2>

              <div className="kpi-item">
                <div className="kpi-icon-wrap kpi-green"><Target size={15} strokeWidth={2} /></div>
                <div className="kpi-body">
                  <span className="kpi-val">{datos.porcentajeFinalizadasATiempo}%</span>
                  <span className="kpi-label">Finalizadas a tiempo</span>
                </div>
                <div className="kpi-trend kpi-trend-up"><TrendingUp size={12} /></div>
              </div>

              <div className="kpi-divider" />

              <div className="kpi-item">
                <div className="kpi-icon-wrap kpi-blue"><Timer size={15} strokeWidth={2} /></div>
                <div className="kpi-body">
                  <span className="kpi-val">{datos.tiempoPromedioResolucionHoras}h</span>
                  <span className="kpi-label">Tiempo prom. resolución</span>
                </div>
                <div className="kpi-trend kpi-trend-neutral"><Minus size={12} /></div>
              </div>

              <div className="kpi-divider" />

              <div className="kpi-item">
                <div className="kpi-icon-wrap kpi-red"><Flame size={15} strokeWidth={2} /></div>
                <div className="kpi-body">
                  <span className="kpi-val">{datos.tareasAltaPrioridad}</span>
                  <span className="kpi-label">Alta prioridad activas</span>
                </div>
                <div className="kpi-trend kpi-trend-down"><TrendingDown size={12} /></div>
              </div>

              <div className="kpi-progress-wrap">
                <div className="kpi-progress-header">
                  <span>Progreso global</span>
                  <span className="kpi-progress-pct">
                    {Math.round((datos.tareasFinalizadas / total) * 100)}%
                  </span>
                </div>
                <div className="kpi-progress-track">
                  <div
                    className="kpi-progress-fill"
                    style={{ width: `${Math.round((datos.tareasFinalizadas / total) * 100)}%` }}
                  />
                </div>
                <div className="kpi-progress-footer">
                  <span>{datos.tareasFinalizadas} finalizadas</span>
                  <span>{total} total</span>
                </div>
              </div>
            </div>

            {/* Técnicos */}
            {datos.tecnicosConMasTareas?.length > 0 && (
              <div className="dash-tecnicos-panel">
                <div className="dash-tecnicos-header">
                  <h2 className="dash-section-title">Técnicos activos</h2>
                  <Users size={13} strokeWidth={2} style={{ color: 'var(--text-soft)' }} />
                </div>
                <div className="dash-tecnicos-list">
                  {datos.tecnicosConMasTareas.map((t, i) => (
                    <div className="tecnico-row" key={t.tecnicoId}>
                      <span className="tecnico-rank">#{i + 1}</span>
                      <div className="tecnico-avatar">{t.tecnicoNombre?.charAt(0)}</div>
                      <div className="tecnico-info">
                        <span className="tecnico-nombre">{t.tecnicoNombre}</span>
                        <div className="tecnico-bar-track">
                          <div
                            className="tecnico-bar-fill"
                            style={{
                              width: `${Math.min(
                                (t.totalTareasActivas /
                                  (datos.tecnicosConMasTareas[0]?.totalTareasActivas || 1)) * 100,
                                100
                              )}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="tecnico-stats">
                        <span className="tecnico-activas">{t.totalTareasActivas}</span>
                        <span className="tecnico-fin">{t.totalTareasFinalizadas} fin.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ─── RIGHT COLUMN — charts ─── */}
        <div className="dash-right">

          <div className="dash-chart-wrap">
            <h2 className="dash-section-title">Tareas por estado</h2>
            <GraficaEstados datos={datos} />
          </div>

          <div className="dash-chart-wrap">
            <h2 className="dash-section-title">Distribución por prioridad</h2>
            <GraficaPrioridad datos={datos} />
          </div>

        </div>

      </div>
    </div>
  );
}