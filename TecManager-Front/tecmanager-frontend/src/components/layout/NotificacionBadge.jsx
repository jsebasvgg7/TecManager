import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function NotificacionBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let activo = true;

    const fetchCount = async () => {
      try {
        const res = await api.get('/notificaciones/no-leidas/count');
        if (activo) setCount(res.data);
      } catch {
        // silencioso
      }
    };

    // Primera carga con pequeño delay para evitar el error
    const timeoutInicial = setTimeout(fetchCount, 100);

    // Luego cada 30 segundos
    const intervalo = setInterval(fetchCount, 30000);

    return () => {
      activo = false;
      clearTimeout(timeoutInicial);
      clearInterval(intervalo);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span style={{
      background: '#ef4444',
      color: 'white',
      borderRadius: '10px',
      padding: '1px 6px',
      fontSize: '11px',
      fontWeight: '700',
      marginLeft: '6px',
    }}>
      {count > 9 ? '9+' : count}
    </span>
  );
}