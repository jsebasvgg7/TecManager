export default function MetricaCard({ titulo, valor, icono, color }) {
  const colores = {
    azul:     { fondo: '#dbeafe', texto: '#1e40af', borde: '#93c5fd' },
    verde:    { fondo: '#dcfce7', texto: '#166534', borde: '#86efac' },
    amarillo: { fondo: '#fef3c7', texto: '#92400e', borde: '#fcd34d' },
    rojo:     { fondo: '#fee2e2', texto: '#991b1b', borde: '#fca5a5' },
    morado:   { fondo: '#f3e8ff', texto: '#6b21a8', borde: '#d8b4fe' },
    gris:     { fondo: '#f1f5f9', texto: '#475569', borde: '#cbd5e1' },
  };

  const c = colores[color] || colores.gris;

  return (
    <div style={{
      background: c.fondo,
      border: `1px solid ${c.borde}`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        fontSize: '32px',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        {icono}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: c.texto }}>
          {valor}
        </div>
        <div style={{ fontSize: '13px', color: c.texto, opacity: 0.8 }}>
          {titulo}
        </div>
      </div>
    </div>
  );
}