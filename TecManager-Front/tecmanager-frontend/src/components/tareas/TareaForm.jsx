import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function TareaForm({ tarea, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    titulo: tarea?.titulo || '',
    descripcion: tarea?.descripcion || '',
    prioridad: tarea?.prioridad || 'MEDIA',
    tecnicoId: tarea?.tecnicoId || '',
    fechaLimite: tarea?.fechaLimite
      ? new Date(tarea.fechaLimite).toISOString().slice(0, 16)
      : '',
    tiempoEstimadoHoras: tarea?.tiempoEstimadoHoras || '',
  });
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async () => {
    try {
      const response = await api.get('/usuarios/rol/TECNICO');
      // Solo técnicos activos
      setTecnicos(response.data.filter(t => t.activo));
    } catch {
      setError('Error al cargar técnicos');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      const datos = {
        ...form,
        fechaLimite: form.fechaLimite
          ? new Date(form.fechaLimite).toISOString().replace('Z', '')
          : null,
        tiempoEstimadoHoras: form.tiempoEstimadoHoras
          ? parseInt(form.tiempoEstimadoHoras)
          : null,
        tecnicoId: form.tecnicoId || null,
      };
      await onGuardar(datos);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '540px' }}>

        <div className="modal-header">
          <h2>{tarea ? '✏️ Editar Tarea' : '+ Nueva Tarea'}</h2>
          <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          {error && <div className="alerta alerta-error">{error}</div>}

          <div className="form-grupo">
            <label>Título *</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: Instalar servidor web"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe la tarea en detalle..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-grupo">
              <label>Prioridad *</label>
              <select name="prioridad" value={form.prioridad} onChange={handleChange}>
                <option value="ALTA">🔴 Alta</option>
                <option value="MEDIA">🟡 Media</option>
                <option value="BAJA">🟢 Baja</option>
              </select>
            </div>

            <div className="form-grupo">
              <label>Técnico asignado</label>
              <select name="tecnicoId" value={form.tecnicoId} onChange={handleChange}>
                <option value="">Sin asignar</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-grupo">
              <label>Fecha límite *</label>
              <input
                name="fechaLimite"
                type="datetime-local"
                value={form.fechaLimite}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grupo">
              <label>Tiempo estimado (horas)</label>
              <input
                name="tiempoEstimadoHoras"
                type="number"
                value={form.tiempoEstimadoHoras}
                onChange={handleChange}
                placeholder="Ej: 4"
                min="1"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : tarea ? 'Actualizar' : 'Crear Tarea'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}