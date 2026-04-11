import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import '../styles/usuarios.css';

const ICONOS = [
  'Wrench', 'Server', 'Monitor', 'Database', 'Network',
  'Code', 'Shield', 'Wifi', 'HardDrive', 'Cpu',
  'Globe', 'Lock', 'Settings', 'AlertTriangle', 'Etiqueta',
];

const COLORES_PRESET = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#ef4444', '#f59e0b', '#22c55e', '#14b8a6',
  '#0ea5e9', '#262424',
];

function EspecialidadModal({ especialidad, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre:      especialidad?.nombre      || '',
    descripcion: especialidad?.descripcion || '',
    color:       especialidad?.color       || '#3b82f6',
    icono:       especialidad?.icono       || 'Wrench',
  });
  const [error,     setError]     = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await onGuardar(form);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 480 }}>

        <div className="modal-header">
          <h2>{especialidad ? '✏️ Editar Especialidad' : '+ Nueva Especialidad'}</h2>
          <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alerta alerta-error">{error}</div>}

          <div className="form-grupo">
            <label>Nombre *</label>
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Técnico de refrigeración"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe esta especialidad..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Color */}
          <div className="form-grupo">
            <label>Color</label>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              padding: 10, background: '#f8fafc',
              borderRadius: 10, border: '1px solid #e2e8f0',
            }}>
              {COLORES_PRESET.map(c => (
                <div
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: c, cursor: 'pointer',
                    border: form.color === c ? '3px solid #1e293b' : '2px solid transparent',
                    transition: 'border 0.15s',
                  }}
                />
              ))}
              <input
                type="color"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                style={{ width: 26, height: 26, border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%' }}
                title="Color personalizado"
              />
            </div>
          </div>

          {/* Ícono */}
          <div className="form-grupo">
            <label>Ícono</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ICONOS.map(icono => (
                <button
                  key={icono}
                  type="button"
                  onClick={() => setForm({ ...form, icono })}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    border: `1.5px solid ${form.icono === icono ? form.color : '#e2e8f0'}`,
                    background: form.icono === icono ? form.color + '20' : 'white',
                    color: form.icono === icono ? form.color : '#64748b',
                    fontSize: 11, cursor: 'pointer',
                    fontWeight: form.icono === icono ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {icono}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', background: '#f8fafc',
            borderRadius: 10, border: '1px solid #e2e8f0',
            marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: form.color + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              🔧
            </div>
            <div>
              <div style={{ fontWeight: 700, color: form.color, fontSize: 14 }}>
                {form.nombre || 'Nombre de especialidad'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {form.icono}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : especialidad ? 'Actualizar' : 'Crear Especialidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState([]);
  const [cargando,       setCargando]       = useState(true);
  const [error,          setError]          = useState('');
  const [exito,          setExito]          = useState('');
  const [mostrarForm,    setMostrarForm]    = useState(false);
  const [espEditar,      setEspEditar]      = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      setCargando(true);
      const r = await api.get('/especialidades');
      setEspecialidades(r.data);
    } catch {
      setError('Error al cargar especialidades');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (datos) => {
    try {
      if (espEditar) {
        await api.put(`/especialidades/${espEditar.id}`, datos);
        mostrarExito('Especialidad actualizada');
      } else {
        await api.post('/especialidades', datos);
        mostrarExito('Especialidad creada');
      }
      setMostrarForm(false);
      setEspEditar(null);
      cargar();
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || 'Error al guardar');
    }
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm('¿Desactivar esta especialidad?')) return;
    try {
      await api.delete(`/especialidades/${id}`);
      mostrarExito('Especialidad desactivada');
      cargar();
    } catch {
      setError('Error al desactivar');
    }
  };

  const handleReactivar = async (id) => {
    try {
      await api.patch(`/especialidades/${id}/reactivar`);
      mostrarExito('Especialidad reactivada');
      cargar();
    } catch {
      setError('Error al reactivar');
    }
  };

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  return (
    <div className="contenedor">

      <div className="page-header">
        <div>
          <h1>🔧 Especialidades</h1>
          <p className="texto-suave">{especialidades.length} especialidades registradas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secundario" onClick={cargar}>🔄 Actualizar</button>
          <button className="btn btn-primario"
            onClick={() => { setEspEditar(null); setMostrarForm(true); }}>
            + Nueva Especialidad
          </button>
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      {cargando ? (
        <div className="cargando">⏳ Cargando especialidades...</div>
      ) : especialidades.length === 0 ? (
        <div className="vacio">No hay especialidades. Crea la primera.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 14,
        }}>
          {especialidades.map(esp => (
            <div key={esp.id} style={{
              background: 'white',
              border: `1px solid ${esp.activa ? '#e2e8f0' : '#fca5a580'}`,
              borderRadius: 14, padding: 18,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              opacity: esp.activa ? 1 : 0.65,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: esp.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    🔧
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                      {esp.nombre}
                    </div>
                    {!esp.activa && (
                      <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>
                        Inactiva
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    className="btn btn-secundario"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                    onClick={() => { setEspEditar(esp); setMostrarForm(true); }}
                  >
                    ✏️
                  </button>
                  {esp.activa ? (
                    <button
                      className="btn btn-peligro"
                      style={{ padding: '4px 8px', fontSize: 12 }}
                      onClick={() => handleDesactivar(esp.id)}
                    >
                      🗑️
                    </button>
                  ) : (
                    <button
                      className="btn btn-secundario"
                      style={{ padding: '4px 8px', fontSize: 12, color: '#22c55e' }}
                      onClick={() => handleReactivar(esp.id)}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>

              {esp.descripcion && (
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                  {esp.descripcion}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: esp.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{esp.icono}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarForm && (
        <EspecialidadModal
          especialidad={espEditar}
          onGuardar={handleGuardar}
          onCerrar={() => { setMostrarForm(false); setEspEditar(null); }}
        />
      )}
    </div>
  );
}