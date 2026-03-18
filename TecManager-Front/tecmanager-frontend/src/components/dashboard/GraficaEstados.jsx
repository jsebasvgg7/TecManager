import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORES = ['#d9cfc4', '#93c5fd', '#86efac', '#d8b4fe', '#fca5a5'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#262424', color: '#EEE5DA',
      padding: '10px 14px', borderRadius: '10px',
      fontSize: '13px', fontFamily: 'Nunito, sans-serif',
      boxShadow: '0 8px 24px rgba(38,36,36,0.25)',
    }}>
      <div style={{ fontWeight: 800, marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#d9cfc4' }}>{payload[0].value} tareas</div>
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
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece7" vertical={false} />
        <XAxis
          dataKey="nombre"
          tick={{ fontSize: 11, fill: '#6b6868', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#6b6868', fontFamily: 'Nunito Sans, sans-serif' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(238,229,218,0.30)' }} />
        <Bar dataKey="valor" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}