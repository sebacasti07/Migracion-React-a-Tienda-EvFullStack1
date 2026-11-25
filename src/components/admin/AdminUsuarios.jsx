import { useEffect, useState } from "react";
import { usuariosApi } from "../../api/servicios";
import { mensajeError } from "../../api/cliente";
import { useConfirmacion } from "./DialogoConfirmacion";
import CampoContraseña from "../CampoContraseña";
import regionesComunas from "../../data/regionesComunas";
import { NOMBRE_ROL, ROLES } from "../../utils/permisos";
import { correoPermitido, normalizarRun, runValido } from "../../utils/validaciones";
import { useAuth } from "../../context/AuthContext";

const vacio = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  rol: ROLES.CLIENTE,
  region: "",
  comuna: "",
  direccion: ""
};

// Mantenedor de usuarios y roles (RF-008, solo ADMIN): /api/v1/usuarios
function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(vacio);
  const [aviso, setAviso] = useState(null);
  const { confirmar, dialogo } = useConfirmacion();
  const { usuario: yo } = useAuth();
  const comunas = regionesComunas.find((r) => r.region === form.region)?.comunas ?? [];

  function cargar() {
    return usuariosApi
      .listar()
      .then(setUsuarios)
      .catch((e) => setAviso({ tipo: "danger", texto: mensajeError(e) }));
  }

  useEffect(() => {
    usuariosApi
      .listar()
      .then(setUsuarios)
      .catch((e) => setAviso({ tipo: "danger", texto: mensajeError(e) }));
  }, []);

  function cambiar(campo, valor) {
    setForm((a) => ({ ...a, [campo]: valor }));
  }

  function validar() {
    if (!runValido(form.run)) return "El RUN no es válido.";
    if (!form.nombre.trim() || !form.apellidos.trim()) return "Nombre y apellidos son obligatorios.";
    if (!correoPermitido(form.correo)) return "Solo correos @duoc.cl, @duocuc.cl, @profesor.duoc.cl o @gmail.com.";
    if (!form.id && form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (form.id && form.password && form.password.length < 8) return "La nueva contraseña debe tener al menos 8 caracteres.";
    return "";
  }

  async function guardar(event) {
    event.preventDefault();
    const problema = validar();
    if (problema) {
      setAviso({ tipo: "danger", texto: problema });
      return;
    }
    const datos = {
      run: normalizarRun(form.run),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim().toLowerCase(),
      password: form.password || null,
      rol: form.rol,
      region: form.region || null,
      comuna: form.comuna || null,
      direccion: form.direccion?.trim() || null,
      fechaNacimiento: form.fechaNacimiento || null
    };
    const ejecutar = async () => {
      try {
        if (form.id) await usuariosApi.actualizar(form.id, datos);
        else await usuariosApi.crear(datos);
        setAviso({ tipo: "success", texto: form.id ? "Usuario actualizado." : "Usuario creado." });
        setForm(vacio);
        await cargar();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    };
    if (form.id) confirmar("¿Guardar los cambios del usuario?", ejecutar);
    else ejecutar();
  }

  function eliminar(u) {
    confirmar(`¿Eliminar al usuario ${u.correo}?`, async () => {
      try {
        await usuariosApi.eliminar(u.id);
        setAviso({ tipo: "success", texto: "Usuario eliminado." });
        await cargar();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    }, true);
  }

  return (
    <div className="admin-contenido">
      <div>
        <h3>{form.id ? "Editar usuario" : "Crear usuario"}</h3>
        <form className="formulario-admin" onSubmit={guardar} noValidate>
          <label htmlFor="au-run">RUN (sin puntos ni guion)</label>
          <input id="au-run" value={form.run} onChange={(e) => cambiar("run", e.target.value)} maxLength={12} required />
          <label htmlFor="au-nombre">Nombre</label>
          <input id="au-nombre" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} maxLength={50} required />
          <label htmlFor="au-apellidos">Apellidos</label>
          <input id="au-apellidos" value={form.apellidos} onChange={(e) => cambiar("apellidos", e.target.value)} maxLength={100} required />
          <label htmlFor="au-correo">Correo</label>
          <input id="au-correo" type="email" value={form.correo} onChange={(e) => cambiar("correo", e.target.value)} maxLength={100} required />
          <label htmlFor="au-rol">Rol</label>
          <select id="au-rol" value={form.rol} onChange={(e) => cambiar("rol", e.target.value)}>
            {Object.values(ROLES).map((r) => <option key={r} value={r}>{NOMBRE_ROL[r]}</option>)}
          </select>
          <label htmlFor="au-region">Región</label>
          <select id="au-region" value={form.region ?? ""} onChange={(e) => setForm((a) => ({ ...a, region: e.target.value, comuna: "" }))}>
            <option value="">Sin región</option>
            {regionesComunas.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
          </select>
          <label htmlFor="au-comuna">Comuna</label>
          <select id="au-comuna" value={form.comuna ?? ""} onChange={(e) => cambiar("comuna", e.target.value)} disabled={!form.region}>
            <option value="">Sin comuna</option>
            {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label htmlFor="au-direccion">Dirección</label>
          <input id="au-direccion" value={form.direccion ?? ""} onChange={(e) => cambiar("direccion", e.target.value)} maxLength={300} />
          <label htmlFor="au-password">Contraseña {form.id && "(dejar vacía para conservarla)"}</label>
          <CampoContraseña id="au-password" autoComplete="new-password" value={form.password}
            onChange={(e) => cambiar("password", e.target.value)} required={!form.id} />
          <div className="acciones-admin">
            <button type="submit">{form.id ? "Guardar cambios" : "Crear usuario"}</button>
            {form.id && <button type="button" className="boton-secundario-admin" onClick={() => setForm(vacio)}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div>
        <h3>Usuarios ({usuarios.length})</h3>
        {aviso && <div className={`alert alert-${aviso.tipo} py-2`} role="status">{aviso.texto}</div>}
        <ul className="lista-admin">
          {usuarios.map((u) => (
            <li key={u.id}>
              <span>
                {u.nombre} {u.apellidos}
                <small className="d-block text-secondary">{u.correo}</small>
                <span className="badge bg-warning text-dark">{NOMBRE_ROL[u.rol]}</span>
              </span>
              <div className="acciones-admin">
                <button type="button" onClick={() => setForm({ ...vacio, ...u, password: "" })}>Editar</button>
                {u.correo !== yo?.correo && (
                  <button type="button" className="boton-eliminar-admin" onClick={() => eliminar(u)}>Eliminar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {dialogo}
    </div>
  );
}

export default AdminUsuarios;
