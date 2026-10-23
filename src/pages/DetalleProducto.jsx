import { Link, useParams } from "react-router-dom";

import { formatearPrecio } from "../utils/formato";

function DetalleProducto({ productos = [] }) {
  const { id } = useParams();
  const producto = productos.find(
    producto => producto.id === Number(id)
  );

  if (!producto) {
    return (
      <section className="detalle-producto">
        <Link className="boton-volver" to="/productos">
          ← Volver a productos
        </Link>
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no está disponible.</p>
      </section>
    );
  }

  return (
    <section className="detalle-producto">
      <Link className="boton-volver" to="/productos">
        ← Volver a productos
      </Link>
      <div className="detalle-contenido">
        <div className="detalle-imagen">
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
        </div>

        <div className="detalle-informacion">
          <p className="categoria-producto">{producto.categoria}</p>
          <h1>{producto.emoji} {producto.nombre}</h1>
          <h2>{formatearPrecio(producto.precio)}</h2>
          <p>{producto.descripcion}</p>
        </div>
      </div>
    </section>
  );
}

export default DetalleProducto;