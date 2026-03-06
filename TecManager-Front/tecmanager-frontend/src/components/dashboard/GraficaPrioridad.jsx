import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

export default function GraficaPrioridad({ datos }) {
  const data = [
    { nombre: 'Alta',  valor: datos.tareasAltaPrioridad,  color: '#ef4444' },
    { nombre: 'Media', valor: datos.tareasMediaPrioridad, color: '#f59e0b' },
    { nombre: 'Baja',  valor: datos.tareasBajaPrioridad,  color: '#22c55e' },
  ].filter(d => d.valor > 0); // Solo mostrar los que tienen valor

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
          🎯 Tareas por Prioridad
        </h3>
        <div className="vacio">No hay tareas registradas</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
        🎯 Tareas por Prioridad
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="valor"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ nombre, percent }) =>
              `${nombre} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}