import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axiosConfig';
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
  Wrench,
  ClipboardList,
  Users,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import '../styles/login.css';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);

      const rol = response.data.rol;
      if (rol === 'ADMIN' || rol === 'ASIGNADOR') {
        navigate('/dashboard');
      } else {
        navigate('/mis-tareas');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Correo o contraseña incorrectos');
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

      <div className="login-left">

        <div className="login-brand">
          <div className="login-brand-icon">
            <Wrench size={15} strokeWidth={2.5} />
          </div>
          <span className="login-brand-name">TecManager</span>
        </div>

        <div className="login-center">

          <div className="login-header">
            <h1>Bienvenido</h1>
            <p>Ingresa tus credenciales para acceder al sistema de gestión.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {error && (
              <div className="alerta-error">
                <AlertCircle size={15} strokeWidth={2} />
                {error}
              </div>
            )}

            <div className="input-wrap">
              <span className="input-icon">
                <Mail size={15} strokeWidth={1.8} />
              </span>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="input-wrap">
              <span className="input-icon">
                <Lock size={15} strokeWidth={1.8} />
              </span>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <Loader2 size={16} strokeWidth={2} className="spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={16} strokeWidth={2} />
                  Iniciar sesión
                </>
              )}
            </button>

          </form>
        </div>

        <div className="login-footer">
          © TecManager {new Date().getFullYear()}
        </div>

      </div>

      <div className="login-right">
        <div className="login-right-overlay" />

        <div className="login-right-content">
          <div className="login-right-badge">
            <Wrench size={18} strokeWidth={2} />
            <span>Plataforma de gestión técnica</span>
          </div>

          <div className="login-right-headline">
            <h2>Gestión de tareas<br />para equipos técnicos</h2>
            <p>Centraliza, asigna y monitorea el trabajo de tu equipo desde un solo lugar.</p>
          </div>

          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <ClipboardList size={18} strokeWidth={2} />
              </div>
              <div className="login-feature-text">
                <span className="login-feature-title">Gestión de tareas</span>
                <span className="login-feature-desc">Crea, asigna y da seguimiento a cada orden de trabajo</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon">
                <Users size={18} strokeWidth={2} />
              </div>
              <div className="login-feature-text">
                <span className="login-feature-title">Control de técnicos</span>
                <span className="login-feature-desc">Administra tu equipo y sus roles con precisión</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon">
                <BarChart3 size={18} strokeWidth={2} />
              </div>
              <div className="login-feature-text">
                <span className="login-feature-title">Reportes en tiempo real</span>
                <span className="login-feature-desc">Visualiza el estado de operaciones al instante</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon">
                <CheckCircle2 size={18} strokeWidth={2} />
              </div>
              <div className="login-feature-text">
                <span className="login-feature-title">Historial completo</span>
                <span className="login-feature-desc">Trazabilidad total de cada tarea completada</span>
              </div>
            </div>
          </div>
        </div>

        <span className="login-deco-label">acceso seguro · solo personal autorizado</span>
      </div>

    </div>
  );
}