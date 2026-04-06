import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import GraficaEstados from '../components/dashboard/GraficaEstados';
import GraficaPrioridad from '../components/dashboard/GraficaPrioridad';
import {
  ClipboardList, Clock, CheckCircle2, AlertTriangle,
  RefreshCw, TrendingUp, TrendingDown, Minus,
  Target, Timer, Flame, Users, Activity,
  ArrowUpRight, ArrowDownRight, Zap, Shield,
  BarChart2, PieChart,
} from 'lucide-react';
import '../styles/dashboard.css';

const STATS = [
  { key: 'totalTareas',       label: 'Total de tareas', icon: ClipboardList, accent: '#5a7de8', bg: '#eef1fc', trend: null },
  { key: 'tareasPendientes',  label: 'Pendientes',      icon: Clock,         accent: '#d4a428', bg: '#fdf5e0', trend: 'neutral' },
  { key: 'tareasFinalizadas', label: 'Finalizadas',     icon: CheckCircle2,  accent: '#2eaa68', bg: '#e4f5ed', trend: 'up' },
  { key: 'tareasVencidas',    label: 'Vencidas',        icon: AlertTriangle, accent: '#d95f50', bg: '#faeceb', trend: 'down' },
];

const TREND_ICON = {
  up:      { icon: ArrowUpRight,   color: '#2eaa68', bg: '#e4f5ed' },
  down:    { icon: ArrowDownRight, color: '#d95f50', bg: '#faeceb' },
  neutral: { icon: Minus,          color: '#9c9790', bg: '#f0ece6' },
};

const ahora = new Intl.DateTimeFormat('es-CO', {
  weekday: 'short', day: 'numeric', month: 'short',
  hour: '2-digit', minute: '2-digit',
}).format(new Date());

export default function DashboardPage() {
  const navigate = useNavigate();
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
      <RefreshCw size={16} className="spin-icon" />
      <span>Cargando métricas…</span>
    </div>
  );
  if (error) return <div className="alerta alerta-error">{error}</div>;
  if (!datos) return null;

  const total     = datos.totalTareas || 1;
  const globalPct = Math.round((datos.tareasFinalizadas / total) * 100);

  return (
    <div className="dash-root">

      <div className="dash-header">
        <div className="dash-header-left">
          <span className="dash-eyebrow">Panel operativo</span>
          <h1 className="dash-title">Centro de control</h1>
        </div>
        <div className="dash-header-right">
          <span className="dash-timestamp">
            <Clock size={11} strokeWidth={2} />
            {ahora}
          </span>
          <button className="dash-refresh-btn" onClick={cargarDashboard}>
            <RefreshCw size={12} strokeWidth={2.5} />
            Sincronizar
          </button>
        </div>
      </div>

      <div className="dash-container">
        <div className="dash-container-header">
          <ClipboardList size={12} strokeWidth={2.5} />
          <span>Estadísticas</span>
        </div>
        <div className="dash-stats-row">
          {STATS.map(({ key, label, icon: Icon, accent, bg, trend }, i) => {
            const val = datos[key] ?? 0;
            const pct = key === 'totalTareas' ? 100 : Math.round((val / total) * 100);
            const T   = trend ? TREND_ICON[trend] : null;
            return (
              <div className="stat-card" key={key} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="stat-card-top">
                  <div className="stat-icon-wrap" style={{ background: bg }}>
                    <Icon size={15} strokeWidth={2} style={{ color: accent }} />
                  </div>
                  {T && (
                    <div className="stat-trend-badge" style={{ background: T.bg }}>
                      <T.icon size={12} strokeWidth={2.2} style={{ color: T.color }} />
                    </div>
                  )}
                </div>
                <div className="stat-val">{val}</div>
                <div className="stat-label">{label}</div>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill" style={{ width: `${pct}%`, background: accent }} />
                </div>
                <div className="stat-pct">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dash-container">
        <div className="dash-container-header">
          <Activity size={12} strokeWidth={2.5} />
          <span>Paneles</span>
        </div>
        <div className="dash-panels-grid">

          <div className="dash-panel">
            <div className="dash-panel-header">
              <span className="dash-panel-title">Estado operacional</span>
              <Shield size={13} style={{ color: '#9c9790' }} />
            </div>
            <div className="dash-alert-inner">
              <div className="dash-alert-icon-wrap">
                <Shield size={20} strokeWidth={1.5} />
              </div>
              <span className="dash-alert-title">
                {datos.tareasVencidas > 0 ? 'Requiere atención' : 'Todo en orden'}
              </span>
              <span className="dash-alert-desc">
                {datos.tareasVencidas > 0
                  ? `${datos.tareasVencidas} tarea${datos.tareasVencidas !== 1 ? 's' : ''} vencida${datos.tareasVencidas !== 1 ? 's' : ''} pendiente${datos.tareasVencidas !== 1 ? 's' : ''} de revisión.`
                  : 'Sin tareas vencidas. Todo en orden.'}
              </span>
              <button
                className={`dash-alert-btn ${datos.tareasVencidas > 0 ? 'dash-alert-btn-warn' : 'dash-alert-btn-ok'}`}
                onClick={() => navigate('/tareas')}
              >
                {datos.tareasVencidas > 0 ? 'Revisar ahora' : 'Ver tareas'}
              </button>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-header">
              <span className="dash-panel-title">Indicadores clave</span>
              <Activity size={13} style={{ color: '#9c9790' }} />
            </div>
            <div className="kpi-stack">
              <div className="kpi-row">
                <div className="kpi-icon kpi-green"><Target size={14} strokeWidth={2} /></div>
                <div className="kpi-body">
                  <span className="kpi-val">{datos.porcentajeFinalizadasATiempo}%</span>
                  <span className="kpi-lbl">Finalizadas a tiempo</span>
                </div>
                <TrendingUp size={13} style={{ color: '#2eaa68', flexShrink: 0 }} />
              </div>
              <div className="kpi-sep" />
              <div className="kpi-row">
                <div className="kpi-icon kpi-blue"><Timer size={14} strokeWidth={2} /></div>
                <div className="kpi-body">
                  <span className="kpi-val">{datos.tiempoPromedioResolucionHoras}h</span>
                  <span className="kpi-lbl">Resolución promedio</span>
                </div>
                <Minus size={13} style={{ color: '#9c9790', flexShrink: 0 }} />
              </div>
              <div className="kpi-sep" />
              <div className="kpi-row">
                <div className="kpi-icon kpi-red"><Flame size={14} strokeWidth={2} /></div>
                <div className="kpi-body">
                  <span className="kpi-val">{datos.tareasAltaPrioridad}</span>
                  <span className="kpi-lbl">Alta prioridad activas</span>
                </div>
                <TrendingDown size={13} style={{ color: '#d95f50', flexShrink: 0 }} />
              </div>
            </div>
            <div className="kpi-progress-block">
              <div className="kpi-progress-header">
                <span>Progreso global</span>
                <span className="kpi-progress-pct">{globalPct}%</span>
              </div>
              <div className="kpi-progress-track">
                <div className="kpi-progress-fill" style={{ width: `${globalPct}%` }} />
              </div>
              <div className="kpi-progress-sub">
                <span>{datos.tareasFinalizadas} finalizadas</span>
                <span>{total} total</span>
              </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-header">
              <span className="dash-panel-title">Actividad reciente</span>
              <Zap size={13} style={{ color: '#9c9790' }} />
            </div>
            <div className="actividad-list">
              <div className="actividad-item">
                <div className="actividad-dot dot-green" />
                <div className="actividad-body">
                  <span className="actividad-texto"><strong>{datos.tareasFinalizadas}</strong> tareas completadas</span>
                  <span className="actividad-sub">Estado: Finalizada</span>
                </div>
                <span className="actividad-badge badge-green">OK</span>
              </div>
              <div className="actividad-item">
                <div className="actividad-dot dot-amber" />
                <div className="actividad-body">
                  <span className="actividad-texto"><strong>{datos.tareasPendientes}</strong> tareas sin asignar</span>
                  <span className="actividad-sub">Estado: Pendiente</span>
                </div>
                <span className="actividad-badge badge-amber">·</span>
              </div>
              <div className="actividad-item">
                <div className="actividad-dot dot-blue" />
                <div className="actividad-body">
                  <span className="actividad-texto"><strong>{datos.tareasEnProceso}</strong> en ejecución activa</span>
                  <span className="actividad-sub">Estado: En proceso</span>
                </div>
                <span className="actividad-badge badge-blue">→</span>
              </div>
              <div className="actividad-item">
                <div className="actividad-dot dot-red" />
                <div className="actividad-body">
                  <span className="actividad-texto"><strong>{datos.tareasVencidas}</strong> tareas fuera de plazo</span>
                  <span className="actividad-sub">Estado: Vencida</span>
                </div>
                <span className="actividad-badge badge-red">!</span>
              </div>
            </div>
          </div>

          {datos.tecnicosConMasTareas?.length > 0 && (
            <div className="dash-panel">
              <div className="dash-panel-header">
                <span className="dash-panel-title">Técnicos activos</span>
                <Users size={13} style={{ color: '#9c9790' }} />
              </div>
              <div className="tecnicos-list">
                {datos.tecnicosConMasTareas.map((t, i) => {
                  const maxActivas = datos.tecnicosConMasTareas[0]?.totalTareasActivas || 1;
                  const pct = Math.min(Math.round((t.totalTareasActivas / maxActivas) * 100), 100);
                  return (
                    <div className="tecnico-row" key={t.tecnicoId}>
                      <span className="tecnico-rank">#{i + 1}</span>
                      <div className="tecnico-avatar-new">{t.tecnicoNombre?.charAt(0).toUpperCase()}</div>
                      <div className="tecnico-info-new">
                        <span className="tecnico-nombre-new">{t.tecnicoNombre}</span>
                        <div className="tecnico-bar-track-new">
                          <div className="tecnico-bar-fill-new" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="tecnico-nums">
                        <span className="tecnico-num-main">{t.totalTareasActivas}</span>
                        <span className="tecnico-num-sub">{t.totalTareasFinalizadas} fin.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="dash-container">
        <div className="dash-container-header">
          <BarChart2 size={12} strokeWidth={2.5} />
          <span>Gráficas</span>
        </div>
        <div className="dash-charts-grid">

          <div className="dash-chart-panel">
            <div className="dash-panel-header">
              <div className="dash-panel-header-left">
                <div className="dash-chart-icon-wrap">
                  <BarChart2 size={13} strokeWidth={2} />
                </div>
                <span className="dash-panel-title">Tareas por estado</span>
              </div>
              <div className="dash-chart-meta">
                <span className="dash-chart-total">{total}</span>
                <span className="dash-chart-meta-lbl">total</span>
              </div>
            </div>
            <p className="dash-chart-desc">Distribución de tareas según su estado actual en el sistema.</p>
            <GraficaEstados datos={datos} />
          </div>

          <div className="dash-chart-panel">
            <div className="dash-panel-header">
              <div className="dash-panel-header-left">
                <div className="dash-chart-icon-wrap dash-chart-icon-purple">
                  <PieChart size={13} strokeWidth={2} />
                </div>
                <span className="dash-panel-title">Distribución por prioridad</span>
              </div>
              <div className="dash-chart-meta">
                <span className="dash-chart-total">{datos.tareasAltaPrioridad}</span>
                <span className="dash-chart-meta-lbl">alta</span>
              </div>
            </div>
            <p className="dash-chart-desc">Proporción de tareas por nivel de urgencia asignado.</p>
            <GraficaPrioridad datos={datos} />
          </div>

        </div>
      </div>

    </div>
  );
}