import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import GraficaEstados from '../components/dashboard/GraficaEstados';
import GraficaPrioridad from '../components/dashboard/GraficaPrioridad';
import {
  ClipboardList, Clock, Wrench, CheckCircle2, AlertTriangle,
  PauseCircle, Target, Timer, Flame, RefreshCw, TrendingUp,
  TrendingDown, Minus, Users
} from 'lucide-react';
import '../styles/dashboard.css';

const METRICAS = [
  { key: 'totalTareas',       label: 'Total Tareas',   icon: ClipboardList, color: 'neutral' },
  { key: 'tareasPendientes',  label: 'Pendientes',     icon: Clock,         color: 'amber'   },
  { key: 'tareasEnProceso',   label: 'En Proceso',     icon: Wrench,        color: 'blue'    },
  { key: 'tareasFinalizadas', label: 'Finalizadas',    icon: CheckCircle2,  color: 'green'   },
  { key: 'tareasVencidas',    label: 'Vencidas',       icon: AlertTriangle, color: 'red'     },
  { key: 'tareasEnEspera',    label: 'En Espera',      icon: PauseCircle,   color: 'purple'  },
];

const COLOR_MAP = {
  neutral: { bg: '#f7f4f0', icon: '#3a3737', accent: '#262424', bar: '#d9cfc4' },
  amber:   { bg: '#fffbeb', icon: '#d97706', accent: '#92400e', bar: '#fcd34d' },
  blue:    { bg: '#eff6ff', icon: '#3b82f6', accent: '#1e40af', bar: '#93c5fd' },
  green:   { bg: '#f0fdf4', icon: '#22c55e', accent: '#166534', bar: '#86efac' },
  red:     { bg: '#fff1f2', icon: '#ef4444', accent: '#991b1b', bar: '#fca5a5' },
  purple:  { bg: '#faf5ff', icon: '#a855f7', accent: '#6b21a8', bar: '#d8b4fe' },
};

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
      <RefreshCw size={22} className="spin-icon" />
      <span>Cargando métricas...</span>
    </div>
  );
  if (error) return <div className="alerta alerta-error">{error}</div>;
  if (!datos) return null;

  const total = datos.totalTareas || 1;

  return (
    <div className="dash-root">

      {/* ── HEADER ── */}
      <div className="dash-header">
        <div>
          <p className="dash-eyebrow">Resumen general</p>
          <h1 className="dash-title">Dashboard</h1>
        </div>
        <button className="dash-refresh-btn" onClick={cargarDashboard}>
          <RefreshCw size={14} strokeWidth={2.5} />
          Actualizar
        </button>
      </div>

      {/* ── MÉTRICAS PRINCIPALES ── */}
      <div className="dash-metrics-grid">
        {METRICAS.map(({ key, label, icon: Icon, color }, i) => {
          const val = datos[key] ?? 0;
          const pct = Math.round((val / total) * 100);
          const c   = COLOR_MAP[color];
          return (
            <div className="metric-card" key={key} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="metric-top">
                <div className="metric-icon-wrap" style={{ background: c.bg }}>
                  <Icon size={18} strokeWidth={2} style={{ color: c.icon }} />
                </div>
                <span className="metric-pct" style={{ color: c.icon }}>
                  {key === 'totalTareas' ? '100%' : `${pct}%`}
                </span>
              </div>
              <div className="metric-val" style={{ color: c.accent }}>{val}</div>
              <div className="metric-label">{label}</div>
              <div className="metric-bar-track">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: key === 'totalTareas' ? '100%' : `${pct}%`,
                    background: c.bar,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FILA MEDIA: KPIs + GRÁFICA ESTADOS ── */}
      <div className="dash-mid-row">

        {/* KPI Panel */}
        <div className="dash-kpi-panel">
          <h2 className="dash-section-title">Indicadores clave</h2>

          <div className="kpi-item">
            <div className="kpi-icon-wrap kpi-green">
              <Target size={17} strokeWidth={2} />
            </div>
            <div className="kpi-body">
              <span className="kpi-val">{datos.porcentajeFinalizadasATiempo}%</span>
              <span className="kpi-label">Finalizadas a tiempo</span>
            </div>
            <div className="kpi-trend kpi-trend-up">
              <TrendingUp size={14} />
            </div>
          </div>

          <div className="kpi-divider" />

          <div className="kpi-item">
            <div className="kpi-icon-wrap kpi-blue">
              <Timer size={17} strokeWidth={2} />
            </div>
            <div className="kpi-body">
              <span className="kpi-val">{datos.tiempoPromedioResolucionHoras}h</span>
              <span className="kpi-label">Tiempo promedio de resolución</span>
            </div>
            <div className="kpi-trend kpi-trend-neutral">
              <Minus size={14} />
            </div>
          </div>

          <div className="kpi-divider" />

          <div className="kpi-item">
            <div className="kpi-icon-wrap kpi-red">
              <Flame size={17} strokeWidth={2} />
            </div>
            <div className="kpi-body">
              <span className="kpi-val">{datos.tareasAltaPrioridad}</span>
              <span className="kpi-label">Alta prioridad activas</span>
            </div>
            <div className="kpi-trend kpi-trend-down">
              <TrendingDown size={14} />
            </div>
          </div>

          {/* Mini progreso finalización */}
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

        {/* Gráfica estados */}
        <div className="dash-chart-wrap">
          <h2 className="dash-section-title">Tareas por estado</h2>
          <GraficaEstados datos={datos} />
        </div>

      </div>

      {/* ── FILA BAJA: PRIORIDAD + TÉCNICOS ── */}
      <div className="dash-bottom-row">

        {/* Gráfica prioridad */}
        <div className="dash-chart-wrap">
          <h2 className="dash-section-title">Distribución por prioridad</h2>
          <GraficaPrioridad datos={datos} />
        </div>

        {/* Ranking técnicos */}
        {datos.tecnicosConMasTareas?.length > 0 && (
          <div className="dash-tecnicos-panel">
            <div className="dash-tecnicos-header">
              <h2 className="dash-section-title">Técnicos activos</h2>
              <Users size={16} strokeWidth={2} style={{ color: '#3a3737' }} />
            </div>
            <div className="dash-tecnicos-list">
              {datos.tecnicosConMasTareas.map((t, i) => (
                <div className="tecnico-row" key={t.tecnicoId}>
                  <span className="tecnico-rank">#{i + 1}</span>
                  <div className="tecnico-avatar">
                    {t.tecnicoNombre?.charAt(0)}
                  </div>
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
  );
}