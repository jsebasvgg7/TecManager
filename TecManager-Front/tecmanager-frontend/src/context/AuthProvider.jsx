import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarSesion = () => {
      try {
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        if (token && usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch {
        localStorage.clear();
      } finally {
        setCargando(false);
      }
    };
    cargarSesion();
  }, []);

  const login = (datos) => {
    localStorage.setItem('token', datos.token);
    localStorage.setItem('usuario', JSON.stringify({
      id: datos.id, nombre: datos.nombre,
      email: datos.email, rol: datos.rol,
    }));
    setUsuario({ id: datos.id, nombre: datos.nombre, email: datos.email, rol: datos.rol });
  };

  const logout = () => { localStorage.clear(); setUsuario(null); };
  const esAdmin = () => usuario?.rol === 'ADMIN';
  const esAsignador = () => usuario?.rol === 'ASIGNADOR';
  const esTecnico = () => usuario?.rol === 'TECNICO';

  return (
    <AuthContext.Provider value={{
      usuario, cargando, login, logout, esAdmin, esAsignador, esTecnico
    }}>
      {children}
    </AuthContext.Provider>
  );
}