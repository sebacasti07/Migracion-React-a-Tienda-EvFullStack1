import { Link } from "react-router-dom";
import Cargando from "../components/Cargando";
import { formatearPrecio } from "../utils/formato";

// Vista de categorías: una tarjeta por categoría con cantidad de productos y precio desde.
function Categorias({ productos = [], categorias = [], cargando = false }) {
  if (cargando) return <Cargando texto="Cargando categorías..." />;

  return (
    <section className="pagina-categorias">
      <h2>Categorías</h2>
      <p className="descripcion-seccion">Elige una categoría para ver sus productos.</p>

      <div className="row g-4">
        {categorias.map((categoria) => {
          const suyos = productos.filter((p) => p.categoria === categoria.nombre);
          const imagen = suyos.find((p) => p.imagen)?.imagen;
          const desde = suyos.length ? Math.min(...suyos.map((p) => p.precioFinal ?? p.precio)) : null;
          return (
            <div className="col-12 col-sm-6 col-lg-4" key={categoria.id}>
              <Link
                to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
                className="card h-100 text-decoration-none tarjeta-categoria"
              >
                {imagen ? (
                  <img src={imagen} className="card-img-top" alt="" />
                ) : (
                  <div className="card-img-top imagen-producto-placeholder"><span aria-hidden="true">🛍️</span></div>
                )}
                <div className="card-body">
                  <h3 className="card-title h5">{categoria.nombre}</h3>
                  <p className="card-text text-secondary mb-1">{categoria.descripcion}</p>
                  <p className="card-text mb-0">
                    {suyos.length} producto{suyos.length === 1 ? "" : "s"}
                    {desde !== null && <> · desde <strong>{formatearPrecio(desde)}</strong></>}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
        {categorias.length === 0 && <p role="status">No hay categorías disponibles.</p>}
      </div>
    </section>
  );
}

export default Categorias;
