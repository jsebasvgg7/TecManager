import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  Wrench, Server, Monitor, Database, Network,
  Code, Shield, Wifi, HardDrive, Cpu,
  Globe, Lock, Settings, AlertTriangle, Tag,
  X, Loader2, Check
} from 'lucide-react';

/* ── Icon map ─────────────────────────────────────────────── */
const ICON_MAP = {
  Wrench, Server, Monitor, Database, Network,
  Code, Shield, Wifi, HardDrive, Cpu,
  Globe, Lock, Settings, AlertTriangle, Etiqueta: Tag,
};

function getLucideIcon(name, props = {}) {
  const Icon = ICON_MAP[name] || Wrench;
  return <Icon {...props} />;
}

export default function AsignarEspecialidadesModal({ usuario, onCerrar, onGuardar }) {
  const [especialidades,    setEspecialidades]    = useState([]);
  const [seleccionadas,     setSeleccionadas]     = useState([]);
  const [cargando,          setCargando]          = useState(true);
  const [guardando,         setGuardando]         = useState(false);
  const [error,             setError]             = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [todasRes, asignadasRes] = await Promise.all([
        api.get('/especialidades/activas'),
        api.get(`/especialidades/usuario/${usuario.id}`),
      ]);
      setEspecialidades(todasRes.data);
      setSeleccionadas(asignadasRes.data.map(e => e.id));
    } catch {
      setError('Error al cargar especialidades');
    } finally {
      setCargando(false);
    }
  };

  const toggleEspecialidad = (id) => {
    setSeleccionadas(prev =>
      prev.includes(id)
        ? prev.filter(eid => eid !== id)
        : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await api.put(`/especialidades/usuario/${usuario.id}`, seleccionadas);
      onGuardar();
    } catch {
      setError('Error al asignar especialidades');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 480 }}>

        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wrench size={20} strokeWidth={1.9} />
              Especialidades
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              {usuario.nombre}
            </p>
          </div>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={16} />
          </button>
        </div>

        {error && <div className="alerta alerta-error">{error}</div>}

        {cargando ? (
          <div className="cargando" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Loader2 size={16} className="spin" strokeWidth={2} /> Cargando...
          </div>
        ) : especialidades.length === 0 ? (
          <div className="vacio">No hay especialidades activas. Crea una primero.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {especialidades.map(esp => {
              const seleccionada = seleccionadas.includes(esp.id);
              return (
                <div
                  key={esp.id}
                  onClick={() => toggleEspecialidad(esp.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `2px solid ${seleccionada ? esp.color : '#e2e8f0'}`,
                    background: seleccionada ? esp.color + '10' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Checkbox visual */}
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${seleccionada ? esp.color : '#cbd5e1'}`,
                    background: seleccionada ? esp.color : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.15s',
                  }}>
                    {seleccionada ? <Check size={14} strokeWidth={3} /> : ''}
                  </div>

                  {/* Ícono color */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: esp.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: esp.color, flexShrink: 0,
                  }}>
                    {getLucideIcon(esp.icono, { size: 16, strokeWidth: 1.9 })}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 14,
                      color: seleccionada ? esp.color : '#1e293b',
                    }}>
                      {esp.nombre}
                    </div>
                    {esp.descripcion && (
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {esp.descripcion}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resumen */}
        <div style={{
          padding: '8px 12px', background: '#f8fafc',
          borderRadius: 8, marginBottom: 12,
          fontSize: 13, color: '#64748b',
        }}>
          {seleccionadas.length === 0
            ? 'Sin especialidades asignadas'
            : `${seleccionadas.length} especialidad${seleccionadas.length > 1 ? 'es' : ''} seleccionada${seleccionadas.length > 1 ? 's' : ''}`
          }
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="btn btn-primario"
            onClick={handleGuardar}
            disabled={guardando}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {guardando ? <><Loader2 size={14} className="spin" /> Guardando...</> : 'Guardar especialidades'}
          </button>
        </div>
      </div>
    </div>
  );
}