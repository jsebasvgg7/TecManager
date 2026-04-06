import { Bell } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import '../../styles/topbar.css';

export default function TopBar({ titulo = '' }) {
  const { usuario } = useAuth();

  return (
    <header className="topbar">
      {/* Page title area */}
      <div className="topbar-left">
        {titulo && <span className="topbar-titulo">{titulo}</span>}
      </div>

      {/* Right side — user info */}
      <div className="topbar-right">

        <div className="topbar-divider" />

        <div className="topbar-user">
          <div className="topbar-info">
            <span className="topbar-nombre">{usuario?.nombre}</span>
            <span className="topbar-rol">{usuario?.rol}</span>
          </div>
          <div className="topbar-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}