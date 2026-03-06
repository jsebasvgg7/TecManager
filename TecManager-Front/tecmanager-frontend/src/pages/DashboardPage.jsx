import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import MetricaCard from '../components/dashboard/MetricaCard';
import GraficaEstados from '../components/dashboard/GraficaEstados';
import GraficaPrioridad from '../components/dashboard/GraficaPrioridad';
import '../styles/dashboard.css';
import '../styles/usuarios.css';

export default function DashboardPage() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      const response = await api.get('/dashboard');
      setDatos(response.data);
    } catch {
      setError('Error al cargar el dashboard');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="cargando">⏳ Cargando métricas...</div>;
  if (error) return <div className="alerta alerta-error">{error}</div>;
  if (!datos) return null;

  return (
    <div className="contenedor">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>📊 Dashboard</h1>
          <p className="texto-suave">Resumen general del sistema</p>
        </div>
        <button className="btn btn-secundario" onClick={cargarDashboard}>
          🔄 Actualizar
        </button>
      </div>

      {/* Métricas principales */}
      <div className="dashboard-grid">
        <MetricaCard
          titulo="Total de Tareas"
          valor={datos.totalTareas}
          icono="📋"
          color="gris"
        />
        <MetricaCard
          titulo="Pendientes"
          valor={datos.tareasPendientes}
          icono="⏳"
          color="amarillo"
        />
        <MetricaCard
          titulo="En Proceso"
          valor={datos.tareasEnProceso}
          icono="⚙️"
          color="azul"
        />
        <MetricaCard
          titulo="Finalizadas"
          valor={datos.tareasFinalizadas}
          icono="✅"
          color="verde"
        />
        <MetricaCard
          titulo="Vencidas"
          valor={datos.tareasVencidas}
          icono="🚨"
          color="rojo"
        />
        <MetricaCard
          titulo="En Espera"
          valor={datos.tareasEnEspera}
          icono="⏸️"
          color="morado"
        />
      </div>

      {/* Métricas de rendimiento */}
      <div className="dashboard-rendimiento">
        <div className="card rendimiento-card">
          <div className="rendimiento-icono">🎯</div>
          <div>
            <div className="rendimiento-valor">
              {datos.porcentajeFinalizadasATiempo}%
            </div>
            <div className="rendimiento-label">Finalizadas a tiempo</div>
          </div>
        </div>

        <div className="card rendimiento-card">
          <div className="rendimiento-icono">⏱️</div>
          <div>
            <div className="rendimiento-valor">
              {datos.tiempoPromedioResolucionHoras}h
            </div>
            <div className="rendimiento-label">Tiempo promedio de resolución</div>
          </div>
        </div>

        <div className="card rendimiento-card">
          <div className="rendimiento-icono">🔴</div>
          <div>
            <div className="rendimiento-valor">
              {datos.tareasAltaPrioridad}
            </div>
            <div className="rendimiento-label">Tareas de alta prioridad</div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="dashboard-graficas">
        <GraficaEstados datos={datos} />
        <GraficaPrioridad datos={datos} />
      </div>

      {/* Ranking de técnicos */}
      {datos.tecnicosConMasTareas?.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            👨‍🔧 Técnicos con más tareas activas
          </h3>
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Técnico</th>
                  <th>Tareas Activas</th>
                  <th>Finalizadas</th>
                  <th>Tiempo Promedio</th>
                </tr>
              </thead>
              <tbody>
                {datos.tecnicosConMasTareas.map((t, i) => (
                  <tr key={t.tecnicoId}>
                    <td>
                      <span style={{ fontWeight: '700', color: '#64748b' }}>
                        #{i + 1}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px', height: '32px',
                          borderRadius: '50%', background: '#2563eb',
                          color: 'white', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '14px'
                        }}>
                          {t.tecnicoNombre?.charAt(0)}
                        </div>
                        {t.tecnicoNombre}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-en-proceso">
                        {t.totalTareasActivas}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-finalizada">
                        {t.totalTareasFinalizadas}
                      </span>
                    </td>
                    <td>{t.tiempoPromedioHoras}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}