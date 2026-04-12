import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORES = { Alta: '#e85a4a', Media: '#f0a830', Baja: '#34c478' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e1c1a',
      color: '#f7f4ef',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'Nunito, sans-serif',
    }}>
      <div style={{ fontWeight: 800, marginBottom: 2 }}>{payload[0].name}</div>
      <div style={{ color: 'rgba(247,244,239,0.60)', fontSize: 11 }}>{payload[0].value} tareas</div>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text
      x={x} y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 11, fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}
    >
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
    <div style={{
      textAlign: 'center',
      padding: '32px 0',
      color: '#9c9790',
      fontSize: 12,
      fontFamily: 'Nunito Sans, sans-serif',
    }}>
      Sin tareas registradas
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ResponsiveContainer width="52%" height={190}>
        <PieChart>
          <Pie
            data={data}
            dataKey="valor"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={82}
            labelLine={false}
            label={renderLabel}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORES[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: COLORES[d.name],
              flexShrink: 0,
            }} />
            <div>
              <div style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 12,
                color: '#1e1c1a',
              }}>
                {d.name}
              </div>
              <div style={{
                fontSize: 11,
                color: '#9c9790',
                fontFamily: 'Nunito Sans, sans-serif',
              }}>
                {d.valor} tickets
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}