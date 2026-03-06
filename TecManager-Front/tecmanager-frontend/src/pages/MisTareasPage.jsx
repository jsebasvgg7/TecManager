import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import TareaCard from '../components/tareas/TareaCard';
import CambioEstadoModal from '../components/tareas/CambioEstadoModal';
import '../styles/tareas.css';

export default function MisTareasPage() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [tareaEstado, setTareaEstado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => {
    cargarMisTareas();
  }, []);

  const cargarMisTareas = async () => {
    try {
      setCargando(true);
      const response = await api.get('/tareas/mis-tareas');
      setTareas(response.data);
    } catch {
      setError('Error al cargar tus tareas');
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${tareaEstado.id}/estado`, datos);
      setExito('Estado actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
      setTareaEstado(null);
      cargarMisTareas();
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al cambiar estado';
      throw new Error(msg);
    }
  };

  const tareasFiltradas = tareas.filter(t =>
    filtroEstado === 'TODOS' || t.estado === filtroEstado
  );

  const pendientes = tareas.filter(t => t.estado === 'PENDIENTE').length;
  const enProceso = tareas.filter(t => t.estado === 'EN_PROCESO').length;
  const finalizadas = tareas.filter(t => t.estado === 'FINALIZADA').length;

  return (
    <div className="contenedor">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>🔧 Mis Tareas</h1>
          <p className="texto-suave">{tareas.length} tareas asignadas</p>
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      {/* Resumen rápido */}
      <div className="mis-tareas-resumen">
        <div
          className={`resumen-item ${filtroEstado === 'TODOS' ? 'activo' : ''}`}
          onClick={() => setFiltroEstado('TODOS')}
        >
          <span className="resumen-num">{tareas.length}</span>
          <span>Todas</span>
        </div>
        <div
          className={`resumen-item ${filtroEstado === 'PENDIENTE' ? 'activo' : ''}`}
          onClick={() => setFiltroEstado('PENDIENTE')}
        >
          <span className="resumen-num" style={{ color: '#f59e0b' }}>{pendientes}</span>
          <span>Pendientes</span>
        </div>
        <div
          className={`resumen-item ${filtroEstado === 'EN_PROCESO' ? 'activo' : ''}`}
          onClick={() => setFiltroEstado('EN_PROCESO')}
        >
          <span className="resumen-num" style={{ color: '#3b82f6' }}>{enProceso}</span>
          <span>En Proceso</span>
        </div>
        <div
          className={`resumen-item ${filtroEstado === 'FINALIZADA' ? 'activo' : ''}`}
          onClick={() => setFiltroEstado('FINALIZADA')}
        >
          <span className="resumen-num" style={{ color: '#22c55e' }}>{finalizadas}</span>
          <span>Finalizadas</span>
        </div>
      </div>

      {/* Grid de tareas */}
      {cargando ? (
        <div className="cargando">⏳ Cargando tus tareas...</div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="vacio">
          {filtroEstado === 'TODOS'
            ? 'No tienes tareas asignadas'
            : `No tienes tareas en estado ${filtroEstado}`}
        </div>
      ) : (
        <div className="tareas-grid">
          {tareasFiltradas.map(tarea => (
            <TareaCard
              key={tarea.id}
              tarea={tarea}
              onCambiarEstado={(t) => setTareaEstado(t)}
              onEditar={() => {}}
              onVerHistorial={() => {}}
              soloLectura={true}
            />
          ))}
        </div>
      )}

      {/* Modal cambio de estado */}
      {tareaEstado && (
        <CambioEstadoModal
          tarea={tareaEstado}
          onGuardar={handleCambiarEstado}
          onCerrar={() => setTareaEstado(null)}
        />
      )}

    </div>
  );
}