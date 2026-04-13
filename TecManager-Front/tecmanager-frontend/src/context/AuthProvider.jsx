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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirado = payload.exp * 1000 < Date.now();

      if (expirado) {
        localStorage.clear();
        return; 
      }

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
  const esSupervisor = () => usuario?.rol === 'SUPERVISOR';
  const esTecnico = () => usuario?.rol === 'TECNICO';

  return (
    <AuthContext.Provider value={{
      usuario, cargando, login, logout, esAdmin, esSupervisor, esTecnico
    }}>
      {children}
    </AuthContext.Provider>
  );
}