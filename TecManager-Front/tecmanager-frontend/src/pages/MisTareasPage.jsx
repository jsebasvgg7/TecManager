import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import TareaCard from '../components/tareas/TareaCard';
import CambioEstadoModal from '../components/tareas/CambioEstadoModal';
import { Wrench, RefreshCw } from 'lucide-react';
import '../styles/tareas.css';

const FILTROS = [
  { valor: 'TODOS',     label: 'Todas'      },
  { valor: 'PENDIENTE', label: 'Pendientes', color: '#f59e0b' },
  { valor: 'EN_PROCESO',label: 'En Proceso', color: '#3b82f6' },
  { valor: 'FINALIZADA',label: 'Finalizadas',color: '#22c55e' },
];

export default function MisTareasPage() {
  const [tareas, setTareas]           = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState('');
  const [exito, setExito]             = useState('');
  const [tareaEstado, setTareaEstado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => { cargarMisTareas(); }, []);

  const cargarMisTareas = async () => {
    try { setCargando(true); const r = await api.get('/tareas/mis-tareas'); setTareas(r.data); }
    catch { setError('Error al cargar tus tareas'); }
    finally { setCargando(false); }
  };

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${tareaEstado.id}/estado`, datos);
      setExito('Estado actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
      setTareaEstado(null); cargarMisTareas();
    } catch (err) { throw new Error(err.response?.data?.mensaje || 'Error al cambiar estado'); }
  };

  const tareasFiltradas = tareas.filter(t => filtroEstado === 'TODOS' || t.estado === filtroEstado);

  const count = (estado) => tareas.filter(t => t.estado === estado).length;

  return (
    <div className="contenedor">

      <div className="page-header">
        <div>
          <p className="dash-eyebrow">Mi panel</p>
          <h1>Mis Tareas</h1>
          <p className="texto-suave">{tareas.length} tareas asignadas</p>
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      <div className="mis-tareas-resumen">
        {FILTROS.map(({ valor, label, color }) => (
          <div key={valor}
            className={`resumen-item ${filtroEstado === valor ? 'activo' : ''}`}
            onClick={() => setFiltroEstado(valor)}
          >
            <span className="resumen-num" style={ valor !== 'TODOS' ? { color } : {} }>
              {valor === 'TODOS' ? tareas.length : count(valor)}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {cargando ? (
        <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando tareas...</div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="vacio">
          {filtroEstado === 'TODOS' ? 'No tienes tareas asignadas' : `No tienes tareas en este estado`}
        </div>
      ) : (
        <div className="tareas-grid">
          {tareasFiltradas.map(tarea => (
            <TareaCard key={tarea.id} tarea={tarea}
              onCambiarEstado={(t) => setTareaEstado(t)}
              onEditar={() => {}} onVerHistorial={() => {}}
              soloLectura={true}
            />
          ))}
        </div>
      )}

      {tareaEstado && (
        <CambioEstadoModal tarea={tareaEstado} onGuardar={handleCambiarEstado}
          onCerrar={() => setTareaEstado(null)} />
      )}
    </div>
  );
}