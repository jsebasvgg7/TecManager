import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function UsuarioForm({ usuario, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre:   usuario?.nombre || '',
    email:    usuario?.email  || '',
    password: '',
    rol:      usuario?.rol    || 'TECNICO',
  });
  const [error,     setError]     = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!usuario && !form.password) { setError('La contraseña es obligatoria'); return; }
    setGuardando(true);
    try {
      const datos = { ...form };
      if (usuario && !datos.password) delete datos.password;
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

        <div className="modal-header">
          <h2>{usuario ? 'Editar usuario' : 'Nuevo usuario'}</h2>
          <button className="modal-cerrar" onClick={onCerrar}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alerta alerta-error">{error}</div>}

          <div className="form-grupo">
            <label>Nombre completo</label>
            <input name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Ej: Carlos López" required />
          </div>

          <div className="form-grupo">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="usuario@sistema.com" required />
          </div>

          <div className="form-grupo">
            <label>
              Contraseña
              {usuario && <span style={{ color:'#6b6868', fontWeight:400, fontSize:11 }}> — dejar vacío para no cambiar</span>}
            </label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder={usuario ? '••••••••' : 'Mínimo 6 caracteres'}
              minLength={form.password ? 6 : undefined} />
          </div>

          <div className="form-grupo">
            <label>Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option value="TECNICO">Técnico</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando
                ? <><Loader2 size={14} className="spin" /> Guardando...</>
                : usuario ? 'Actualizar' : 'Crear usuario'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}