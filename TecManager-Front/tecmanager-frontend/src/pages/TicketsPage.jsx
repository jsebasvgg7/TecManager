import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import TicketCard from '../components/tickets/TicketCard';
import TicketForm from '../components/tickets/TicketForm';
import CambioEstadoModal from '../components/tickets/CambioEstadoModal';
import { Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import '../styles/tickets.css';

export default function TicketsPage() {
  const [tickets,         setTickets]         = useState([]);
  const [cargando,        setCargando]        = useState(true);
  const [error,           setError]           = useState('');
  const [exito,           setExito]           = useState('');
  const [mostrarForm,     setMostrarForm]     = useState(false);
  const [ticketEditar,    setTicketEditar]    = useState(null);
  const [ticketEstado,    setTicketEstado]    = useState(null);
  const [filtroEstado,    setFiltroEstado]    = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODOS');
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS');
  const [busqueda,        setBusqueda]        = useState('');
  const [categorias,      setCategorias]      = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarTickets();
    api.get('/categorias/activas')
      .then(r => setCategorias(r.data))
      .catch(() => {});
  }, []);

  const cargarTickets = async () => {
    try {
      setCargando(true);
      const r = await api.get('/tareas'); // Backend original path
      setTickets(r.data);
    } catch {
      setError('Error al cargar tickets');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (datos) => {
    try {
      if (ticketEditar) {
        await api.put(`/tareas/${ticketEditar.id}`, datos);
        mostrarExito('Ticket actualizado');
      } else {
        await api.post('/tareas', datos);
        mostrarExito('Ticket creado');
      }
      setMostrarForm(false);
      setTicketEditar(null);
      cargarTickets();
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || 'Error al guardar');
    }
  };

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${ticketEstado.id}/estado`, datos);
      mostrarExito('Estado actualizado');
      setTicketEstado(null);
      cargarTickets();
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || 'Error al cambiar estado');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este ticket? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/tareas/${id}`);
      mostrarExito('Ticket eliminado');
      cargarTickets();
    } catch {
      setError('Error al eliminar el ticket');
    }
  };

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  const ticketsFiltrados = tickets.filter(t =>
    (filtroEstado    === 'TODOS' || t.estado    === filtroEstado)    &&
    (filtroPrioridad === 'TODOS' || t.prioridad === filtroPrioridad) &&
    (filtroCategoria === 'TODOS' || t.categoriaId === filtroCategoria) &&
    t.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const vencidas = tickets.filter(t => t.vencida).length;

  return (
    <div className="contenedor">

      <div className="page-header">
        <div>
          <p className="dash-eyebrow">Gestión</p>
          <h1>Tickets</h1>
          <p className="texto-suave">
            {tickets.length} tickets
            {vencidas > 0 && (
              <span style={{ color: '#ef4444', marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} strokeWidth={2.5} /> {vencidas} vencidos
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-primario"
          onClick={() => { setTicketEditar(null); setMostrarForm(true); }}>
          <Plus size={15} strokeWidth={2.5} /> Nuevo Ticket
        </button>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      <div className="filtros-bar">
        <div className="filtro-search-wrap">
          <Search size={14} strokeWidth={2} className="filtro-search-icon" />
          <input type="text" placeholder="Buscar ticket..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="filtro-input filtro-input-search" />
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
        {categorias.length > 0 && (
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="filtro-select">
            <option value="TODOS">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        )}
      </div>

      {cargando ? (
        <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando tickets...</div>
      ) : ticketsFiltrados.length === 0 ? (
        <div className="vacio">No hay tickets con esos filtros</div>
      ) : (
        <div className="tickets-grid">
          {ticketsFiltrados.map(ticket => (
            <TicketCard
              key={ticket.id}
              tarea={ticket} // Mantenemos la prop original 'tarea' hacia adentro si no queremos refactorizar toda la cascada del card en este mismo instante, aunque lo haré abajo renombrando componentes. Pero pasémoslo como `ticket` ahora.
              ticket={ticket}
              onEditar={(t) => { setTicketEditar(t); setMostrarForm(true); }}
              onCambiarEstado={(t) => setTicketEstado(t)}
              onVerHistorial={(id) => navigate(`/historial/${id}`)}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}

      {mostrarForm && (
        <TicketForm ticket={ticketEditar} onGuardar={handleGuardar}
          onCerrar={() => { setMostrarForm(false); setTicketEditar(null); }} />
      )}
      {ticketEstado && (
        <CambioEstadoModal ticket={ticketEstado} onGuardar={handleCambiarEstado}
          onCerrar={() => setTicketEstado(null)} />
      )}
    </div>
  );
}