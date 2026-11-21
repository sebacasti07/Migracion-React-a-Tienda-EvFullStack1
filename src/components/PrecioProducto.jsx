import { formatearPrecio } from "../utils/formato";

// Muestra el precio. Si el producto está en oferta muestra el precio normal tachado.
function PrecioProducto({ producto }) {
  if (producto.enOferta) {
    return (
      <p className="precio-producto">
        <span className="text-decoration-line-through text-secondary me-2">
          {formatearPrecio(producto.precio)}
        </span>
        <strong className="text-warning">{formatearPrecio(producto.precioFinal)}</strong>
      </p>
    );
  }
  return <p className="precio-producto">{formatearPrecio(producto.precio)}</p>;
}

export default PrecioProducto;
