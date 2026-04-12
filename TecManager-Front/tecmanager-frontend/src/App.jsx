import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import PrivateRoute from './components/layout/PrivateRoute';
import Navbar from './components/layout/Navbar';

import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import UsuariosPage   from './pages/UsuariosPage';
import TicketsPage    from './pages/TicketsPage';
import MisTicketsPage from './pages/MisTicketsPage';
import HistorialPage  from './pages/HistorialPage';
import CategoriasPage from './pages/CategoriasPage';
import EspecialidadesPage from './pages/EspecialidadesPage';

import './styles/global.css';

function RedirigirSegunRol() {
  const { esAdmin, esSupervisor, esTecnico } = useAuth();
  if (esAdmin() || esSupervisor()) return <Navigate to="/dashboard" replace />;
  if (esTecnico()) return <Navigate to="/mis-tickets" replace />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <PrivateRoute roles={['ADMIN', 'SUPERVISOR', 'TECNICO']}>
          <Navbar />
        </PrivateRoute>
      }>
        <Route index element={<RedirigirSegunRol />} />

        <Route path="dashboard" element={
          <PrivateRoute roles={['ADMIN', 'SUPERVISOR']}>
            <DashboardPage />
          </PrivateRoute>
        } />

        <Route path="tickets" element={
          <PrivateRoute roles={['ADMIN', 'SUPERVISOR']}>
            <TicketsPage />
          </PrivateRoute>
        } />

        <Route path="historial/:ticketId" element={
          <PrivateRoute roles={['ADMIN', 'SUPERVISOR']}>
            <HistorialPage />
          </PrivateRoute>
        } />

        <Route path="usuarios" element={
          <PrivateRoute roles={['ADMIN']}>
            <UsuariosPage />
          </PrivateRoute>
        } />

        <Route path="categorias" element={
          <PrivateRoute roles={['ADMIN']}>
            <CategoriasPage />
          </PrivateRoute>
        } />

        <Route path="especialidades" element={
          <PrivateRoute roles={['ADMIN']}>
            <EspecialidadesPage />
          </PrivateRoute>
        } />

        <Route path="mis-tickets" element={
          <PrivateRoute roles={['TECNICO']}>
            <MisTicketsPage />
          </PrivateRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;