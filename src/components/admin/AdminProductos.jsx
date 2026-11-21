import { useState } from "react";
import { productosApi } from "../../api/servicios";
import { mensajeError } from "../../api/cliente";
import { formatearPrecio } from "../../utils/formato";
import { useConfirmacion } from "./DialogoConfirmacion";

const productoVacio = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  precioOferta: "",
  stock: "",
  stockCritico: "5",
  categoriaId: "",
  emoji: "🛍️",
  imagen: ""
};

// Mantenedor de productos (RF-007).
// - ADMIN (puedeEditar=true): crear, editar y eliminar con POST/PUT/DELETE /api/v1/productos
// - VENDEDOR (puedeEditar=false): solo ve la lista y el detalle
function AdminProductos({ catalogo, puedeEditar }) {
  const { productos, categorias, recargar } = catalogo;
  const [form, setForm] = useState(productoVacio);
  const [seleccionado, setSeleccionado] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [filtro, setFiltro] = useState("");
  const { confirmar, dialogo } = useConfirmacion();

  const lista = productos.filter((p) =>
    `${p.codigo} ${p.nombre} ${p.categoria}`.toLowerCase().includes(filtro.toLowerCase())
  );

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  function editar(producto) {
    setForm({
      ...producto,
      precio: String(producto.precio),
      precioOferta: producto.precioOferta ? String(producto.precioOferta) : "",
      stock: String(producto.stock),
      stockCritico: String(producto.stockCritico),
      categoriaId: String(producto.categoriaId),
      imagen: producto.imagen ?? "",
      emoji: producto.emoji ?? ""
    });
    setAviso(null);
  }

  function datosParaApi() {
    return {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      precioOferta: form.precioOferta ? Number(form.precioOferta) : null,
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico),
      categoriaId: Number(form.categoriaId),
      emoji: form.emoji,
      imagen: form.imagen.trim()
    };
  }

  function validar(datos) {
    if (datos.codigo.length < 3) return "El código debe tener al menos 3 caracteres.";
    if (!datos.nombre) return "El nombre es obligatorio.";
    if (!(datos.precio > 0)) return "El precio debe ser mayor a cero.";
    if (datos.precioOferta !== null && datos.precioOferta >= datos.precio) return "El precio de oferta debe ser menor al precio.";
    if (!Number.isInteger(datos.stock) || datos.stock < 0) return "El stock debe ser un entero mayor o igual a 0.";
    if (!Number.isInteger(datos.stockCritico) || datos.stockCritico < 0) return "El stock crítico debe ser un entero mayor o igual a 0.";
    if (!datos.categoriaId) return "Selecciona una categoría.";
    return "";
  }

  async function guardar(event) {
    event.preventDefault();
    const datos = datosParaApi();
    const problema = validar(datos);
    if (problema) {
      setAviso({ tipo: "danger", texto: problema });
      return;
    }

    const ejecutar = async () => {
      try {
        if (form.id) {
          await productosApi.actualizar(form.id, datos);
          setAviso({ tipo: "success", texto: "Producto actualizado." });
        } else {
          await productosApi.crear(datos);
          setAviso({ tipo: "success", texto: "Producto creado." });
        }
        setForm(productoVacio);
        await recargar();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    };

    if (form.id) confirmar("¿Guardar los cambios del producto?", ejecutar);
    else ejecutar();
  }

  function eliminar(producto) {
    confirmar(`¿Eliminar el producto "${producto.nombre}"?`, async () => {
      try {
        await productosApi.eliminar(producto.id);
        setAviso({ tipo: "success", texto: "Producto eliminado." });
        if (form.id === producto.id) setForm(productoVacio);
        await recargar();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    }, true);
  }

  return (
    <div className={puedeEditar ? "admin-contenido admin-contenido--tabla" : "mt-4"}>
      {puedeEditar && (
        <div>
          <h3>{form.id ? "Editar producto" : "Crear producto"}</h3>
          <form className="formulario-admin" onSubmit={guardar} noValidate>
            <label htmlFor="ap-codigo">Código</label>
            <input id="ap-codigo" value={form.codigo} onChange={(e) => cambiar("codigo", e.target.value)} maxLength={20} required />
            <label htmlFor="ap-nombre">Nombre</label>
            <input id="ap-nombre" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} maxLength={120} required />
            <label htmlFor="ap-descripcion">Descripción</label>
            <textarea id="ap-descripcion" value={form.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} maxLength={1000} />
            <label htmlFor="ap-precio">Precio</label>
            <input id="ap-precio" type="number" min="1" value={form.precio} onChange={(e) => cambiar("precio", e.target.value)} required />
            <label htmlFor="ap-oferta">Precio oferta (opcional)</label>
            <input id="ap-oferta" type="number" min="1" value={form.precioOferta} onChange={(e) => cambiar("precioOferta", e.target.value)} />
            <label htmlFor="ap-stock">Stock</label>
            <input id="ap-stock" type="number" min="0" value={form.stock} onChange={(e) => cambiar("stock", e.target.value)} required />
            <label htmlFor="ap-critico">Stock crítico</label>
            <input id="ap-critico" type="number" min="0" value={form.stockCritico} onChange={(e) => cambiar("stockCritico", e.target.value)} required />
            <label htmlFor="ap-categoria">Categoría</label>
            <select id="ap-categoria" value={form.categoriaId} onChange={(e) => cambiar("categoriaId", e.target.value)} required>
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <label htmlFor="ap-emoji">Emoji de respaldo</label>
            <input id="ap-emoji" value={form.emoji} onChange={(e) => cambiar("emoji", e.target.value)} maxLength={16} />
            <label htmlFor="ap-imagen">URL de imagen</label>
            <input id="ap-imagen" value={form.imagen} onChange={(e) => cambiar("imagen", e.target.value)} placeholder="/img/archivo.webp o https://..." />
            <div className="acciones-admin">
              <button type="submit">{form.id ? "Guardar cambios" : "Crear producto"}</button>
              {form.id && <button type="button" className="boton-secundario-admin" onClick={() => setForm(productoVacio)}>Cancelar</button>}
            </div>
          </form>
        </div>
      )}

      <div>
        <h3>Productos ({productos.length})</h3>
        {aviso && <div className={`alert alert-${aviso.tipo} py-2`} role="status">{aviso.texto}</div>}
        <input
          className="form-control mb-2"
          type="search"
          placeholder="Buscar por código, nombre o categoría"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Buscar productos"
        />
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Stock</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td className="text-end">
                    {formatearPrecio(p.precioFinal)}
                    {p.enOferta && <span className="badge bg-danger ms-1">Oferta</span>}
                  </td>
                  <td className="text-end">
                    <span className={p.stockBajo ? "badge bg-danger" : ""}>{p.stock}</span>
                  </td>
                  <td className="text-end text-nowrap">
                    <button type="button" className="btn btn-sm btn-outline-info me-1" onClick={() => setSeleccionado(p)}>Ver</button>
                    {puedeEditar && (
                      <>
                        <button type="button" className="btn btn-sm btn-outline-warning me-1" onClick={() => editar(p)}>Editar</button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {seleccionado && (
        <div
          className="confirmacion-admin-overlay"
          onClick={(e) => e.target === e.currentTarget && setSeleccionado(null)}
          onKeyDown={(e) => e.key === "Escape" && setSeleccionado(null)}
        >
          <div className="card card-body detalle-admin" role="dialog" aria-modal="true" aria-labelledby="detalle-producto-titulo">
            <h3 id="detalle-producto-titulo" className="h5">{seleccionado.nombre}</h3>
            {seleccionado.imagen && <img src={seleccionado.imagen} alt="" className="img-fluid rounded mb-2 detalle-admin-imagen" />}
            <dl className="row mb-2">
              <dt className="col-5">Código</dt><dd className="col-7">{seleccionado.codigo}</dd>
              <dt className="col-5">Categoría</dt><dd className="col-7">{seleccionado.categoria}</dd>
              <dt className="col-5">Precio</dt><dd className="col-7">{formatearPrecio(seleccionado.precio)}</dd>
              <dt className="col-5">Precio oferta</dt><dd className="col-7">{seleccionado.precioOferta ? formatearPrecio(seleccionado.precioOferta) : "Sin oferta"}</dd>
              <dt className="col-5">Stock</dt><dd className="col-7">{seleccionado.stock}</dd>
              <dt className="col-5">Stock crítico</dt><dd className="col-7">{seleccionado.stockCritico}</dd>
            </dl>
            <p className="small">{seleccionado.descripcion}</p>
            <button type="button" className="btn btn-warning" autoFocus onClick={() => setSeleccionado(null)}>Cerrar</button>
          </div>
        </div>
      )}
      {dialogo}
    </div>
  );
}

export default AdminProductos;
