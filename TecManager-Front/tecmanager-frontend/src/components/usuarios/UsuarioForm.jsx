import { useState } from 'react';

export default function UsuarioForm({ usuario, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    password: '',
    rol: usuario?.rol || 'TECNICO',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación: password obligatorio solo al crear
    if (!usuario && !form.password) {
      setError('La contraseña es obligatoria');
      return;
    }

    setGuardando(true);
    try {
      // Si estamos editando y no se ingresó password, no lo enviamos
      const datos = { ...form };
      if (usuario && !datos.password) {
        delete datos.password;
      }
      await onGuardar(datos);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <h2>{usuario ? '✏️ Editar Usuario' : '+ Nuevo Usuario'}</h2>
          <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {error && <div className="alerta alerta-error">{error}</div>}

          <div className="form-grupo">
            <label>Nombre completo</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Carlos López"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@sistema.com"
              required
            />
          </div>

          <div className="form-grupo">
            <label>
              Contraseña
              {usuario && <span style={{ color: '#64748b', fontWeight: 400 }}>
                {' '}(dejar vacío para no cambiar)
              </span>}
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={usuario ? '••••••••' : 'Mínimo 6 caracteres'}
              minLength={form.password ? 6 : undefined}
            />
          </div>

          <div className="form-grupo">
            <label>Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option value="TECNICO">Técnico</option>
              <option value="ASIGNADOR">Asignador</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={onCerrar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primario"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear Usuario'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}