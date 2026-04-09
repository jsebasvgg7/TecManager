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
  BarChart2, PieChart, LayoutDashboard, ListChecks,
  UserCheck, Bell, Search, Filter, Plus,
  Calendar, Tag, ChevronRight, Star, Award,
  ArrowRight, CheckCheck, CircleDot, Inbox,
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

const TABS = [
  { id: 'general',   label: 'Vista General',      icon: LayoutDashboard },
  { id: 'tareas',    label: 'Gestión de Tareas',  icon: ListChecks      },
  { id: 'tecnicos',  label: 'Técnicos',           icon: UserCheck       },
  { id: 'actividad', label: 'Actividad',          icon: Bell            },
];

const ahora = new Intl.DateTimeFormat('es-CO', {
  weekday: 'short', day: 'numeric', month: 'short',
  hour: '2-digit', minute: '2-digit',
}).format(new Date());

function VistaGeneral({ datos, navigate }) {
  if (!datos) return null;
  const total     = datos.totalTareas || 1;
  const globalPct = Math.round((datos.tareasFinalizadas / total) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div className="dash-bottom-row">

        <div className="dash-container dash-bottom-paneles">
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
                </div>
                <div className="actividad-item">
                  <div className="actividad-dot dot-amber" />
                  <div className="actividad-body">
                    <span className="actividad-texto"><strong>{datos.tareasPendientes}</strong> tareas sin asignar</span>
                    <span className="actividad-sub">Estado: Pendiente</span>
                  </div>
                </div>
                <div className="actividad-item">
                  <div className="actividad-dot dot-blue" />
                  <div className="actividad-body">
                    <span className="actividad-texto"><strong>{datos.tareasEnProceso}</strong> en ejecución activa</span>
                    <span className="actividad-sub">Estado: En proceso</span>
                  </div>
                </div>
                <div className="actividad-item">
                  <div className="actividad-dot dot-red" />
                  <div className="actividad-body">
                    <span className="actividad-texto"><strong>{datos.tareasVencidas}</strong> tareas fuera de plazo</span>
                    <span className="actividad-sub">Estado: Vencida</span>
                  </div>
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
                  {datos.tecnicosConMasTareas.map((t) => {
                    const maxActivas = datos.tecnicosConMasTareas[0]?.totalTareasActivas || 1;
                    const pct = Math.min(Math.round((t.totalTareasActivas / maxActivas) * 100), 100);
                    return (
                      <div className="tecnico-row" key={t.tecnicoId}>
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

        <div className="dash-container dash-bottom-graficas">
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
    </div>
  );
}

function GestionTareas({ navigate }) {
  const [tareas, setTareas]           = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [busqueda, setBusqueda]       = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODOS');

  useEffect(() => {
    api.get('/tareas')
      .then(r => setTareas(r.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const filtradas = tareas.filter(t =>
    (filtroEstado    === 'TODOS' || t.estado    === filtroEstado) &&
    (filtroPrioridad === 'TODOS' || t.prioridad === filtroPrioridad) &&
    t.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const ESTADO_STYLE = {
    PENDIENTE:  { bg: '#fef3c7', color: '#92400e', label: 'Pendiente'  },
    EN_PROCESO: { bg: '#dbeafe', color: '#1e40af', label: 'En proceso' },
    FINALIZADA: { bg: '#dcfce7', color: '#166534', label: 'Finalizada' },
    EN_ESPERA:  { bg: '#f3e8ff', color: '#6b21a8', label: 'En espera'  },
  };

  const PRIORIDAD_STYLE = {
    ALTA:  { bg: '#fee2e2', color: '#991b1b', label: 'Alta'  },
    MEDIA: { bg: '#fef3c7', color: '#92400e', label: 'Media' },
    BAJA:  { bg: '#dcfce7', color: '#166534', label: 'Baja'  },
  };

  return (
    <div className="dash-container" style={{ gap: 16 }}>
      <div className="dash-container-header">
        <ListChecks size={12} strokeWidth={2.5} />
        <span>Gestión de Tareas</span>
        <button
          className="btn btn-primario"
          style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 12 }}
          onClick={() => navigate('/tareas')}
        >
          <Plus size={13} strokeWidth={2.5} /> Nueva tarea
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} strokeWidth={2} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9790', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '8px 14px 8px 36px', border: '1px solid #d9cfc4', borderRadius: 10, fontSize: 13, background: '#f7f4f0', color: '#262424', outline: 'none', fontFamily: 'Nunito Sans, sans-serif' }}
          />
        </div>
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #d9cfc4', borderRadius: 10, fontSize: 13, background: '#f7f4f0', color: '#262424', outline: 'none', fontFamily: 'Nunito Sans, sans-serif', cursor: 'pointer' }}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_ESPERA">En espera</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
        <select
          value={filtroPrioridad}
          onChange={e => setFiltroPrioridad(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #d9cfc4', borderRadius: 10, fontSize: 13, background: '#f7f4f0', color: '#262424', outline: 'none', fontFamily: 'Nunito Sans, sans-serif', cursor: 'pointer' }}
        >
          <option value="TODOS">Todas las prioridades</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </select>
      </div>

      {cargando ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, gap: 10, color: '#9c9790', fontSize: 13 }}>
          <RefreshCw size={15} style={{ animation: 'spinAnim 0.8s linear infinite' }} /> Cargando tareas...
        </div>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#9c9790', fontSize: 13 }}>
          No hay tareas con los filtros seleccionados
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7f4f0', borderBottom: '1px solid #EEE5DA' }}>
                {['Tarea', 'Estado', 'Prioridad', 'Técnico', 'Fecha límite', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9c9790', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.slice(0, 20).map(t => {
                const est = ESTADO_STYLE[t.estado] || { bg: '#f0ece7', color: '#9c9790', label: t.estado };
                const pri = PRIORIDAD_STYLE[t.prioridad] || { bg: '#f0ece7', color: '#9c9790', label: t.prioridad };
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f0ece7', transition: 'background 0.13s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf8f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px', maxWidth: 240 }}>
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, color: '#262424', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.titulo}</div>
                      {t.categoriaNombre && <div style={{ fontSize: 11, color: '#9c9790', marginTop: 2 }}>{t.categoriaNombre}</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, background: est.bg, color: est.color, fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: est.color, flexShrink: 0 }} />
                        {est.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, background: pri.bg, color: pri.color, fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 11 }}>{pri.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'Nunito Sans, sans-serif', fontSize: 12.5, color: t.tecnicoNombre ? '#262424' : '#c0bbb8', whiteSpace: 'nowrap' }}>
                      {t.tecnicoNombre || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'Nunito Sans, sans-serif', fontSize: 12, color: t.vencida ? '#d95f50' : '#6b6868', whiteSpace: 'nowrap' }}>
                      {t.fechaLimite ? new Date(t.fechaLimite).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      {t.vencida && <AlertTriangle size={11} style={{ marginLeft: 5, color: '#d95f50', verticalAlign: 'middle' }} />}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => navigate(`/historial/${t.id}`)}
                        style={{ background: '#f7f4f0', border: '1px solid #EEE5DA', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#262424', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Ver <ChevronRight size={11} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtradas.length > 20 && (
            <div style={{ padding: '12px 14px', textAlign: 'center', borderTop: '1px solid #f0ece7' }}>
              <button onClick={() => navigate('/tareas')} style={{ background: 'none', border: 'none', color: '#5a7de8', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                Ver todas las tareas ({filtradas.length}) <ArrowRight size={12} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SeccionTecnicos({ datos }) {
  const tecnicos = datos?.tecnicosConMasTareas || [];
  const eficientes = datos?.tecnicosMasEficientes || [];

  const StatBox = ({ label, value, color, bg }) => (
    <div style={{ background: bg, borderRadius: 10, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 22, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11, color }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Resumen */}
      <div className="dash-container">
        <div className="dash-container-header">
          <UserCheck size={12} strokeWidth={2.5} />
          <span>Resumen de técnicos</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <StatBox label="Técnicos activos"    value={tecnicos.length}                               color="#5a7de8" bg="#eef1fc" />
          <StatBox label="Tareas completadas"  value={datos?.tareasFinalizadas ?? 0}                  color="#2eaa68" bg="#e4f5ed" />
          <StatBox label="Tiempo promedio (h)" value={`${datos?.tiempoPromedioResolucionHoras ?? 0}h`} color="#d4a428" bg="#fdf5e0" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <div className="dash-container">
          <div className="dash-container-header">
            <Award size={12} strokeWidth={2.5} />
            <span>Ranking por carga activa</span>
          </div>
          {tecnicos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9c9790', fontSize: 12.5 }}>Sin datos de técnicos</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tecnicos.map((t, i) => {
                const max = tecnicos[0]?.totalTareasActivas || 1;
                const pct = Math.min(Math.round((t.totalTareasActivas / max) * 100), 100);
                const medalColors = ['#d4a428', '#9c9790', '#c8824e'];
                return (
                  <div key={t.tecnicoId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < 3 ? medalColors[i] : '#f0ece7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 10, color: i < 3 ? '#fff' : '#9c9790', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#262424', color: '#EEE5DA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12, flexShrink: 0 }}>
                      {t.tecnicoNombre?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#262424', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.tecnicoNombre}</div>
                      <div style={{ height: 4, background: '#f0ece7', borderRadius: 4, overflow: 'hidden', marginTop: 5 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#5a7de8', borderRadius: 4, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14, color: '#262424', flexShrink: 0 }}>{t.totalTareasActivas}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dash-container">
          <div className="dash-container-header">
            <Star size={12} strokeWidth={2.5} />
            <span>Más eficientes</span>
          </div>
          {eficientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9c9790', fontSize: 12.5 }}>Sin datos suficientes</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {eficientes.map((t, i) => (
                <div key={t.tecnicoId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: i === 0 ? '#fdf5e0' : '#f7f4f0', borderRadius: 10, border: `1px solid ${i === 0 ? '#f0d080' : '#f0ece7'}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: i === 0 ? '#d4a428' : '#262424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12, flexShrink: 0 }}>
                    {t.tecnicoNombre?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, color: '#262424' }}>{t.tecnicoNombre}</div>
                    <div style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11, color: '#6b6868' }}>{t.totalTareasFinalizadas} tareas · {t.tiempoPromedioHoras}h prom.</div>
                  </div>
                  {i === 0 && <Star size={14} style={{ color: '#d4a428', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeccionActividad({ datos }) {
  const eventos = [
    { tipo: 'completada', texto: `${datos?.tareasFinalizadas ?? 0} tareas completadas`, sub: 'Estado: Finalizada', color: '#2eaa68', bg: '#e4f5ed', icon: CheckCheck },
    { tipo: 'pendiente',  texto: `${datos?.tareasPendientes ?? 0} tareas sin asignar`,  sub: 'Estado: Pendiente',  color: '#d4a428', bg: '#fdf5e0', icon: Inbox },
    { tipo: 'proceso',    texto: `${datos?.tareasEnProceso ?? 0} en ejecución activa`,   sub: 'Estado: En proceso',  color: '#5a7de8', bg: '#eef1fc', icon: CircleDot },
    { tipo: 'espera',     texto: `${datos?.tareasEnEspera ?? 0} en espera`,              sub: 'Estado: En espera',  color: '#a855f7', bg: '#f3e8ff', icon: Timer },
    { tipo: 'vencida',    texto: `${datos?.tareasVencidas ?? 0} tareas fuera de plazo`,  sub: 'Estado: Vencida',    color: '#d95f50', bg: '#faeceb', icon: AlertTriangle },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

      <div className="dash-container">
        <div className="dash-container-header">
          <Activity size={12} strokeWidth={2.5} />
          <span>Historial de eventos</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 17, top: 0, bottom: 0, width: 2, background: '#f0ece7', borderRadius: 2 }} />
          {eventos.map((ev, i) => {
            const Icon = ev.icon;
            return (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', position: 'relative' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ev.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1, border: `2px solid #f7f4f0` }}>
                  <Icon size={15} strokeWidth={2} style={{ color: ev.color }} />
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 1px 4px rgba(38,36,36,0.06)', border: '1px solid rgba(238,229,218,0.80)', marginBottom: 4 }}>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, color: '#262424' }}>{ev.texto}</div>
                  <div style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11, color: '#9c9790', marginTop: 2 }}>{ev.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="dash-container">
          <div className="dash-container-header">
            <Bell size={12} strokeWidth={2.5} />
            <span>Alertas del sistema</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {datos?.tareasVencidas > 0 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, background: '#faeceb', borderRadius: 10, border: '1px solid #fca5a580' }}>
                <AlertTriangle size={16} strokeWidth={2} style={{ color: '#d95f50', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#d95f50' }}>Tareas vencidas</div>
                  <div style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11.5, color: '#b04030', marginTop: 2 }}>
                    {datos.tareasVencidas} tarea{datos.tareasVencidas !== 1 ? 's' : ''} superaron su fecha límite.
                  </div>
                </div>
              </div>
            )}
            {datos?.tareasAltaPrioridad > 0 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, background: '#fdf5e0', borderRadius: 10, border: '1px solid #f0d08080' }}>
                <Flame size={16} strokeWidth={2} style={{ color: '#d4a428', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#d4a428' }}>Alta prioridad</div>
                  <div style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11.5, color: '#a07c18', marginTop: 2 }}>
                    {datos.tareasAltaPrioridad} tarea{datos.tareasAltaPrioridad !== 1 ? 's' : ''} con prioridad alta activas.
                  </div>
                </div>
              </div>
            )}
            {datos?.tareasVencidas === 0 && datos?.tareasAltaPrioridad === 0 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, background: '#e4f5ed', borderRadius: 10, border: '1px solid #86efac80' }}>
                <Shield size={16} strokeWidth={2} style={{ color: '#2eaa68', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#2eaa68' }}>Sistema en orden</div>
                  <div style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11.5, color: '#1e8a50', marginTop: 2 }}>No hay alertas activas en este momento.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dash-container">
          <div className="dash-container-header">
            <Timer size={12} strokeWidth={2.5} />
            <span>Métricas de rendimiento</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Tasa de finalización a tiempo', value: `${datos?.porcentajeFinalizadasATiempo ?? 0}%`, color: '#2eaa68', bg: '#e4f5ed', max: 100, current: datos?.porcentajeFinalizadasATiempo ?? 0 },
              { label: 'Tiempo promedio resolución',     value: `${datos?.tiempoPromedioResolucionHoras ?? 0}h`, color: '#5a7de8', bg: '#eef1fc', max: 72,  current: Math.min(datos?.tiempoPromedioResolucionHoras ?? 0, 72) },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 12, color: '#6b6868' }}>{m.label}</span>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, color: '#262424' }}>{m.value}</span>
                </div>
                <div style={{ height: 6, background: '#f0ece7', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((m.current / m.max) * 100, 100)}%`, background: m.color, borderRadius: 6, transition: 'width 1.2s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [datos, setDatos]         = useState(null);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState('');
  const [tabActivo, setTabActivo] = useState('general');

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

  const total = datos?.totalTareas || 1;

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
            const val = datos?.[key] ?? 0;
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

      <div style={{ display: 'flex', gap: 6, background: '#f0ece7', padding: 5, borderRadius: 14, width: 'fit-content' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTabActivo(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px',
              borderRadius: 10, border: 'none',
              background: tabActivo === id ? '#262424' : 'transparent',
              color: tabActivo === id ? '#EEE5DA' : '#6b6868',
              fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <Icon size={14} strokeWidth={tabActivo === id ? 2.2 : 1.8} />
            {label}
          </button>
        ))}
      </div>

      <div style={{ animation: 'dashIn 0.3s ease both' }}>
        {tabActivo === 'general'   && <VistaGeneral    datos={datos} navigate={navigate} />}
        {tabActivo === 'tareas'    && <GestionTareas   navigate={navigate} />}
        {tabActivo === 'tecnicos'  && <SeccionTecnicos datos={datos} />}
        {tabActivo === 'actividad' && <SeccionActividad datos={datos} />}
      </div>

    </div>
  );
}