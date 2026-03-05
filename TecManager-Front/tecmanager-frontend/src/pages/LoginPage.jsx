import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axiosConfig';
import '../styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);

      // Redirigir según rol
      const rol = response.data.rol;
      if (rol === 'ADMIN' || rol === 'ASIGNADOR') {
        navigate('/dashboard');
      } else {
        navigate('/mis-tareas');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (err.response?.status === 403) {
        setError('Usuario desactivado. Contacta al administrador');
      } else {
        setError('Error al conectar con el servidor');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-fondo">
      <div className="login-card">

        {/* Logo / Header */}
        <div className="login-header">
          <div className="login-logo">⚙️</div>
          <h1>TecManager</h1>
          <p>Sistema de Gestión de Tareas Técnicas</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">

          {error && (
            <div className="alerta alerta-error">{error}</div>
          )}

          <div className="form-grupo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="usuario@sistema.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primario login-btn"
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

        </form>

      </div>
    </div>
  );
}