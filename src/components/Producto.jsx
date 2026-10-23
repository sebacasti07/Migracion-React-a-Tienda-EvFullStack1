import { formatearPrecio } from "../utils/formato";
import { Link } from "react-router-dom";

function Producto({ producto, agregarAlCarrito }) {

  return (
    <article className="tarjeta-producto">
      <Link
        className="enlace-detalle-producto"
        to={`/productos/${producto.id}`}
        aria-label={`Ver descripción de ${producto.nombre}`}
      >
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} />
        ) : (
          <div
            className="imagen-producto-placeholder"
            role="img"
            aria-label={producto.nombre}
          >
            <span aria-hidden="true">{producto.emoji}</span>
          </div>
        )}

        <div className="resumen-producto">
          <h3>{producto.nombre}</h3>

          <p className="precio-producto">
            {formatearPrecio(producto.precio)}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => agregarAlCarrito(producto)}
      >
        Agregar al carrito
      </button>

    </article>
  );
}

export default Producto;
