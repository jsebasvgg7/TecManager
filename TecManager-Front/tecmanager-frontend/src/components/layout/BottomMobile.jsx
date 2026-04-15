import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard, ClipboardList,
  Users, CheckSquare, Tag, Wrench, LogOut,
} from 'lucide-react';
import NotificacionBadge from './NotificacionBadge';
import '../../styles/bottommobile.css';

export default function BottomMobile() {
  const { logout, esAdmin, esSupervisor, esTecnico } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bottom-mobile">

      {(esAdmin() || esSupervisor()) && (
        <>
          <NavLink to="/dashboard" className="bottom-mobile-link" data-label="Dashboard">
            <LayoutDashboard size={20} strokeWidth={1.9} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/tickets" className="bottom-mobile-link" data-label="Tickets">
            <ClipboardList size={20} strokeWidth={1.9} />
            <span>Tickets</span>
          </NavLink>
        </>
      )}

      {esAdmin() && (
        <>
          <NavLink to="/usuarios" className="bottom-mobile-link">
            <Users size={20} strokeWidth={1.9} />
            <span>Usuarios</span>
          </NavLink>

          <NavLink to="/categorias" className="bottom-mobile-link">
            <Tag size={20} strokeWidth={1.9} />
            <span>Categorías</span>
          </NavLink>

          <NavLink to="/especialidades" className="bottom-mobile-link">
            <Wrench size={20} strokeWidth={1.9} />
            <span>Especialidades</span>
          </NavLink>
        </>
      )}

      {esTecnico() && (
        <NavLink to="/mis-tickets" className="bottom-mobile-link">
          <span className="bottom-mobile-icon-wrap">
            <CheckSquare size={20} strokeWidth={1.9} />
            <NotificacionBadge />
          </span>
          <span>Mis Tickets</span>
        </NavLink>
      )}

      <button className="bottom-mobile-link bottom-mobile-logout" onClick={handleLogout}>
        <LogOut size={20} strokeWidth={1.9} />
        <span>Salir</span>
      </button>

    </nav>
  );
}