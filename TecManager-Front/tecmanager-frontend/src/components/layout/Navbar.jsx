import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  Wrench, LayoutDashboard, ClipboardList,
  Users, CheckSquare, LogOut, Menu, X,
} from 'lucide-react';
import NotificacionBadge from './NotificacionBadge';
import '../../styles/navbar.css';

export default function Navbar() {
  const { usuario, logout, esAdmin, esAsignador, esTecnico } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const getBadgeRol = (rol) => ({
    ADMIN: 'badge-admin', ASIGNADOR: 'badge-asignador', TECNICO: 'badge-tecnico',
  }[rol] || '');

  return (
    <div className="layout">

      {/* ══ SIDEBAR — flex column directo, sin wrappers ══ */}
      <aside className={`sidebar ${menuAbierto ? 'sidebar-abierto' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Wrench size={17} strokeWidth={2.2} />
          </div>
          <span className="sidebar-logo-texto">TecManager</span>
        </div>

        {/* Usuario */}
        <div className="sidebar-usuario">
          <div className="sidebar-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-usuario-info">
            <span className="sidebar-usuario-nombre">{usuario?.nombre}</span>
            <span className={`badge ${getBadgeRol(usuario?.rol)}`}>{usuario?.rol}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {(esAdmin() || esAsignador()) && (
            <>
              <span className="sidebar-seccion">Principal</span>
              <NavLink to="/dashboard" className="sidebar-link">
                <span className="sidebar-link-icon"><LayoutDashboard size={16} strokeWidth={2} /></span>
                Dashboard
              </NavLink>
              <NavLink to="/tareas" className="sidebar-link">
                <span className="sidebar-link-icon"><ClipboardList size={16} strokeWidth={2} /></span>
                Tareas
              </NavLink>
            </>
          )}
          {esAdmin() && (
            <>
              <span className="sidebar-seccion">Administración</span>
              <NavLink to="/usuarios" className="sidebar-link">
                <span className="sidebar-link-icon"><Users size={16} strokeWidth={2} /></span>
                Usuarios
              </NavLink>
            </>
          )}
          {esTecnico() && (
            <>
              <span className="sidebar-seccion">Mi trabajo</span>
              <NavLink to="/mis-tareas" className="sidebar-link">
                <span className="sidebar-link-icon"><CheckSquare size={16} strokeWidth={2} /></span>
                Mis Tareas <NotificacionBadge />
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout — directo en .sidebar, flex: 1 del nav lo empuja abajo */}
        <button className="sidebar-bottom-link" onClick={handleLogout}>
          <span className="sidebar-link-icon"><LogOut size={16} strokeWidth={2} /></span>
          Cerrar sesión
        </button>

      </aside>

      {/* Botón móvil */}
      <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? <X size={18} /> : <Menu size={18} />}
      </button>

      <main className="main-contenido">
        <Outlet />
      </main>

    </div>
  );
}