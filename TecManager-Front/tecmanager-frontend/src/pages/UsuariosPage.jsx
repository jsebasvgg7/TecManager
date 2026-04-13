import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import UsuarioTable from '../components/usuarios/UsuarioTable';
import { Plus, Search, RefreshCw } from 'lucide-react';
import '../styles/usuarios.css';

export default function UsuariosPage() {
  const [usuarios,      setUsuarios]      = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [error,         setError]         = useState('');
  const [exito,         setExito]         = useState('');
  const [mostrarForm,   setMostrarForm]   = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [filtroRol,     setFiltroRol]     = useState('TODOS');
  const [busqueda,      setBusqueda]      = useState('');

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    try { setCargando(true); const r = await api.get('/usuarios'); setUsuarios(r.data); }
    catch { setError('Error al cargar usuarios'); }
    finally { setCargando(false); }
  };

  const handleGuardar = async (datos) => {
    try {
      if (usuarioEditar) { await api.put(`/usuarios/${usuarioEditar.id}`, datos); mostrarExito('Usuario actualizado'); }
      else               { await api.post('/usuarios', datos);                     mostrarExito('Usuario creado'); }
      setMostrarForm(false); cargarUsuarios();
    } catch (err) { throw new Error(err.response?.data?.mensaje || 'Error al guardar usuario'); }
  };

  const handleCambiarEstado = async (id) => {
    try { await api.patch(`/usuarios/${id}/estado`); mostrarExito('Estado actualizado'); cargarUsuarios(); }
    catch { setError('Error al cambiar el estado'); }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try { await api.delete(`/usuarios/${id}`); mostrarExito('Usuario eliminado'); cargarUsuarios(); }
    catch { setError('Error al eliminar el usuario'); }
  };

  const mostrarExito = (msg) => { setExito(msg); setTimeout(() => setExito(''), 3000); };

  const usuariosFiltrados = usuarios.filter(u => {
    const r = filtroRol === 'TODOS' || u.rol === filtroRol;
    const b = u.nombre.toLowerCase().includes(busqueda.toLowerCase())
           || u.email.toLowerCase().includes(busqueda.toLowerCase());
    return r && b;
  });

  return (
    <div className="contenedor">

      <div className="page-header">
        <div>
          <p className="dash-eyebrow">Administración</p>
          <h1>Usuarios</h1>
          <p className="texto-suave">{usuarios.length} usuarios registrados</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="dash-refresh-btn" onClick={cargarUsuarios}>
            <RefreshCw size={13} strokeWidth={2.5} /> Actualizar
          </button>
          <button className="btn btn-primario" onClick={() => { setUsuarioEditar(null); setMostrarForm(true); }}>
            <Plus size={15} strokeWidth={2.5} /> Nuevo usuario
          </button>
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      <div className="filtros-bar">
        <div className="filtro-search-wrap">
          <Search size={14} strokeWidth={2} className="filtro-search-icon" />
          <input type="text" placeholder="Buscar por nombre o email..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="filtro-input filtro-input-search" />
        </div>
        <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)} className="filtro-select">
          <option value="TODOS">Todos los roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="TECNICO">Técnico</option>
        </select>
      </div>

      {cargando ? (
        <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando usuarios...</div>
      ) : (
        <UsuarioTable usuarios={usuariosFiltrados}
          onEditar={(u) => { setUsuarioEditar(u); setMostrarForm(true); }}
          onCambiarEstado={handleCambiarEstado}
          onEliminar={handleEliminar}
          onActualizar={cargarUsuarios} />
      )}

      {mostrarForm && (
        <UsuarioForm usuario={usuarioEditar} onGuardar={handleGuardar}
          onCerrar={() => setMostrarForm(false)} />
      )}
    </div>
  );
}