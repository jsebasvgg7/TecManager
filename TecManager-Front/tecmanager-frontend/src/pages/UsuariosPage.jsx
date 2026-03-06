import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import UsuarioTable from '../components/usuarios/UsuarioTable';
import '../styles/usuarios.css';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = () => {
    setUsuarioEditar(null);
    setMostrarForm(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setMostrarForm(true);
  };

  const handleGuardar = async (datos) => {
    try {
      if (usuarioEditar) {
        await api.put(`/usuarios/${usuarioEditar.id}`, datos);
        mostrarExito('Usuario actualizado correctamente');
      } else {
        await api.post('/usuarios', datos);
        mostrarExito('Usuario creado correctamente');
      }
      setMostrarForm(false);
      cargarUsuarios();
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al guardar usuario';
      throw new Error(msg);
    }
  };

  const handleCambiarEstado = async (id) => {
    try {
      await api.patch(`/usuarios/${id}/estado`);
      mostrarExito('Estado actualizado');
      cargarUsuarios();
    } catch {
      setError('Error al cambiar el estado');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      mostrarExito('Usuario eliminado');
      cargarUsuarios();
    } catch {
      setError('Error al eliminar el usuario');
    }
  };

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  // Filtrar usuarios por rol y búsqueda
  const usuariosFiltrados = usuarios.filter(u => {
    const coincideRol = filtroRol === 'TODOS' || u.rol === filtroRol;
    const coincideBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase())
      || u.email.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRol && coincideBusqueda;
  });

  return (
    <div className="contenedor">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>👥 Usuarios</h1>
          <p className="texto-suave">{usuarios.length} usuarios registrados</p>
        </div>
        <button className="btn btn-primario" onClick={handleCrear}>
          + Nuevo Usuario
        </button>
      </div>

      {/* Alertas */}
      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      {/* Filtros */}
      <div className="filtros-bar">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="filtro-input"
        />
        <select
          value={filtroRol}
          onChange={e => setFiltroRol(e.target.value)}
          className="filtro-select"
        >
          <option value="TODOS">Todos los roles</option>
          <option value="ADMIN">Admin</option>
          <option value="ASIGNADOR">Asignador</option>
          <option value="TECNICO">Técnico</option>
        </select>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div className="cargando">⏳ Cargando usuarios...</div>
      ) : (
        <UsuarioTable
          usuarios={usuariosFiltrados}
          onEditar={handleEditar}
          onCambiarEstado={handleCambiarEstado}
          onEliminar={handleEliminar}
        />
      )}

      {/* Modal Formulario */}
      {mostrarForm && (
        <UsuarioForm
          usuario={usuarioEditar}
          onGuardar={handleGuardar}
          onCerrar={() => setMostrarForm(false)}
        />
      )}

    </div>
  );
}