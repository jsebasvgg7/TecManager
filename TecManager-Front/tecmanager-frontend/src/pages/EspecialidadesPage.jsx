import { useState, useEffect } from 'react';
import {
  Wrench, Server, Monitor, Database, Network,
  Code, Shield, Wifi, HardDrive, Cpu,
  Globe, Lock, Settings, AlertTriangle, Tag,
  Pencil, X, Trash2, RotateCcw, RefreshCw,
  Loader2, Plus,
} from 'lucide-react';
import api from '../api/axiosConfig';
import '../styles/usuarios.css';
import '../styles/especialidades.css';

/* ── Icon map ─────────────────────────────────────────────── */
const ICON_MAP = {
  Wrench, Server, Monitor, Database, Network,
  Code, Shield, Wifi, HardDrive, Cpu,
  Globe, Lock, Settings, AlertTriangle, Etiqueta: Tag,
};

const ICONOS = Object.keys(ICON_MAP);

function getLucideIcon(name, props = {}) {
  const Icon = ICON_MAP[name] || Wrench;
  return <Icon {...props} />;
}

/* ── Color presets ────────────────────────────────────────── */
const COLORES_PRESET = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#ef4444', '#f59e0b', '#22c55e', '#14b8a6',
  '#0ea5e9', '#262424',
];

/* ── Modal ────────────────────────────────────────────────── */
function EspecialidadModal({ especialidad, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre: especialidad?.nombre || '',
    descripcion: especialidad?.descripcion || '',
    color: especialidad?.color || '#3b82f6',
    icono: especialidad?.icono || 'Wrench',
  });
  const [error, setError] = useState('');
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
          <h2 className="esp-modal-title">
            <Pencil size={16} />
            {especialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
          </h2>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={16} />
          </button>
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
              className="esp-form-desc"
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe esta especialidad..."
              rows={2}
            />
          </div>

          {/* Color */}
          <div className="form-grupo">
            <label>Color</label>
            <div className="esp-color-picker">
              {COLORES_PRESET.map(c => (
                <div
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className="esp-color-swatch"
                  style={{
                    background: c,
                    border: form.color === c ? '3px solid #1e293b' : '2px solid transparent',
                  }}
                />
              ))}
              <input
                type="color"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                className="esp-color-input"
                title="Color personalizado"
              />
            </div>
          </div>

          {/* Ícono */}
          <div className="form-grupo">
            <label>Ícono</label>
            <div className="esp-icon-picker">
              {ICONOS.map(icono => (
                <button
                  key={icono}
                  type="button"
                  title={icono}
                  onClick={() => setForm({ ...form, icono })}
                  className="esp-icon-btn"
                  style={{
                    border: `1.5px solid ${form.icono === icono ? form.color : '#e2e8f0'}`,
                    background: form.icono === icono ? form.color + '20' : 'white',
                    color: form.icono === icono ? form.color : '#64748b',
                  }}
                >
                  {getLucideIcon(icono, { size: 16, strokeWidth: 1.9 })}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="esp-preview">
            <div
              className="esp-preview-icon"
              style={{
                background: form.color + '20',
                color: form.color,
              }}
            >
              {getLucideIcon(form.icono, { size: 18, strokeWidth: 1.9 })}
            </div>
            <div>
              <div className="esp-preview-name" style={{ color: form.color }}>
                {form.nombre || 'Nombre de especialidad'}
              </div>
              <div className="esp-preview-subtitle">
                {form.icono}
              </div>
            </div>
          </div>

          <div className="esp-modal-actions">
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

/* ── Page ─────────────────────────────────────────────────── */
export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [espEditar, setEspEditar] = useState(null);

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
          <h1 className="esp-page-title">
            Especialidades
          </h1>
          <p className="texto-suave">{especialidades.length} especialidades registradas</p>
        </div>
        <div className="esp-header-actions">
          <button className="btn btn-secundario esp-btn-content" onClick={cargar}>
            <RefreshCw size={14} strokeWidth={1.9} />
            Actualizar
          </button>
          <button className="btn btn-primario esp-btn-content"
            onClick={() => { setEspEditar(null); setMostrarForm(true); }}>
            <Plus size={15} strokeWidth={2} />
            Nueva Especialidad
          </button>
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      {cargando ? (
        <div className="cargando esp-loading-state">
          <Loader2 size={16} strokeWidth={1.9} className="esp-loader-icon" />
          Cargando especialidades...
        </div>
      ) : especialidades.length === 0 ? (
        <div className="vacio">No hay especialidades. Crea la primera.</div>
      ) : (
        <div className="esp-grid">
          {especialidades.map(esp => (
            <div key={esp.id} className="esp-card" style={{
              border: `1px solid ${esp.activa ? '#e2e8f0' : '#fca5a580'}`,
              opacity: esp.activa ? 1 : 0.65,
            }}>

              <div className="esp-card-header">
                <div className="esp-card-info">
                  <div className="esp-card-icon" style={{
                    background: esp.color + '20',
                    color: esp.color,
                  }}>
                    {getLucideIcon(esp.icono, { size: 18, strokeWidth: 1.9 })}
                  </div>
                  <div>
                    <div className="esp-card-title">
                      {esp.nombre}
                    </div>
                    {!esp.activa && (
                      <span className="esp-card-inactive">
                        Inactiva
                      </span>
                    )}
                  </div>
                </div>

                <div className="esp-card-actions">
                  <button
                    className="btn btn-secundario esp-action-btn"
                    onClick={() => { setEspEditar(esp); setMostrarForm(true); }}
                    title="Editar"
                  >
                    <Pencil size={13} strokeWidth={1.9} />
                  </button>
                  {esp.activa ? (
                    <button
                      className="btn btn-peligro esp-action-btn"
                      onClick={() => handleDesactivar(esp.id)}
                      title="Desactivar"
                    >
                      <Trash2 size={13} strokeWidth={1.9} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-secundario esp-action-btn reactivate"
                      onClick={() => handleReactivar(esp.id)}
                      title="Reactivar"
                    >
                      <RotateCcw size={13} strokeWidth={1.9} />
                    </button>
                  )}
                </div>
              </div>

              {esp.descripcion && (
                <p className="esp-card-desc">
                  {esp.descripcion}
                </p>
              )}

              <div className="esp-card-footer">
                <div className="esp-color-dot" style={{ background: esp.color }} />
                <span className="esp-icon-label">{esp.icono}</span>
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