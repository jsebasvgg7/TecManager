import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  X, FileText, AlignLeft, Flag, User, Calendar,
  Clock, Loader2, Tag, Users, Plus, XCircle
} from 'lucide-react';

const PRIORIDADES = [
  { valor: 'ALTA',  label: 'Alta',  color: '#ef4444', bg: '#fee2e2' },
  { valor: 'MEDIA', label: 'Media', color: '#f59e0b', bg: '#fef3c7' },
  { valor: 'BAJA',  label: 'Baja',  color: '#22c55e', bg: '#dcfce7' },
];

export default function TareaForm({ tarea, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    titulo:              tarea?.titulo || '',
    descripcion:         tarea?.descripcion || '',
    prioridad:           tarea?.prioridad || 'MEDIA',
    tecnicoId:           tarea?.tecnicoId || '',
    tecnicosIds:         tarea?.tecnicosIds || [],
    fechaLimite:         tarea?.fechaLimite ? new Date(tarea.fechaLimite).toISOString().slice(0, 16) : '',
    tiempoEstimadoHoras: tarea?.tiempoEstimadoHoras || '',
    categoriaId:         tarea?.categoriaId || '',
    etiquetas:           tarea?.etiquetas || [],
  });

  const [tecnicos,    setTecnicos]    = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [error,       setError]       = useState('');
  const [guardando,   setGuardando]   = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/usuarios/rol/TECNICO'),
      api.get('/categorias/activas'),
    ]).then(([tRes, cRes]) => {
      setTecnicos(tRes.data.filter(t => t.activo));
      setCategorias(cRes.data);
    }).catch(() => setError('Error al cargar datos'));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Colaboradores — agregar/quitar
  const toggleColaborador = (id) => {
    if (id === form.tecnicoId) return; // no puede ser responsable y colaborador
    setForm(prev => ({
      ...prev,
      tecnicosIds: prev.tecnicosIds.includes(id)
        ? prev.tecnicosIds.filter(t => t !== id)
        : [...prev.tecnicosIds, id],
    }));
  };

  // Etiquetas
  const agregarEtiqueta = () => {
    const val = etiquetaInput.trim();
    if (!val || form.etiquetas.includes(val)) return;
    setForm(prev => ({ ...prev, etiquetas: [...prev.etiquetas, val] }));
    setEtiquetaInput('');
  };

  const quitarEtiqueta = (tag) => {
    setForm(prev => ({ ...prev, etiquetas: prev.etiquetas.filter(e => e !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await onGuardar({
        ...form,
        fechaLimite: form.fechaLimite
          ? new Date(form.fechaLimite).toISOString().replace('Z', '')
          : null,
        tiempoEstimadoHoras: form.tiempoEstimadoHoras
          ? parseInt(form.tiempoEstimadoHoras)
          : null,
        tecnicoId:   form.tecnicoId   || null,
        categoriaId: form.categoriaId || null,
      });
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // Categoría seleccionada (para mostrar SLA)
  const catSeleccionada = categorias.find(c => c.id === form.categoriaId);
  const slaActual = catSeleccionada
    ? ({ ALTA: catSeleccionada.slaAltaHoras, MEDIA: catSeleccionada.slaMediaHoras, BAJA: catSeleccionada.slaBajaHoras }[form.prioridad])
    : null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f7f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FileText size={16} strokeWidth={2} style={{ color: '#262424' }} />
            </div>
            <h2>{tarea ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          </div>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alerta alerta-error">{error}</div>}

          {/* Título */}
          <div className="form-grupo">
            <label>
              <FileText size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
              Título *
            </label>
            <input
              name="titulo" value={form.titulo} onChange={handleChange}
              placeholder="Ej: Instalar servidor web" required
            />
          </div>

          {/* Descripción */}
          <div className="form-grupo">
            <label>
              <AlignLeft size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
              Descripción
            </label>
            <textarea
              name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Describe la tarea en detalle..." rows={3} style={{ resize: 'vertical' }}
            />
          </div>

          {/* Prioridad visual */}
          <div className="form-grupo">
            <label>
              <Flag size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
              Prioridad *
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORIDADES.map(({ valor, label, color, bg }) => {
                const activo = form.prioridad === valor;
                return (
                  <button key={valor} type="button"
                    onClick={() => setForm({ ...form, prioridad: valor })}
                    style={{
                      flex: 1, padding: '8px 0',
                      border: `1.5px solid ${activo ? color : '#EEE5DA'}`,
                      borderRadius: 10, background: activo ? bg : '#fafaf9',
                      cursor: 'pointer', fontSize: 13,
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: activo ? 700 : 500,
                      color: activo ? color : '#6b6868',
                      transition: 'all 0.15s',
                    }}
                  >{label}</button>
                );
              })}
            </div>
          </div>

          {/* Categoría */}
          <div className="form-grupo">
            <label>
              <Tag size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
              Categoría
            </label>
            <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
              <option value="">Sin categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            {/* Indicador SLA */}
            {slaActual && (
              <div style={{
                marginTop: 6, padding: '6px 12px',
                background: '#f0fdf4', border: '1px solid #86efac',
                borderRadius: 8, fontSize: 12,
                color: '#166534', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Clock size={11} strokeWidth={2.5} />
                SLA automático: <strong>{slaActual}h</strong> para prioridad {form.prioridad.toLowerCase()}
              </div>
            )}
          </div>

          {/* Técnico responsable + Fecha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-grupo">
              <label>
                <User size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
                Técnico responsable
              </label>
              <select name="tecnicoId" value={form.tecnicoId} onChange={handleChange}>
                <option value="">Sin asignar</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-grupo">
              <label>
                <Calendar size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
                Fecha límite *
              </label>
              <input
                name="fechaLimite" type="datetime-local"
                value={form.fechaLimite} onChange={handleChange} required
              />
            </div>
          </div>

          {/* Colaboradores */}
          {tecnicos.length > 0 && (
            <div className="form-grupo">
              <label>
                <Users size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
                Técnicos colaboradores
              </label>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 7,
                padding: '10px 12px',
                border: '1px solid #d9cfc4',
                borderRadius: 10, background: '#f7f4f0',
                minHeight: 44,
              }}>
                {tecnicos
                  .filter(t => t.id !== form.tecnicoId)
                  .map(t => {
                    const sel = form.tecnicosIds.includes(t.id);
                    return (
                      <button
                        key={t.id} type="button"
                        onClick={() => toggleColaborador(t.id)}
                        style={{
                          padding: '4px 11px',
                          borderRadius: 100,
                          border: `1.5px solid ${sel ? '#262424' : '#d9cfc4'}`,
                          background: sel ? '#262424' : '#ffffff',
                          color: sel ? '#EEE5DA' : '#3a3737',
                          fontSize: 12,
                          fontFamily: 'Nunito, sans-serif',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {t.nombre}
                      </button>
                    );
                  })}
                {tecnicos.filter(t => t.id !== form.tecnicoId).length === 0 && (
                  <span style={{ fontSize: 12, color: '#9b9898' }}>
                    Selecciona un técnico responsable primero
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tiempo estimado */}
          <div className="form-grupo">
            <label>
              <Clock size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
              Tiempo estimado (horas)
            </label>
            <input
              name="tiempoEstimadoHoras" type="number"
              value={form.tiempoEstimadoHoras} onChange={handleChange}
              placeholder="Ej: 4" min="1"
            />
          </div>

          {/* Etiquetas */}
          <div className="form-grupo">
            <label>
              <Tag size={11} strokeWidth={2.5} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
              Etiquetas
            </label>
            {/* Input para agregar */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={etiquetaInput}
                onChange={e => setEtiquetaInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarEtiqueta(); }}}
                placeholder="Escribe y presiona Enter..."
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={agregarEtiqueta}
                style={{
                  padding: '0 14px',
                  background: '#262424', color: '#EEE5DA',
                  border: 'none', borderRadius: 10,
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 5,
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12,
                }}
              >
                <Plus size={13} strokeWidth={2.5} /> Añadir
              </button>
            </div>
            {/* Tags existentes */}
            {form.etiquetas.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {form.etiquetas.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px',
                    background: '#EEE5DA', color: '#262424',
                    borderRadius: 100, fontSize: 12,
                    fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                  }}>
                    {tag}
                    <XCircle
                      size={12} strokeWidth={2.5}
                      style={{ cursor: 'pointer', opacity: 0.6 }}
                      onClick={() => quitarEtiqueta(tag)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando
                ? <><Loader2 size={14} className="spin" /> Guardando...</>
                : tarea ? 'Actualizar tarea' : 'Crear tarea'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}