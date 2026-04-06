import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// Vivid but harmonious — all warm/cool tones from the same palette family
const COLORES = ['#f0a830', '#4a7de8', '#34c478', '#2aabb8', '#e85a4a'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e1c1a', color: '#f7f4ef',
      padding: '9px 13px', borderRadius: '8px',
      fontSize: '12px', fontFamily: 'Nunito, sans-serif',
      boxShadow: '0 6px 20px rgba(30,28,26,0.20)',
    }}>
      <div style={{ fontWeight: 800, marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'rgba(247,244,239,0.60)', fontSize: 11 }}>{payload[0].value} tareas</div>
    </div>
  );
};

export default function GraficaEstados({ datos }) {
  const data = [
    { nombre: 'Pendiente',  valor: datos.tareasPendientes  },
    { nombre: 'En Proceso', valor: datos.tareasEnProceso   },
    { nombre: 'Finalizada', valor: datos.tareasFinalizadas },
    { nombre: 'En Espera',  valor: datos.tareasEnEspera    },
    { nombre: 'Vencidas',   valor: datos.tareasVencidas    },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barCategoryGap="38%">
        <CartesianGrid strokeDasharray="3 4" stroke="#ede9e2" vertical={false} />
        <XAxis
          dataKey="nombre"
          tick={{ fontSize: 10.5, fill: '#9c9790', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10.5, fill: '#9c9790', fontFamily: 'Nunito Sans, sans-serif' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(238,234,227,0.45)' }} />
        <Bar dataKey="valor" radius={[5, 5, 0, 0]} maxBarSize={46}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}