import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/formato";
import { calcularTotal, precioUnitario } from "../utils/carrito";

function Carrito({
  carrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarDelCarrito,
  mostrarPagar = true
}) {
  const total = calcularTotal(carrito);
  const cantidadProductos = carrito.reduce(
    (acumulado, producto) => acumulado + producto.cantidad,
    0
  );

  return (
    <div>
      <h2>Mi carrito</h2>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">
          El carrito está vacío.
        </p>
      ) : (
        <div className="lista-carrito">
          {carrito.map((producto) => {
            const enElLimite = producto.stock !== undefined && producto.cantidad >= producto.stock;
            return (
              <article className="producto-carrito" key={producto.id}>
                <div>
                  <h3>{producto.emoji} {producto.nombre}</h3>
                  <p>Precio unitario: {formatearPrecio(precioUnitario(producto))}</p>
                </div>

                <div className="control-cantidad">
                  <button
                    type="button"
                    className="boton-cantidad"
                    onClick={() => disminuirCantidad(producto.id)}
                    aria-label={`Quitar una unidad de ${producto.nombre}`}
                  >
                    &minus;
                  </button>

                  <span aria-live="polite">{producto.cantidad}</span>

                  <button
                    type="button"
                    className="boton-cantidad"
                    onClick={() => aumentarCantidad(producto.id)}
                    aria-label={`Agregar una unidad de ${producto.nombre}`}
                    disabled={enElLimite}
                    title={enElLimite ? "No hay más stock disponible" : undefined}
                  >
                    +
                  </button>
                </div>

                <p className="subtotal-carrito">
                  Subtotal: {formatearPrecio(precioUnitario(producto) * producto.cantidad)}
                </p>

                <button
                  type="button"
                  className="eliminar-carrito"
                  onClick={() => eliminarDelCarrito(producto.id)}
                >
                  Eliminar
                </button>
              </article>
            );
          })}
        </div>
      )}

      <div className="resumen-carrito">
        <p>Productos en carrito: {cantidadProductos}</p>
        <p className="total-carrito">Total: {formatearPrecio(total)}</p>
        {mostrarPagar && carrito.length > 0 && (
          <Link to="/checkout" className="btn btn-warning btn-lg fw-bold">
            Ir a pagar
          </Link>
        )}
      </div>

      <Link to="/productos" className="boton-articulo">
        &larr; Seguir comprando
      </Link>
    </div>
  );
}

export default Carrito;
