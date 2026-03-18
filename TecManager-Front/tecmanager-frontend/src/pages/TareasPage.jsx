import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import TareaCard from '../components/tareas/TareaCard';
import TareaForm from '../components/tareas/TareaForm';
import CambioEstadoModal from '../components/tareas/CambioEstadoModal';
import { Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import '../styles/tareas.css';

export default function TareasPage() {
  const [tareas, setTareas]           = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState('');
  const [exito, setExito]             = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);
  const [tareaEstado, setTareaEstado] = useState(null);
  const [filtroEstado, setFiltroEstado]       = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODOS');
  const [busqueda, setBusqueda]       = useState('');
  const navigate = useNavigate();

  useEffect(() => { cargarTareas(); }, []);

  const cargarTareas = async () => {
    try { setCargando(true); const r = await api.get('/tareas'); setTareas(r.data); }
    catch { setError('Error al cargar tareas'); }
    finally { setCargando(false); }
  };

  const handleGuardar = async (datos) => {
    try {
      if (tareaEditar) { await api.put(`/tareas/${tareaEditar.id}`, datos); mostrarExito('Tarea actualizada'); }
      else { await api.post('/tareas', datos); mostrarExito('Tarea creada'); }
      setMostrarForm(false); setTareaEditar(null); cargarTareas();
    } catch (err) { throw new Error(err.response?.data?.mensaje || 'Error al guardar'); }
  };

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${tareaEstado.id}/estado`, datos);
      mostrarExito('Estado actualizado'); setTareaEstado(null); cargarTareas();
    } catch (err) { throw new Error(err.response?.data?.mensaje || 'Error al cambiar estado'); }
  };

  const mostrarExito = (msg) => { setExito(msg); setTimeout(() => setExito(''), 3000); };

  const tareasFiltradas = tareas.filter(t =>
    (filtroEstado === 'TODOS' || t.estado === filtroEstado) &&
    (filtroPrioridad === 'TODOS' || t.prioridad === filtroPrioridad) &&
    t.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const vencidas = tareas.filter(t => t.vencida).length;

  return (
    <div className="contenedor">

      {/* Header */}
      <div className="page-header">
        <div>
          <p className="dash-eyebrow">Gestión</p>
          <h1>Tareas</h1>
          <p className="texto-suave">
            {tareas.length} tareas
            {vencidas > 0 && (
              <span style={{ color: '#ef4444', marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} strokeWidth={2.5} /> {vencidas} vencidas
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-primario" onClick={() => { setTareaEditar(null); setMostrarForm(true); }}>
          <Plus size={15} strokeWidth={2.5} /> Nueva Tarea
        </button>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      {/* Filtros */}
      <div className="filtros-bar">
        <div className="filtro-search-wrap">
          <Search size={14} strokeWidth={2} className="filtro-search-icon" />
          <input type="text" placeholder="Buscar tarea..." value={busqueda}
            onChange={e => setBusqueda(e.target.value)} className="filtro-input filtro-input-search" />
        </div>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="filtro-select">
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_ESPERA">En Espera</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
        <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} className="filtro-select">
          <option value="TODOS">Todas las prioridades</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </select>
      </div>

      {/* Grid */}
      {cargando ? (
        <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando tareas...</div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="vacio">No hay tareas con esos filtros</div>
      ) : (
        <div className="tareas-grid">
          {tareasFiltradas.map(tarea => (
            <TareaCard key={tarea.id} tarea={tarea}
              onEditar={(t) => { setTareaEditar(t); setMostrarForm(true); }}
              onCambiarEstado={(t) => setTareaEstado(t)}
              onVerHistorial={(id) => navigate(`/historial/${id}`)}
            />
          ))}
        </div>
      )}

      {mostrarForm && (
        <TareaForm tarea={tareaEditar} onGuardar={handleGuardar}
          onCerrar={() => { setMostrarForm(false); setTareaEditar(null); }} />
      )}
      {tareaEstado && (
        <CambioEstadoModal tarea={tareaEstado} onGuardar={handleCambiarEstado}
          onCerrar={() => setTareaEstado(null)} />
      )}
    </div>
  );
}