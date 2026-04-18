import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [pagina,      setPagina]      = useState(0);
  const [hayMas,      setHayMas]      = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const centinelaRef = useRef(null);
  const observerRef  = useRef(null);

  useEffect(() => { cargarMisTickets(); }, []);

  const cargarMisTickets = useCallback(async (paginaNum, reset = false) => {
    if (reset) setCargando(true);
    else setCargandoMas(true);

    try {
      const params = new URLSearchParams({ pagina: paginaNum, tamanio: 20 });
      if (filtroEstado) params.append('estado', filtroEstado);

      const r = await api.get(`/tareas/mis-tareas/paginado?${params}`);
      const { contenido, hayMas: mas } = r.data;

      setTickets(prev => reset ? contenido : [...prev, ...contenido]);
      setHayMas(mas);
      setPagina(paginaNum + 1);
    } catch {
      setError('Error al cargar tus tickets');
    } finally {
      setCargando(false);
      setCargandoMas(false);
    }
  }, [filtroEstado]);

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${ticketEstado.id}/estado`, datos);
      setExito('Estado actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
      setTicketEstado(null); cargarMisTickets();
    } catch (err) { throw new Error(err.response?.data?.mensaje || 'Error al cambiar estado'); }
  };

  const ticketsFiltrados = tickets.filter(t => filtroEstado === 'TODOS' || t.estado === filtroEstado);

  useEffect(() => {
    setTickets([]);
    setPagina(0);
    setHayMas(true);
    cargarMisTickets(0, true);
  }, [filtroEstado]);

  const count = (estado) => tickets.filter(t => t.estado === estado).length;

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hayMas && !cargandoMas && !cargando) {
        cargarMisTickets(pagina);
      }
    },
    { threshold: 0.1 }
  );
  
  if (centinelaRef.current) observerRef.current.observe(centinelaRef.current);
     return () => observerRef.current?.disconnect();
  }, [hayMas, cargandoMas, cargando, pagina, cargarMisTickets]);

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

          <div ref={centinelaRef} style={{ height: 40, marginTop: 16 }}>
            {cargandoMas && (
          <div className="cargando" style={{ padding: '12px 0' }}>
            <RefreshCw size={16} className="spin" /> Cargando más...
          </div>
            )}
          </div>

        </div>
      )}

      {ticketEstado && (
        <CambioEstadoModal ticket={ticketEstado} onGuardar={handleCambiarEstado}
          onCerrar={() => setTicketEstado(null)} />
      )}
    </div>

      

  );
}