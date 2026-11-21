import { useState } from "react";
import { useConfirmacion } from "./DialogoConfirmacion";

const articuloVacio = {
  slug: "",
  titulo: "",
  resumen: "",
  parrafosTexto: ""
};

// Blogs y textos del sitio (Nosotros y Contacto). Solo ADMIN.
// Este contenido sigue guardándose en el navegador (no forma parte del modelo de la tienda).
function AdminContenido({ seccion, articulos, guardarArticulos, contenido, guardarContenido }) {
  const [articuloForm, setArticuloForm] = useState(articuloVacio);
  const [subseccionSitio, setSubseccionSitio] = useState("nosotros");
  const [aviso, setAviso] = useState("");
  const { confirmar, dialogo } = useConfirmacion();

  function actualizarCampo(campo, valor) {
    setArticuloForm((actual) => ({ ...actual, [campo]: valor }));
  }

  function editarArticulo(articulo) {
    setArticuloForm({ ...articulo, slugOriginal: articulo.slug, parrafosTexto: articulo.parrafos.join("\n\n") });
    setAviso("");
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
      confirmar("¿Estás seguro de guardar los cambios del artículo?", () => {
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
    confirmar("¿Estás seguro de eliminar este artículo?", () => {
      guardarArticulos(articulos.filter((articulo) => articulo.slug !== slug));
      setArticuloForm((actual) => actual.slugOriginal === slug ? articuloVacio : actual);
      setAviso("Artículo eliminado.");
    }, true);
  }

  function actualizarSitio(grupo, campo, valor) {
    guardarContenido({
      ...contenido,
      [grupo]: { ...contenido[grupo], [campo]: valor }
    });
  }

  if (seccion === "blogs") {
    return (
      <div className="admin-contenido">
        <div>
          <h3>{articuloForm.slugOriginal ? "Editar artículo" : "Crear artículo"}</h3>
          <form className="formulario-admin" onSubmit={guardarArticulo}>
            <label htmlFor="admin-blog-slug">Identificador URL (sin espacios)</label>
            <input id="admin-blog-slug" value={articuloForm.slug} onChange={(e) => actualizarCampo("slug", e.target.value)} required />
            <label htmlFor="admin-blog-titulo">Título</label>
            <input id="admin-blog-titulo" value={articuloForm.titulo} onChange={(e) => actualizarCampo("titulo", e.target.value)} required />
            <label htmlFor="admin-blog-resumen">Resumen</label>
            <textarea id="admin-blog-resumen" value={articuloForm.resumen} onChange={(e) => actualizarCampo("resumen", e.target.value)} required />
            <label htmlFor="admin-blog-parrafos">Contenido (un párrafo por línea)</label>
            <textarea id="admin-blog-parrafos" value={articuloForm.parrafosTexto} onChange={(e) => actualizarCampo("parrafosTexto", e.target.value)} required />
            <div className="acciones-admin">
              <button type="submit">{articuloForm.slugOriginal ? "Guardar cambios" : "Crear artículo"}</button>
              {articuloForm.slugOriginal && <button type="button" className="boton-secundario-admin" onClick={() => setArticuloForm(articuloVacio)}>Cancelar</button>}
            </div>
          </form>
        </div>
        <div>
          <h3>Artículos ({articulos.length})</h3>
          {aviso && <p className="mensaje-admin" role="status">{aviso}</p>}
          <ul className="lista-admin">
            {articulos.map((articulo) => (
              <li key={articulo.slug}>
                <span>{articulo.titulo}</span>
                <div className="acciones-admin">
                  <button type="button" onClick={() => editarArticulo(articulo)}>Editar</button>
                  <button type="button" className="boton-eliminar-admin" onClick={() => eliminarArticulo(articulo.slug)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {dialogo}
      </div>
    );
  }

  return (
    <div className="admin-sitio">
      <div className="pestanas-admin">
        <button type="button" className={subseccionSitio === "nosotros" ? "pestana-admin activa" : "pestana-admin"} onClick={() => setSubseccionSitio("nosotros")}>Nosotros</button>
        <button type="button" className={subseccionSitio === "contacto" ? "pestana-admin activa" : "pestana-admin"} onClick={() => setSubseccionSitio("contacto")}>Contacto</button>
      </div>
      {subseccionSitio === "nosotros" ? (
        <div className="formulario-admin formulario-sitio">
          <label htmlFor="admin-nosotros-titulo">Título</label>
          <input id="admin-nosotros-titulo" value={contenido.nosotros.titulo} onChange={(e) => actualizarSitio("nosotros", "titulo", e.target.value)} />
          <label htmlFor="admin-nosotros-subtitulo">Subtítulo</label>
          <input id="admin-nosotros-subtitulo" value={contenido.nosotros.subtitulo} onChange={(e) => actualizarSitio("nosotros", "subtitulo", e.target.value)} />
          {contenido.nosotros.parrafos.map((parrafo, index) => (
            <div key={index}>
              <label htmlFor={`admin-nosotros-parrafo-${index}`}>Texto {index + 1}</label>
              <textarea id={`admin-nosotros-parrafo-${index}`} value={parrafo} onChange={(e) => {
                const parrafos = [...contenido.nosotros.parrafos];
                parrafos[index] = e.target.value;
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
              <input id={`admin-contacto-${campo}`} value={contenido.contacto[campo]} onChange={(e) => actualizarSitio("contacto", campo, e.target.value)} />
            </div>
          ))}
          <p className="nota-login">Los cambios se guardan mientras editas.</p>
        </div>
      )}
    </div>
  );
}

export default AdminContenido;
