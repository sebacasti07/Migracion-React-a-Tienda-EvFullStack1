import { Link } from "react-router-dom";

function Blogs({ articulos = [] }) {
  return (
    <section>
      <h2>Blog</h2>
      <div className="lista-blogs">
        {articulos.map((articulo) => (
          <article className="tarjeta-producto" key={articulo.slug}>
            <h3>{articulo.titulo}</h3>
            <p>{articulo.resumen}</p>
            <Link className="boton-articulo" to={`/blogs/${articulo.slug}`}>
              Leer artículo <span aria-hidden="true">&rarr;</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Blogs;
