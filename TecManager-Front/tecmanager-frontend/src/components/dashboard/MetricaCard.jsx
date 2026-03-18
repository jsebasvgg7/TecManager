export default function MetricaCard({ titulo, valor, icono, color }) {
  const colores = {
    azul:     { fondo: '#dbeafe', texto: '#1e40af', icono: '#93c5fd' },
    verde:    { fondo: '#dcfce7', texto: '#166534', icono: '#86efac' },
    amarillo: { fondo: '#fef3c7', texto: '#92400e', icono: '#fcd34d' },
    rojo:     { fondo: '#fee2e2', texto: '#991b1b', icono: '#fca5a5' },
    morado:   { fondo: '#f3e8ff', texto: '#6b21a8', icono: '#d8b4fe' },
    gris:     { fondo: '#f7f4f0', texto: '#262424', icono: '#d9cfc4' },
  };

  const c = colores[color] || colores.gris;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(238,229,218,0.70)',
      borderRadius: '14px',
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: '0 1px 4px rgba(38,36,36,0.07)',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Ícono */}
      <div style={{
        width: '48px', height: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: c.fondo,
        borderRadius: '12px',
        fontSize: '22px',
        flexShrink: 0,
      }}>
        {icono}
      </div>
      {/* Texto */}
      <div>
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '26px',
          fontWeight: '900',
          color: '#262424',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          {valor}
        </div>
        <div style={{
          fontFamily: 'Nunito Sans, sans-serif',
          fontSize: '12.5px',
          color: '#3a3737',
          marginTop: '3px',
        }}>
          {titulo}
        </div>
      </div>
    </div>
  );
}