import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import PrivateRoute from './components/layout/PrivateRoute';
import Navbar from './components/layout/Navbar';

import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import UsuariosPage   from './pages/UsuariosPage';
import TareasPage     from './pages/TareasPage';
import MisTareasPage  from './pages/MisTareasPage';
import HistorialPage  from './pages/HistorialPage';
import CategoriasPage from './pages/CategoriasPage';
import EspecialidadesPage from './pages/EspecialidadesPage';

import './styles/global.css';

function RedirigirSegunRol() {
  const { esAdmin, esAsignador, esTecnico } = useAuth();
  if (esAdmin() || esAsignador()) return <Navigate to="/dashboard" replace />;
  if (esTecnico()) return <Navigate to="/mis-tareas" replace />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <PrivateRoute roles={['ADMIN', 'ASIGNADOR', 'TECNICO']}>
          <Navbar />
        </PrivateRoute>
      }>
        <Route index element={<RedirigirSegunRol />} />

        <Route path="dashboard" element={
          <PrivateRoute roles={['ADMIN', 'ASIGNADOR']}>
            <DashboardPage />
          </PrivateRoute>
        } />

        <Route path="tareas" element={
          <PrivateRoute roles={['ADMIN', 'ASIGNADOR']}>
            <TareasPage />
          </PrivateRoute>
        } />

        <Route path="historial/:tareaId" element={
          <PrivateRoute roles={['ADMIN', 'ASIGNADOR']}>
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

        <Route path="mis-tareas" element={
          <PrivateRoute roles={['TECNICO']}>
            <MisTareasPage />
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