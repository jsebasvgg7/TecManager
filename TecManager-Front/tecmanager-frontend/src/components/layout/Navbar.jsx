import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  Wrench, LayoutDashboard, ClipboardList,
  Users, CheckSquare, LogOut, Menu, X, Tag,
} from 'lucide-react';
import NotificacionBadge from './NotificacionBadge';
import TopBar from './TopBar';
import '../../styles/navbar.css';

// Map route → readable page title
const TITULOS = {
  '/dashboard':  'Dashboard',
  '/tareas':     'Tareas',
  '/usuarios':   'Usuarios',
  '/categorias': 'Categorías',
  '/mis-tareas': 'Mis Tareas',
};

export default function Navbar() {
  const { usuario, logout, esAdmin, esAsignador, esTecnico } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const paginaActual = TITULOS[location.pathname] || '';

  return (
    <div className="layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${menuAbierto ? 'sidebar-abierto' : ''}`}>

        {/* Logo mark */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Wrench size={15} strokeWidth={2.5} />
          </div>
        </div>

        {/* Nav icons */}
        <nav className="sidebar-nav">
          {(esAdmin() || esAsignador()) && (
            <>
              <NavLink
                to="/dashboard"
                className="sidebar-link"
                data-label="Dashboard"
                onClick={() => setMenuAbierto(false)}
              >
                <span className="sidebar-link-icon">
                  <LayoutDashboard size={17} strokeWidth={1.9} />
                </span>
              </NavLink>
              <NavLink
                to="/tareas"
                className="sidebar-link"
                data-label="Tareas"
                onClick={() => setMenuAbierto(false)}
              >
                <span className="sidebar-link-icon">
                  <ClipboardList size={17} strokeWidth={1.9} />
                </span>
              </NavLink>
            </>
          )}

          {esAdmin() && (
            <>
              <NavLink
                to="/usuarios"
                className="sidebar-link"
                data-label="Usuarios"
                onClick={() => setMenuAbierto(false)}
              >
                <span className="sidebar-link-icon">
                  <Users size={17} strokeWidth={1.9} />
                </span>
              </NavLink>
              <NavLink
                to="/categorias"
                className="sidebar-link"
                data-label="Categorías"
                onClick={() => setMenuAbierto(false)}
              >
                <span className="sidebar-link-icon">
                  <Tag size={17} strokeWidth={1.9} />
                </span>
              </NavLink>
            </>
          )}

          {esTecnico() && (
            <NavLink
              to="/mis-tareas"
              className="sidebar-link"
              data-label="Mis Tareas"
              onClick={() => setMenuAbierto(false)}
            >
              <span className="sidebar-link-icon">
                <CheckSquare size={17} strokeWidth={1.9} />
              </span>
              <NotificacionBadge />
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <button className="sidebar-bottom-link" onClick={handleLogout}>
          <span className="sidebar-link-icon">
            <LogOut size={17} strokeWidth={1.9} />
          </span>
        </button>

      </aside>

      {/* ── MOBILE TOGGLE ── */}
      <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? <X size={17} /> : <Menu size={17} />}
      </button>

      {/* ── MAIN COLUMN ── */}
      <div className="main-contenido-wrapper">
        <TopBar titulo={paginaActual} />
        <main className="main-contenido">
          <Outlet />
        </main>
      </div>

    </div>
  );
}