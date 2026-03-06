import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function GraficaEstados({ datos }) {
  const data = [
    { nombre: 'Pendiente',   valor: datos.tareasPendientes,   color: '#f59e0b' },
    { nombre: 'En Proceso',  valor: datos.tareasEnProceso,    color: '#3b82f6' },
    { nombre: 'Finalizada',  valor: datos.tareasFinalizadas,  color: '#22c55e' },
    { nombre: 'En Espera',   valor: datos.tareasEnEspera,     color: '#a855f7' },
    { nombre: 'Vencidas',    valor: datos.tareasVencidas,     color: '#ef4444' },
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
        📊 Tareas por Estado
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="nombre"
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px'
            }}
          />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}