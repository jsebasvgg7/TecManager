import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import TicketCard from '../components/tickets/TicketCard';
import TicketForm from '../components/tickets/TicketForm';
import CambioEstadoModal from '../components/tickets/CambioEstadoModal';
import { Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import '../styles/tickets.css';

const TAMANIO_PAGINA = 20;

export default function TicketsPage() {
  const [tickets,         setTickets]         = useState([]);
  const [cargando,        setCargando]        = useState(true);
  const [cargandoMas,     setCargandoMas]     = useState(false);
  const [error,           setError]           = useState('');
  const [exito,           setExito]           = useState('');
  const [mostrarForm,     setMostrarForm]     = useState(false);
  const [ticketEditar,    setTicketEditar]    = useState(null);
  const [ticketEstado,    setTicketEstado]    = useState(null);
  const [filtroEstado,    setFiltroEstado]    = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda,        setBusqueda]        = useState('');
  const [busquedaDebounce, setBusquedaDebounce] = useState('');
  const [categorias,      setCategorias]      = useState([]);
  const [pagina,          setPagina]          = useState(0);
  const [hayMas,          setHayMas]          = useState(true);
  const [totalTickets,    setTotalTickets]    = useState(0);

  const observerRef = useRef(null);  // ref para el elemento centinela
  const centinelaRef = useRef(null); // elemento al final de la lista

  const navigate = useNavigate();

  // Debounce búsqueda — espera 400ms antes de buscar
  useEffect(() => {
    const timer = setTimeout(() => setBusquedaDebounce(busqueda), 400);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // Cargar categorías una sola vez
  useEffect(() => {
    api.get('/categorias/activas').then(r => setCategorias(r.data)).catch(() => {});
  }, []);

  // Cuando cambian los filtros — resetear y cargar desde página 0
  useEffect(() => {
    setTickets([]);
    setPagina(0);
    setHayMas(true);
    cargarTickets(0, true);
  }, [busquedaDebounce, filtroEstado, filtroPrioridad, filtroCategoria]);

  const cargarTickets = useCallback(async (paginaNum, reset = false) => {
    if (reset) {
      setCargando(true);
    } else {
      setCargandoMas(true);
    }

    try {
      const params = new URLSearchParams({
        pagina:  paginaNum,
        tamanio: TAMANIO_PAGINA,
      });
      if (busquedaDebounce) params.append('busqueda', busquedaDebounce);
      if (filtroEstado)     params.append('estado',   filtroEstado);
      if (filtroPrioridad)  params.append('prioridad',filtroPrioridad);
      if (filtroCategoria)  params.append('categoriaId', filtroCategoria);

      const r = await api.get(`/tareas/paginado?${params}`);
      const { contenido, hayMas: mas, totalElementos } = r.data;

      setTickets(prev => reset ? contenido : [...prev, ...contenido]);
      setHayMas(mas);
      setTotalTickets(totalElementos);
      setPagina(paginaNum + 1);
    } catch {
      setError('Error al cargar tickets');
    } finally {
      setCargando(false);
      setCargandoMas(false);
    }
  }, [busquedaDebounce, filtroEstado, filtroPrioridad, filtroCategoria]);

  // IntersectionObserver — detecta cuando el centinela es visible
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hayMas && !cargandoMas && !cargando) {
          cargarTickets(pagina);
        }
      },
      { threshold: 0.1 }
    );

    if (centinelaRef.current) {
      observerRef.current.observe(centinelaRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hayMas, cargandoMas, cargando, pagina, cargarTickets]);

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
      // Recargar desde el inicio
      setTickets([]);
      setPagina(0);
      setHayMas(true);
      cargarTickets(0, true);
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || 'Error al guardar');
    }
  };

  const handleCambiarEstado = async (datos) => {
    try {
      await api.patch(`/tareas/${ticketEstado.id}/estado`, datos);
      mostrarExito('Estado actualizado');
      setTicketEstado(null);
      // Actualizar el ticket en la lista sin recargar todo
      setTickets(prev => prev.map(t =>
        t.id === ticketEstado.id ? { ...t, estado: datos.nuevoEstado } : t
      ));
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || 'Error al cambiar estado');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este ticket?')) return;
    try {
      await api.delete(`/tareas/${id}`);
      mostrarExito('Ticket eliminado');
      setTickets(prev => prev.filter(t => t.id !== id));
      setTotalTickets(prev => prev - 1);
    } catch {
      setError('Error al eliminar el ticket');
    }
  };

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  const vencidas = tickets.filter(t => t.vencida).length;

  return (
    <div className="contenedor">

      <div className="page-header">
        <div>
          <p className="dash-eyebrow">Gestión</p>
          <h1>Tickets</h1>
          <p className="texto-suave">
            {totalTickets} tickets
            {vencidas > 0 && (
              <span style={{ color: '#ef4444', marginLeft: 8,
                display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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

      {/* Filtros */}
      <div className="filtros-bar">
        <div className="filtro-search-wrap">
          <Search size={14} strokeWidth={2} className="filtro-search-icon" />
          <input type="text" placeholder="Buscar ticket..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="filtro-input filtro-input-search" />
        </div>
        <select value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="filtro-select">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_ESPERA">En Espera</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
        <select value={filtroPrioridad}
          onChange={e => setFiltroPrioridad(e.target.value)}
          className="filtro-select">
          <option value="">Todas las prioridades</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </select>
        {categorias.length > 0 && (
          <select value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="filtro-select">
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        )}
      </div>

      {/* Lista de tickets */}
      {cargando ? (
        <div className="cargando">
          <RefreshCw size={18} className="spin" /> Cargando tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="vacio">No hay tickets con esos filtros</div>
      ) : (
        <>
          <div className="tickets-grid">
            {tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEditar={(t) => { setTicketEditar(t); setMostrarForm(true); }}
                onCambiarEstado={(t) => setTicketEstado(t)}
                onVerHistorial={(id) => navigate(`/historial/${id}`)}
                onEliminar={handleEliminar}
              />
            ))}
          </div>

          {/* Centinela — el observer lo detecta y carga más */}
          <div ref={centinelaRef} style={{ height: 40, marginTop: 16 }}>
            {cargandoMas && (
              <div className="cargando" style={{ padding: '12px 0' }}>
                <RefreshCw size={16} className="spin" /> Cargando más...
              </div>
            )}
            {!hayMas && tickets.length > 0 && (
              <div style={{
                textAlign: 'center', padding: '16px 0',
                fontSize: 12, color: '#94a3b8',
                fontFamily: 'Nunito Sans, sans-serif',
              }}>
                ✓ Todos los tickets cargados ({totalTickets})
              </div>
            )}
          </div>
        </>
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