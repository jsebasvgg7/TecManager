import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
  Plus, Pencil, Tag, RefreshCw, Loader2,
  X, Clock, CheckCircle, Trash2,
  Wrench, Server, Monitor, Database,
  Network, Code, Shield, Wifi, HardDrive,
  Cpu, Globe, Lock, Settings, AlertTriangle,
} from 'lucide-react';

const ICONOS = [
  { nombre: 'Etiqueta',        componente: Tag           },
  { nombre: 'Herramienta',     componente: Wrench        },
  { nombre: 'Servidor',        componente: Server        },
  { nombre: 'Monitor',         componente: Monitor       },
  { nombre: 'Base de datos',   componente: Database      },
  { nombre: 'Red',             componente: Network       },
  { nombre: 'Código',          componente: Code          },
  { nombre: 'Seguridad',       componente: Shield        },
  { nombre: 'Wifi',            componente: Wifi          },
  { nombre: 'Disco duro',      componente: HardDrive     },
  { nombre: 'Procesador',      componente: Cpu           },
  { nombre: 'Internet',        componente: Globe         },
  { nombre: 'Candado',         componente: Lock          },
  { nombre: 'Configuración',   componente: Settings      },
  { nombre: 'Alerta',          componente: AlertTriangle },
];

const COLORES_PRESET = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#ef4444', '#f59e0b', '#22c55e', '#14b8a6',
  '#0ea5e9', '#262424',
];

function IconoComponente({ nombre, size = 18, color }) {
  const found = ICONOS.find(i => i.nombre === nombre);
  const Comp  = found ? found.componente : Tag;
  return <Comp size={size} strokeWidth={2} style={{ color }} />;
}

function CategoriaModal({ categoria, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre:        categoria?.nombre        || '',
    descripcion:   categoria?.descripcion   || '',
    color:         categoria?.color         || '#3b82f6',
    icono:         categoria?.icono         || 'Etiqueta',
    slaAltaHoras:  categoria?.slaAltaHoras  ?? 4,
    slaMediaHoras: categoria?.slaMediaHoras ?? 24,
    slaBajaHoras:  categoria?.slaBajaHoras  ?? 72,
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
      <div className="modal" style={{ maxWidth: 520 }}>

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: form.color + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconoComponente nombre={form.icono} size={16} color={form.color} />
            </div>
            <h2>{categoria ? 'Editar categoría' : 'Nueva categoría'}</h2>
          </div>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alerta alerta-error">{error}</div>}

          <div className="form-grupo">
            <label>Nombre *</label>
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Infraestructura" required
            />
          </div>

          <div className="form-grupo">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe el tipo de tareas en esta categoría..."
              rows={2} style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

            <div className="form-grupo">
              <label>Color</label>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 7,
                padding: 8, background: '#f7f4f0',
                borderRadius: 10, border: '1px solid #d9cfc4',
              }}>
                {COLORES_PRESET.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, color: c })}
                    style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: c, cursor: 'pointer',
                      border: form.color === c ? '3px solid #262424' : '2px solid transparent',
                      transition: 'border 0.15s',
                    }}
                  />
                ))}
                <input type="color" value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  style={{ width: 24, height: 24, border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%' }}
                  title="Color personalizado"
                />
              </div>
            </div>

            <div className="form-grupo">
              <label>Ícono</label>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 6,
                padding: 8, background: '#f7f4f0',
                borderRadius: 10, border: '1px solid #d9cfc4',
                maxHeight: 110, overflowY: 'auto',
              }}>
                {ICONOS.map(({ nombre, componente: Comp }) => (
                  <button
                    key={nombre} type="button"
                    title={nombre}
                    onClick={() => setForm({ ...form, icono: nombre })}
                    style={{
                      width: 32, height: 32,
                      borderRadius: 8,
                      border: `1.5px solid ${form.icono === nombre ? form.color : '#d9cfc4'}`,
                      background: form.icono === nombre ? form.color + '20' : '#ffffff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Comp size={15} strokeWidth={2}
                      style={{ color: form.icono === nombre ? form.color : '#6b6868' }}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#6b6868', marginTop: 3 }}>
                Seleccionado: <strong>{form.icono}</strong>
              </div>
            </div>

          </div>

          <div className="form-grupo">
            <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={11} strokeWidth={2.5} />
              Tiempo límite por prioridad (horas)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { key: 'slaAltaHoras',  label: 'Alta',  color: '#ef4444', bg: '#fee2e2' },
                { key: 'slaMediaHoras', label: 'Media', color: '#f59e0b', bg: '#fef3c7' },
                { key: 'slaBajaHoras',  label: 'Baja',  color: '#22c55e', bg: '#dcfce7' },
              ].map(({ key, label, color, bg }) => (
                <div key={key}>
                  <div style={{
                    fontSize: 11, fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                    color, marginBottom: 5,
                    background: bg, padding: '2px 8px',
                    borderRadius: 6, display: 'inline-block',
                  }}>
                    {label}
                  </div>
                  <input
                    type="number" min="1" value={form[key]}
                    onChange={e => setForm({ ...form, [key]: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', textAlign: 'center' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando
                ? <><Loader2 size={14} className="spin" /> Guardando...</>
                : categoria ? 'Actualizar' : 'Crear categoría'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriasPage() {
  const [categorias,  setCategorias]  = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [error,       setError]       = useState('');
  const [exito,       setExito]       = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [catEditar,   setCatEditar]   = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      setCargando(true);
      const r = await api.get('/categorias');
      setCategorias(r.data);
    } catch {
      setError('Error al cargar categorías');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (datos) => {
    try {
      if (catEditar) {
        await api.put(`/categorias/${catEditar.id}`, datos);
        mostrarExito('Categoría actualizada');
      } else {
        await api.post('/categorias', datos);
        mostrarExito('Categoría creada');
      }
      setMostrarForm(false);
      setCatEditar(null);
      cargar();
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || 'Error al guardar');
    }
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm('¿Desactivar esta categoría?')) return;
    try {
      await api.delete(`/categorias/${id}`);
      mostrarExito('Categoría desactivada');
      cargar();
    } catch {
      setError('Error al desactivar');
    }
  };

  const handleReactivar = async (id) => {
    try {
      await api.patch(`/categorias/${id}/reactivar`);
      mostrarExito('Categoría reactivada');
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
          <p className="dash-eyebrow">Administración</p>
          <h1>Categorías</h1>
          <p className="texto-suave">{categorias.length} categorías registradas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="dash-refresh-btn" onClick={cargar}>
            <RefreshCw size={13} strokeWidth={2.5} /> Actualizar
          </button>
          <button className="btn btn-primario"
            onClick={() => { setCatEditar(null); setMostrarForm(true); }}>
            <Plus size={15} strokeWidth={2.5} /> Nueva categoría
          </button>
        </div>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}
      {exito && <div className="alerta alerta-exito">{exito}</div>}

      {cargando ? (
        <div className="cargando"><RefreshCw size={18} className="spin" /> Cargando...</div>
      ) : categorias.length === 0 ? (
        <div className="vacio">No hay categorías. Crea la primera.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {categorias.map(cat => (
            <div key={cat.id} style={{
              background: '#ffffff',
              border: `1px solid ${cat.activa ? 'rgba(238,229,218,0.70)' : '#fca5a580'}`,
              borderRadius: 14, padding: 18,
              boxShadow: '0 1px 4px rgba(38,36,36,0.07)',
              opacity: cat.activa ? 1 : 0.65,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: cat.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconoComponente nombre={cat.icono} size={18} color={cat.color} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                      fontSize: 14.5, color: '#262424',
                    }}>
                      {cat.nombre}
                    </div>
                    {!cat.activa && (
                      <span style={{ fontSize: 10, color: '#ef4444', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
                        Inactiva
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 5 }}>
                  <button className="tarea-icon-btn"
                    onClick={() => { setCatEditar(cat); setMostrarForm(true); }}
                    title="Editar">
                    <Pencil size={13} strokeWidth={2} />
                  </button>
                  {cat.activa ? (
                    <button className="tarea-icon-btn"
                      onClick={() => handleDesactivar(cat.id)}
                      title="Desactivar"
                      style={{ color: '#ef4444' }}>
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  ) : (
                    <button className="tarea-icon-btn"
                      onClick={() => handleReactivar(cat.id)}
                      title="Reactivar"
                      style={{ color: '#22c55e' }}>
                      <CheckCircle size={13} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>

              {cat.descripcion && (
                <p style={{ fontSize: 13, color: '#3a3737', lineHeight: 1.55 }}>
                  {cat.descripcion}
                </p>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'Alta',  horas: cat.slaAltaHoras,  color: '#ef4444', bg: '#fee2e2' },
                  { label: 'Media', horas: cat.slaMediaHoras, color: '#f59e0b', bg: '#fef3c7' },
                  { label: 'Baja',  horas: cat.slaBajaHoras,  color: '#22c55e', bg: '#dcfce7' },
                ].map(({ label, horas, color, bg }) => (
                  <span key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 9px',
                    background: bg, color,
                    borderRadius: 100, fontSize: 11,
                    fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                  }}>
                    <Clock size={9} strokeWidth={2.5} />
                    {label}: {horas}h
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarForm && (
        <CategoriaModal
          categoria={catEditar}
          onGuardar={handleGuardar}
          onCerrar={() => { setMostrarForm(false); setCatEditar(null); }}
        />
      )}
    </div>
  );
}