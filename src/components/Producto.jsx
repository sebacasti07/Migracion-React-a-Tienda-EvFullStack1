import { formatearPrecio } from "../utils/formato";
import { Link } from "react-router-dom";
import PrecioProducto from "./PrecioProducto";

// Tarjeta de un producto. Recibe por props el producto, la función para agregar
// al carrito y si se debe mostrar el botón (el vendedor no compra).
function Producto({ producto, agregarAlCarrito, mostrarAgregar = true }) {
  const sinStock = producto.stock === 0;

  return (
    <article className="tarjeta-producto position-relative">
      {producto.enOferta && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">Oferta</span>
      )}
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
          <PrecioProducto producto={producto} />
        </div>
      </Link>

      {mostrarAgregar && (
        <button
          type="button"
          onClick={() => agregarAlCarrito(producto)}
          disabled={sinStock}
          title={sinStock ? "Sin stock" : `Agregar por ${formatearPrecio(producto.precioFinal ?? producto.precio)}`}
        >
          {sinStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      )}
    </article>
  );
}

export default Producto;
