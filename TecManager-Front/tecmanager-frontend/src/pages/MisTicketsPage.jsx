import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import TicketCard from '../components/tickets/TicketCard';
import CambioEstadoModal from '../components/tickets/CambioEstadoModal';
import { Wrench, RefreshCw } from 'lucide-react';
import '../styles/tickets.css';

const FILTROS = [
  { valor: 'TODOS',     label: 'Todos'      },
  { valor: 'PENDIENTE', label: 'Pendientes', color: '#f59e0b' },
  { valor: 'EN_PROCESO',label: 'En Proceso', color: '#3b82f6' },
  { valor: 'FINALIZADA',label: 'Finalizados',color: '#22c55e' },
];

export default function MisTicketsPage() {
  const [tickets, setTickets]         = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState('');
  const [exito, setExito]             = useState('');
  const [ticketEstado, setTicketEstado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => { cargarMisTickets(); }, []);

  const cargarMisTickets = async () => {
    try { setCargando(true); const r = await api.get('/tareas/mis-tareas'); setTickets(r.data); }
    catch { setError('Error al cargar tus tickets'); }
    finally { setCargando(false); }
  };

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${ticketEstado.id}/estado`, datos);
      setExito('Estado actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
      setTicketEstado(null); cargarMisTickets();
    } catch (err) { throw new Error(err.response?.data?.mensaje || 'Error al cambiar estado'); }
  };

  const ticketsFiltrados = tickets.filter(t => filtroEstado === 'TODOS' || t.estado === filtroEstado);

  const count = (estado) => tickets.filter(t => t.estado === estado).length;

  return (
    <div className="contenedor">

      <div className="page-header">
        <div>
          <p className="dash-eyebrow">Mi panel</p>
          <h1>Mis Tickets</h1>
          <p className="texto-suave">{tickets.length} tickets asignados</p>
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
              {valor === 'TODOS' ? tickets.length : count(valor)}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {cargando ? (
        <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando tickets...</div>
      ) : ticketsFiltrados.length === 0 ? (
        <div className="vacio">
          {filtroEstado === 'TODOS' ? 'No tienes tickets asignados' : `No tienes tickets en este estado`}
        </div>
      ) : (
        <div className="tickets-grid">
          {ticketsFiltrados.map(ticket => (
            <TicketCard key={ticket.id} tarea={ticket} ticket={ticket}
              onCambiarEstado={(t) => setTicketEstado(t)}
              onEditar={() => {}} onVerHistorial={() => {}}
              soloLectura={true}
            />
          ))}
        </div>
      )}

      {ticketEstado && (
        <CambioEstadoModal ticket={ticketEstado} onGuardar={handleCambiarEstado}
          onCerrar={() => setTicketEstado(null)} />
      )}
    </div>
  );
}