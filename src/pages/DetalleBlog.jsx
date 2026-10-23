import { Link, useParams } from "react-router-dom";

function DetalleBlog({ articulos = [] }) {
  const { slug } = useParams();
  const articulo = articulos.find((entrada) => entrada.slug === slug);

  if (!articulo) {
    return (
      <section>
        <h2>Artículo no encontrado</h2>
        <Link className="boton-articulo" to="/blogs">Volver al blog</Link>
      </section>
    );
  }

  return (
    <article className="detalle-blog">
      <div className="barra-pagina">
        <Link className="boton-articulo" to="/blogs">Volver al blog</Link>
      </div>
      <h2>{articulo.titulo}</h2>
      {articulo.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
    </article>
  );
}

export default DetalleBlog;
