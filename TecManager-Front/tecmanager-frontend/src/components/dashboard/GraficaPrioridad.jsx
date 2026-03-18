import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORES = { Alta: '#ef4444', Media: '#f59e0b', Baja: '#22c55e' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#262424', color: '#EEE5DA',
      padding: '10px 14px', borderRadius: '10px',
      fontSize: '13px', fontFamily: 'Nunito, sans-serif',
      boxShadow: '0 8px 24px rgba(38,36,36,0.25)',
    }}>
      <div style={{ fontWeight: 800, marginBottom: 2 }}>{payload[0].name}</div>
      <div style={{ color: '#d9cfc4' }}>{payload[0].value} tareas</div>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const r   = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x   = cx + r * Math.cos(-midAngle * RADIAN);
  const y   = cy + r * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 12, fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function GraficaPrioridad({ datos }) {
  const data = [
    { name: 'Alta',  valor: datos.tareasAltaPrioridad  },
    { name: 'Media', valor: datos.tareasMediaPrioridad },
    { name: 'Baja',  valor: datos.tareasBajaPrioridad  },
  ].filter(d => d.valor > 0);

  if (!data.length) return (
    <div style={{ textAlign:'center', padding: '40px 0', color: '#6b6868', fontSize: 13 }}>
      Sin tareas registradas
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <ResponsiveContainer width="60%" height={220}>
        <PieChart>
          <Pie
            data={data} dataKey="valor" nameKey="name"
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={90}
            labelLine={false} label={renderLabel}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORES[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda custom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: COLORES[d.name], flexShrink: 0,
            }} />
            <div>
              <div style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                fontSize: 13, color: '#262424',
              }}>{d.name}</div>
              <div style={{ fontSize: 11, color: '#6b6868' }}>{d.valor} tareas</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}