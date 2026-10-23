import { useState } from "react";
import { Navigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";

const productoVacio = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "Periféricos",
  emoji: "🛍️",
  imagen: ""
};

const articuloVacio = {
  slug: "",
  titulo: "",
  resumen: "",
  parrafosTexto: ""
};

function Admin({
  productos,
  guardarProductos,
  articulos,
  guardarArticulos,
  usuarios,
  guardarUsuarios,
  contenido,
  guardarContenido
}) {
  const [seccion, setSeccion] = useState("productos");
  const [subseccionSitio, setSubseccionSitio] = useState("nosotros");
  const [productoForm, setProductoForm] = useState(productoVacio);
  const [articuloForm, setArticuloForm] = useState(articuloVacio);
  const [usuarioForm, setUsuarioForm] = useState({ usuario: "", password: "" });
  const [usuarioEditado, setUsuarioEditado] = useState("");
  const [aviso, setAviso] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);

  if (sessionStorage.getItem("rol") !== "admin") {
    return <Navigate to="/login" replace />;
  }

  function editarProducto(producto) {
    confirmarAccion("¿Estás seguro de editar este producto?", () => {
      setProductoForm({ ...producto, precio: String(producto.precio) });
      setAviso("");
    });
  }

  function guardarProducto(event) {
    event.preventDefault();
    const nombre = productoForm.nombre.trim();
    const precio = Number(productoForm.precio);
    if (!nombre || !productoForm.descripcion.trim() || !Number.isFinite(precio) || precio <= 0) {
      setAviso("Completa el nombre, la descripción y un precio mayor a cero.");
      return;
    }

    if (productoForm.id) {
      confirmarAccion("¿Estás seguro de guardar los cambios del producto?", () => {
        guardarProductos(productos.map((producto) =>
          producto.id === productoForm.id
            ? { ...productoForm, nombre, precio }
            : producto
        ));
        setAviso("Producto actualizado.");
        setProductoForm(productoVacio);
      });
      return;
    }

    const id = productos.reduce((mayor, producto) => Math.max(mayor, producto.id), 0) + 1;
    guardarProductos([...productos, { ...productoForm, id, nombre, precio }]);
    setAviso("Producto creado.");
    setProductoForm(productoVacio);
  }

  function eliminarProducto(id) {
    confirmarAccion("¿Estás seguro de eliminar este producto?", () => {
      guardarProductos(productos.filter((producto) => producto.id !== id));
      setProductoForm((actual) => actual.id === id ? productoVacio : actual);
      setAviso("Producto eliminado.");
    }, true);
  }

  function editarArticulo(articulo) {
    confirmarAccion("¿Estás seguro de editar este artículo?", () => {
      setArticuloForm({
        ...articulo,
        parrafosTexto: articulo.parrafos.join("\n\n")
      });
      setAviso("");
    });
  }

  function guardarArticulo(event) {
    event.preventDefault();
    const slug = articuloForm.slug.trim().toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const titulo = articuloForm.titulo.trim();
    const resumen = articuloForm.resumen.trim();
    const parrafos = articuloForm.parrafosTexto.split(/\n+/).map((texto) => texto.trim()).filter(Boolean);
    const duplicado = articulos.some((articulo) =>
      articulo.slug === slug && articulo.slug !== articuloForm.slugOriginal
    );
    if (!slug || !titulo || !resumen || parrafos.length === 0 || duplicado) {
      setAviso(duplicado ? "Ya existe un artículo con ese identificador." : "Completa todos los campos del artículo.");
      return;
    }

    const nuevoArticulo = { slug, titulo, resumen, parrafos };
    if (articuloForm.slugOriginal) {
      confirmarAccion("¿Estás seguro de guardar los cambios del artículo?", () => {
        guardarArticulos(articulos.map((articulo) =>
          articulo.slug === articuloForm.slugOriginal ? nuevoArticulo : articulo
        ));
        setAviso("Artículo actualizado.");
        setArticuloForm(articuloVacio);
      });
      return;
    }

    guardarArticulos([...articulos, nuevoArticulo]);
    setAviso("Artículo creado.");
    setArticuloForm(articuloVacio);
  }

  function eliminarArticulo(slug) {
    confirmarAccion("¿Estás seguro de eliminar este artículo?", () => {
      guardarArticulos(articulos.filter((articulo) => articulo.slug !== slug));
      setArticuloForm((actual) => actual.slugOriginal === slug ? articuloVacio : actual);
      setAviso("Artículo eliminado.");
    }, true);
  }

  function guardarUsuario(event) {
    event.preventDefault();
    const nombre = usuarioForm.usuario.trim();
    const duplicado = usuarios.some((cuenta) =>
      cuenta.usuario.toLowerCase() === nombre.toLowerCase() &&
      cuenta.usuario !== usuarioEditado
    );
    if (!nombre || nombre.toLowerCase() === "admin" || duplicado) {
      setAviso(duplicado ? "Ese usuario ya existe." : "Ingresa un nombre válido que no sea admin.");
      return;
    }

    if (usuarioEditado) {
      confirmarAccion("¿Estás seguro de guardar los cambios del usuario?", () => {
        const actualizados = usuarios.map((cuenta) => {
          if (cuenta.usuario !== usuarioEditado) return cuenta;
          return {
            ...cuenta,
            usuario: nombre,
            ...(usuarioForm.password ? { password: usuarioForm.password } : {})
          };
        });
        guardarUsuarios(actualizados);
        setAviso("Usuario actualizado.");
        setUsuarioForm({ usuario: "", password: "" });
        setUsuarioEditado("");
      });
      return;
    }

    if (usuarioForm.password.length < 4) {
      setAviso("La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    guardarUsuarios([...usuarios, { usuario: nombre, password: usuarioForm.password }]);
    setAviso("Usuario creado.");
    setUsuarioForm({ usuario: "", password: "" });
    setUsuarioEditado("");
  }

  function eliminarUsuario(nombre) {
    confirmarAccion("¿Estás seguro de eliminar este usuario?", () => {
      guardarUsuarios(usuarios.filter((cuenta) => cuenta.usuario !== nombre));
      if (usuarioEditado === nombre) {
        setUsuarioEditado("");
        setUsuarioForm({ usuario: "", password: "" });
      }
      setAviso("Usuario eliminado.");
    }, true);
  }

  function actualizarSitio(grupo, campo, valor) {
    guardarContenido({
      ...contenido,
      [grupo]: { ...contenido[grupo], [campo]: valor }
    });
  }

  function actualizarCampo(setFormulario, campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function confirmarAccion(mensaje, accion, esEliminacion = false) {
    setConfirmacion({ mensaje, accion, esEliminacion });
  }

  function ejecutarConfirmacion() {
    if (!confirmacion) return;
    const { accion } = confirmacion;
    setConfirmacion(null);
    accion();
  }

  return (
    <section className="panel-admin">
      <h2>Panel de administración</h2>
      <p className="aviso-demo">
        Panel de demostración: los cambios se guardan solo en este navegador.
        No uses datos reales ni contraseñas reutilizadas.
      </p>

      <div className="pestanas-admin" role="tablist" aria-label="Secciones de administración">
        {[
          ["productos", "Productos"],
          ["blogs", "Blogs"],
          ["sitio", "Nosotros y contacto"],
          ["usuarios", "Usuarios"]
        ].map(([id, titulo]) => (
          <button
            type="button"
            role="tab"
            aria-selected={seccion === id}
            className={seccion === id ? "pestana-admin activa" : "pestana-admin"}
            key={id}
            onClick={() => { setSeccion(id); setAviso(""); }}
          >
            {titulo}
          </button>
        ))}
      </div>

      {aviso && <p className="mensaje-admin" role="status">{aviso}</p>}

      {seccion === "productos" && (
        <div className="admin-contenido">
          <div>
            <h3>{productoForm.id ? "Editar producto" : "Crear producto"}</h3>
            <form className="formulario-admin" onSubmit={guardarProducto}>
              <label htmlFor="admin-producto-nombre">Nombre</label>
              <input id="admin-producto-nombre" value={productoForm.nombre} onChange={(event) => actualizarCampo(setProductoForm, "nombre", event.target.value)} required />
              <label htmlFor="admin-producto-descripcion">Descripción</label>
              <textarea id="admin-producto-descripcion" value={productoForm.descripcion} onChange={(event) => actualizarCampo(setProductoForm, "descripcion", event.target.value)} required />
              <label htmlFor="admin-producto-precio">Precio</label>
              <input id="admin-producto-precio" type="number" min="1" value={productoForm.precio} onChange={(event) => actualizarCampo(setProductoForm, "precio", event.target.value)} required />
              <label htmlFor="admin-producto-categoria">Categoría</label>
              <input id="admin-producto-categoria" value={productoForm.categoria} onChange={(event) => actualizarCampo(setProductoForm, "categoria", event.target.value)} required />
              <label htmlFor="admin-producto-emoji">Emoji de respaldo</label>
              <input id="admin-producto-emoji" value={productoForm.emoji} onChange={(event) => actualizarCampo(setProductoForm, "emoji", event.target.value)} />
              <label htmlFor="admin-producto-imagen">URL de imagen</label>
              <input id="admin-producto-imagen" type="url" value={productoForm.imagen} onChange={(event) => actualizarCampo(setProductoForm, "imagen", event.target.value)} placeholder="https://..." />
              <div className="acciones-admin">
                <button type="submit">{productoForm.id ? "Guardar cambios" : "Crear producto"}</button>
                {productoForm.id && <button type="button" className="boton-secundario-admin" onClick={() => setProductoForm(productoVacio)}>Cancelar</button>}
              </div>
            </form>
          </div>
          <div>
            <h3>Productos ({productos.length})</h3>
            <ul className="lista-admin">
              {productos.map((producto) => (
                <li key={producto.id}>
                  <span>{producto.nombre}</span>
                  <div className="acciones-admin">
                    <button type="button" onClick={() => editarProducto(producto)}>Editar</button>
                    <button type="button" className="boton-eliminar-admin" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {seccion === "blogs" && (
        <div className="admin-contenido">
          <div>
            <h3>{articuloForm.slugOriginal ? "Editar artículo" : "Crear artículo"}</h3>
            <form className="formulario-admin" onSubmit={guardarArticulo}>
              <label htmlFor="admin-blog-slug">Identificador URL (sin espacios)</label>
              <input id="admin-blog-slug" value={articuloForm.slug} onChange={(event) => actualizarCampo(setArticuloForm, "slug", event.target.value)} required />
              <label htmlFor="admin-blog-titulo">Título</label>
              <input id="admin-blog-titulo" value={articuloForm.titulo} onChange={(event) => actualizarCampo(setArticuloForm, "titulo", event.target.value)} required />
              <label htmlFor="admin-blog-resumen">Resumen</label>
              <textarea id="admin-blog-resumen" value={articuloForm.resumen} onChange={(event) => actualizarCampo(setArticuloForm, "resumen", event.target.value)} required />
              <label htmlFor="admin-blog-parrafos">Contenido (un párrafo por línea)</label>
              <textarea id="admin-blog-parrafos" value={articuloForm.parrafosTexto} onChange={(event) => actualizarCampo(setArticuloForm, "parrafosTexto", event.target.value)} required />
              <div className="acciones-admin">
                <button type="submit">{articuloForm.slugOriginal ? "Guardar cambios" : "Crear artículo"}</button>
                {articuloForm.slugOriginal && <button type="button" className="boton-secundario-admin" onClick={() => setArticuloForm(articuloVacio)}>Cancelar</button>}
              </div>
            </form>
          </div>
          <div>
            <h3>Artículos ({articulos.length})</h3>
            <ul className="lista-admin">
              {articulos.map((articulo) => (
                <li key={articulo.slug}>
                  <span>{articulo.titulo}</span>
                  <div className="acciones-admin">
                    <button type="button" onClick={() => editarArticulo({ ...articulo, slugOriginal: articulo.slug })}>Editar</button>
                    <button type="button" className="boton-eliminar-admin" onClick={() => eliminarArticulo(articulo.slug)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {seccion === "sitio" && (
        <div className="admin-sitio">
          <div className="pestanas-admin">
            <button type="button" className={subseccionSitio === "nosotros" ? "pestana-admin activa" : "pestana-admin"} onClick={() => setSubseccionSitio("nosotros")}>Nosotros</button>
            <button type="button" className={subseccionSitio === "contacto" ? "pestana-admin activa" : "pestana-admin"} onClick={() => setSubseccionSitio("contacto")}>Contacto</button>
          </div>
          {subseccionSitio === "nosotros" ? (
            <div className="formulario-admin formulario-sitio">
              <label htmlFor="admin-nosotros-titulo">Título</label>
              <input id="admin-nosotros-titulo" value={contenido.nosotros.titulo} onChange={(event) => actualizarSitio("nosotros", "titulo", event.target.value)} />
              <label htmlFor="admin-nosotros-subtitulo">Subtítulo</label>
              <input id="admin-nosotros-subtitulo" value={contenido.nosotros.subtitulo} onChange={(event) => actualizarSitio("nosotros", "subtitulo", event.target.value)} />
              {contenido.nosotros.parrafos.map((parrafo, index) => (
                <div key={index}>
                  <label htmlFor={`admin-nosotros-parrafo-${index}`}>Texto {index + 1}</label>
                  <textarea id={`admin-nosotros-parrafo-${index}`} value={parrafo} onChange={(event) => {
                    const parrafos = [...contenido.nosotros.parrafos];
                    parrafos[index] = event.target.value;
                    guardarContenido({ ...contenido, nosotros: { ...contenido.nosotros, parrafos } });
                  }} />
                </div>
              ))}
              <p className="nota-login">Los cambios se guardan mientras editas.</p>
            </div>
          ) : (
            <div className="formulario-admin formulario-sitio">
              {[
                ["direccion", "Dirección"],
                ["whatsapp", "Enlace de WhatsApp"],
                ["facebook", "Enlace de Facebook"],
                ["instagram", "Enlace de Instagram"],
                ["tiktok", "Enlace de TikTok"],
                ["mapaUrl", "URL para insertar el mapa"]
              ].map(([campo, titulo]) => (
                <div key={campo}>
                  <label htmlFor={`admin-contacto-${campo}`}>{titulo}</label>
                  <input id={`admin-contacto-${campo}`} value={contenido.contacto[campo]} onChange={(event) => actualizarSitio("contacto", campo, event.target.value)} />
                </div>
              ))}
              <p className="nota-login">Los cambios se guardan mientras editas.</p>
            </div>
          )}
        </div>
      )}

      {seccion === "usuarios" && (
        <div className="admin-contenido">
          <div>
            <h3>{usuarioEditado ? "Editar usuario" : "Crear usuario"}</h3>
            <form className="formulario-admin" onSubmit={guardarUsuario}>
              <label htmlFor="admin-usuario-nombre">Usuario</label>
              <input id="admin-usuario-nombre" value={usuarioForm.usuario} onChange={(event) => actualizarCampo(setUsuarioForm, "usuario", event.target.value)} required />
              <label htmlFor="admin-usuario-password">Contraseña {usuarioEditado && "(dejar vacía para conservarla)"}</label>
              <CampoContraseña id="admin-usuario-password" autoComplete="new-password" value={usuarioForm.password} onChange={(event) => actualizarCampo(setUsuarioForm, "password", event.target.value)} required={!usuarioEditado} />
              <div className="acciones-admin">
                <button type="submit">{usuarioEditado ? "Guardar cambios" : "Crear usuario"}</button>
                {usuarioEditado && <button type="button" className="boton-secundario-admin" onClick={() => { setUsuarioEditado(""); setUsuarioForm({ usuario: "", password: "" }); }}>Cancelar</button>}
              </div>
            </form>
            <p className="nota-login">Las cuentas y contraseñas se guardan localmente en texto sin cifrar. Esta función es solo para demostración.</p>
          </div>
          <div>
            <h3>Usuarios ({usuarios.length})</h3>
            <ul className="lista-admin">
              {usuarios.map((cuenta) => (
                <li key={cuenta.usuario}>
                  <span>{cuenta.usuario}</span>
                  <div className="acciones-admin">
                    <button type="button" onClick={() => { setUsuarioEditado(cuenta.usuario); setUsuarioForm({ usuario: cuenta.usuario, password: "" }); }}>Editar</button>
                    <button type="button" className="boton-eliminar-admin" onClick={() => eliminarUsuario(cuenta.usuario)}>Eliminar</button>
                  </div>
                </li>
              ))}
              {usuarios.length === 0 && <li>No hay cuentas registradas.</li>}
            </ul>
          </div>
        </div>
      )}

      {confirmacion && (
        <div
          className="confirmacion-admin-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirmacion(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setConfirmacion(null);
              return;
            }
            if (event.key === "Tab") {
              const botones = event.currentTarget.querySelectorAll("button");
              const primero = botones[0];
              const ultimo = botones[botones.length - 1];
              if (event.shiftKey && document.activeElement === primero) {
                event.preventDefault();
                ultimo.focus();
              } else if (!event.shiftKey && document.activeElement === ultimo) {
                event.preventDefault();
                primero.focus();
              }
            }
          }}
        >
          <div
            className={`confirmacion-admin${confirmacion.esEliminacion ? " confirmacion-admin--destructiva" : ""}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmacion-admin-titulo"
            aria-describedby="confirmacion-admin-mensaje"
          >
            <span className="confirmacion-admin-icono" aria-hidden="true">
              {confirmacion.esEliminacion ? "!" : "?"}
            </span>
            <h3 id="confirmacion-admin-titulo">¿Confirmas esta acción?</h3>
            <p id="confirmacion-admin-mensaje">{confirmacion.mensaje}</p>
            <div className="confirmacion-admin-acciones">
              <button
                type="button"
                className="confirmacion-admin-cancelar"
                autoFocus
                onClick={() => setConfirmacion(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="confirmacion-admin-aceptar"
                onClick={ejecutarConfirmacion}
              >
                {confirmacion.esEliminacion ? "Sí, eliminar" : "Sí, continuar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Admin;
