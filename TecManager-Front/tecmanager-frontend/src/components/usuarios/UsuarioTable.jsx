import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AsignarEspecialidadesModal from './AsignarEspecialidadesModal';
import { Check, X, Pencil, Wrench, Trash2 } from 'lucide-react';

export default function UsuarioTable({ usuarios, onEditar, onCambiarEstado, onEliminar, onActualizar }) {

  const [usuarioEspecialidades, setUsuarioEspecialidades] = useState(null);
  const [mapaEspecialidades,    setMapaEspecialidades]    = useState({});

  useEffect(() => {
    cargarEspecialidadesTecnicos();
  }, [usuarios]);

  const cargarEspecialidadesTecnicos = async () => {
    const tecnicos = usuarios.filter(u => u.rol === 'TECNICO');
    const mapa = {};
    await Promise.all(
      tecnicos.map(async (t) => {
        try {
          const res = await api.get(`/especialidades/usuario/${t.id}`);
          mapa[t.id] = res.data;
        } catch {
          mapa[t.id] = [];
        }
      })
    );
    setMapaEspecialidades(mapa);
  };

  const getBadgeRol = (rol) => {
    const clases = {
      ADMIN:     'badge badge-admin',
      SUPERVISOR: 'badge badge-supervisor',
      TECNICO:   'badge badge-tecnico',
    };
    return clases[rol] || 'badge';
  };

  if (usuarios.length === 0) {
    return <div className="vacio"><p>No se encontraron usuarios</p></div>;
  }

  return (
    <>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Especialidades</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>

                {/* Avatar + Nombre */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#2563eb', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 15, flexShrink: 0,
                    }}>
                      {usuario.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{usuario.nombre}</span>
                  </div>
                </td>

                <td style={{ color: '#64748b' }}>{usuario.email}</td>

                <td>
                  <span className={getBadgeRol(usuario.rol)}>{usuario.rol}</span>
                </td>

                {/* Especialidades — solo para técnicos */}
                <td>
                  {usuario.rol === 'TECNICO' ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                      {(mapaEspecialidades[usuario.id] || []).length === 0 ? (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Sin especialidades</span>
                      ) : (
                        (mapaEspecialidades[usuario.id] || []).map(esp => (
                          <span key={esp.id} style={{
                            padding: '2px 8px', borderRadius: 20,
                            background: esp.color + '20',
                            color: esp.color,
                            fontSize: 11, fontWeight: 600,
                            border: `1px solid ${esp.color}40`,
                          }}>
                            {esp.nombre}
                          </span>
                        ))
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#cbd5e1' }}>—</span>
                  )}
                </td>

                {/* Estado toggle */}
                <td>
                  <button
                    onClick={() => onCambiarEstado(usuario.id)}
                    style={{
                      padding: '3px 10px', borderRadius: 20,
                      border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600,
                    background: usuario.activo ? '#dcfce7' : '#fee2e2',
                    color: usuario.activo ? '#166534' : '#991b1b',
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}
                >
                  {usuario.activo ? <><Check size={14}/> Activo</> : <><X size={14}/> Inactivo</>}
                </button>
                </td>

                <td style={{ color: '#64748b', fontSize: 13 }}>
                  {usuario.fechaCreacion
                    ? new Date(usuario.fechaCreacion).toLocaleDateString('es-CO')
                    : '—'}
                </td>

                <td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button
                      className="btn btn-secundario"
                      style={{ padding: '5px 10px', fontSize: 12, display: 'flex', alignItems: 'center' }}
                      onClick={() => onEditar(usuario)}
                      title="Editar usuario"
                    >
                      <Pencil size={13} strokeWidth={2} />
                    </button>
                    {/* Botón especialidades solo para técnicos */}
                    {usuario.rol === 'TECNICO' && (
                      <button
                        className="btn btn-secundario"
                        style={{ padding: '5px 10px', fontSize: 12, display: 'flex', alignItems: 'center' }}
                        title="Asignar especialidades"
                        onClick={() => setUsuarioEspecialidades(usuario)}
                      >
                        <Wrench size={13} strokeWidth={2} />
                      </button>
                    )}
                    <button
                      className="btn btn-peligro"
                      style={{ padding: '5px 10px', fontSize: 12, display: 'flex', alignItems: 'center' }}
                      title="Eliminar usuario"
                      onClick={() => onEliminar(usuario.id)}
                    >
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal asignar especialidades */}
      {usuarioEspecialidades && (
        <AsignarEspecialidadesModal
          usuario={usuarioEspecialidades}
          onCerrar={() => setUsuarioEspecialidades(null)}
          onGuardar={() => {
            setUsuarioEspecialidades(null);
            cargarEspecialidadesTecnicos();
            if (onActualizar) onActualizar();
          }}
        />
      )}
    </>
  );
}