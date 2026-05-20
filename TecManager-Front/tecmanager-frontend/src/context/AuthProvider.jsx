import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { setCookie, getCookie, deleteCookie, tokenCookieExpirado } from '../utils/cookieUtils';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarSesion = () => {
      try {
        const token        = getCookie('token');
        const usuarioCookie = getCookie('usuario');

        if (token && usuarioCookie) {
          // Verificar que el token no esté expirado
          if (tokenCookieExpirado()) {
            deleteCookie('token');
            deleteCookie('usuario');
            setCargando(false);
            return;
          }
          setUsuario(JSON.parse(usuarioCookie));
        }
      } catch {
        deleteCookie('token');
        deleteCookie('usuario');
      } finally {
        setCargando(false);
      }
    };

    cargarSesion();
  }, []);

  const login = (datos) => {
    // Guardar en cookies con 1 día de expiración
    // (ajusta el número de días según la expiración de tu JWT)
    setCookie('token',   datos.token, 1);
    setCookie('usuario', JSON.stringify({
      id:     datos.id,
      nombre: datos.nombre,
      email:  datos.email,
      rol:    datos.rol,
    }), 1);

    setUsuario({
      id:     datos.id,
      nombre: datos.nombre,
      email:  datos.email,
      rol:    datos.rol,
    });
  };

  const logout = () => {
    deleteCookie('token');
    deleteCookie('usuario');
    setUsuario(null);
  };

  const esAdmin      = () => usuario?.rol === 'ADMIN';
  const esSupervisor = () => usuario?.rol === 'SUPERVISOR';
  const esTecnico    = () => usuario?.rol === 'TECNICO';

  return (
    <AuthContext.Provider value={{
      usuario, cargando, login, logout,
      esAdmin, esSupervisor, esTecnico,
    }}>
      {children}
    </AuthContext.Provider>
  );
}