import { useState } from "react";
import { categoriasApi } from "../../api/servicios";
import { mensajeError } from "../../api/cliente";
import { useConfirmacion } from "./DialogoConfirmacion";

const vacia = { nombre: "", descripcion: "" };

// Mantenedor de categorías (solo ADMIN): /api/v1/categorias
function AdminCategorias({ catalogo }) {
  const { categorias, productos, recargar } = catalogo;
  const [form, setForm] = useState(vacia);
  const [aviso, setAviso] = useState(null);
  const { confirmar, dialogo } = useConfirmacion();

  async function guardar(event) {
    event.preventDefault();
    if (!form.nombre.trim()) {
      setAviso({ tipo: "danger", texto: "El nombre es obligatorio." });
      return;
    }
    try {
      const datos = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() };
      if (form.id) await categoriasApi.actualizar(form.id, datos);
      else await categoriasApi.crear(datos);
      setAviso({ tipo: "success", texto: form.id ? "Categoría actualizada." : "Categoría creada." });
      setForm(vacia);
      await recargar();
    } catch (e) {
      setAviso({ tipo: "danger", texto: mensajeError(e) });
    }
  }

  function eliminar(categoria) {
    confirmar(`¿Eliminar la categoría "${categoria.nombre}"?`, async () => {
      try {
        await categoriasApi.eliminar(categoria.id);
        setAviso({ tipo: "success", texto: "Categoría eliminada." });
        await recargar();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    }, true);
  }

  return (
    <div className="admin-contenido">
      <div>
        <h3>{form.id ? "Editar categoría" : "Crear categoría"}</h3>
        <form className="formulario-admin" onSubmit={guardar} noValidate>
          <label htmlFor="ac-nombre">Nombre</label>
          <input id="ac-nombre" value={form.nombre} maxLength={60} required
            onChange={(e) => setForm((a) => ({ ...a, nombre: e.target.value }))} />
          <label htmlFor="ac-descripcion">Descripción</label>
          <textarea id="ac-descripcion" value={form.descripcion ?? ""} maxLength={255}
            onChange={(e) => setForm((a) => ({ ...a, descripcion: e.target.value }))} />
          <div className="acciones-admin">
            <button type="submit">{form.id ? "Guardar cambios" : "Crear categoría"}</button>
            {form.id && <button type="button" className="boton-secundario-admin" onClick={() => setForm(vacia)}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div>
        <h3>Categorías ({categorias.length})</h3>
        {aviso && <div className={`alert alert-${aviso.tipo} py-2`} role="status">{aviso.texto}</div>}
        <ul className="lista-admin">
          {categorias.map((c) => (
            <li key={c.id}>
              <span>{c.nombre} <small className="text-secondary">({productos.filter((p) => p.categoriaId === c.id).length} productos)</small></span>
              <div className="acciones-admin">
                <button type="button" onClick={() => setForm({ ...c, descripcion: c.descripcion ?? "" })}>Editar</button>
                <button type="button" className="boton-eliminar-admin" onClick={() => eliminar(c)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {dialogo}
    </div>
  );
}

export default AdminCategorias;
