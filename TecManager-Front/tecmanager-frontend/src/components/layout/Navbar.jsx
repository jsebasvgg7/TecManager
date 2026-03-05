import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../../styles/navbar.css';

export default function Navbar() {
  const { usuario, logout, esAdmin, esAsignador, esTecnico } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBadgeRol = (rol) => {
    const badges = {
      ADMIN: 'badge-admin',
      ASIGNADOR: 'badge-asignador',
      TECNICO: 'badge-tecnico',
    };
    return badges[rol] || '';
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className={`sidebar ${menuAbierto ? 'sidebar-abierto' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">⚙️</span>
          <span className="sidebar-logo-texto">TecManager</span>
        </div>

        {/* Info del usuario */}
        <div className="sidebar-usuario">
          <div className="sidebar-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-usuario-info">
            <span className="sidebar-usuario-nombre">{usuario?.nombre}</span>
            <span className={`badge ${getBadgeRol(usuario?.rol)}`}>
              {usuario?.rol}
            </span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">

          {/* ADMIN y ASIGNADOR */}
          {(esAdmin() || esAsignador()) && (
            <>
              <NavLink to="/dashboard" className="sidebar-link">
                📊 Dashboard
              </NavLink>
              <NavLink to="/tareas" className="sidebar-link">
                📋 Tareas
              </NavLink>
            </>
          )}

          {/* Solo ADMIN */}
          {esAdmin() && (
            <NavLink to="/usuarios" className="sidebar-link">
              👥 Usuarios
            </NavLink>
          )}

          {/* Solo TECNICO */}
          {esTecnico() && (
            <NavLink to="/mis-tareas" className="sidebar-link">
              🔧 Mis Tareas
            </NavLink>
          )}

        </nav>

        {/* Botón logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>

      </aside>

      {/* Botón menú móvil */}
      <button
        className="menu-toggle"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? '✕' : '☰'}
      </button>

      {/* Contenido principal */}
      <main className="main-contenido">
        <Outlet />
      </main>

    </div>
  );
}