export default function UsuarioTable({ usuarios, onEditar, onCambiarEstado, onEliminar }) {

  const getBadgeRol = (rol) => {
    const clases = {
      ADMIN: 'badge badge-admin',
      ASIGNADOR: 'badge badge-asignador',
      TECNICO: 'badge badge-tecnico',
    };
    return clases[rol] || 'badge';
  };

  if (usuarios.length === 0) {
    return (
      <div className="vacio">
        <p>No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%', background: '#2563eb',
                    color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '15px', flexShrink: 0
                  }}>
                    {usuario.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '500' }}>{usuario.nombre}</span>
                </div>
              </td>

              <td style={{ color: '#64748b' }}>{usuario.email}</td>

              <td>
                <span className={getBadgeRol(usuario.rol)}>
                  {usuario.rol}
                </span>
              </td>

              {/* Estado — toggle activo/inactivo */}
              <td>
                <button
                  onClick={() => onCambiarEstado(usuario.id)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: usuario.activo ? '#dcfce7' : '#fee2e2',
                    color: usuario.activo ? '#166534' : '#991b1b',
                  }}
                >
                  {usuario.activo ? '✓ Activo' : '✗ Inactivo'}
                </button>
              </td>

              <td style={{ color: '#64748b', fontSize: '13px' }}>
                {usuario.fechaCreacion
                  ? new Date(usuario.fechaCreacion).toLocaleDateString('es-CO')
                  : '—'}
              </td>

              {/* Acciones */}
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-secundario"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    onClick={() => onEditar(usuario)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-peligro"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    onClick={() => onEliminar(usuario.id)}
                  >
                    🗑️
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}