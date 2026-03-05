import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function PrivateRoute({ children, roles}) {
    const {usuario, cargando} = useAuth();

    if (cargando) return <div className="cargando">Cargando...</div>

    if (!usuario) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }
    return children;
}