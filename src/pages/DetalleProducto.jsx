import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PrecioProducto from "../components/PrecioProducto";
import { productosApi } from "../api/servicios";

// Detalle de un producto. Si el producto ya está en el catálogo cargado se usa ese;
// si no (por ejemplo al entrar directo por la URL), se pide a GET /api/v1/productos/{id}.
function DetalleProducto({ productos = [], agregarAlCarrito, mostrarAgregar = true }) {
  const { id } = useParams();
  const enCatalogo = productos.find((producto) => producto.id === Number(id));
  const [desdeApi, setDesdeApi] = useState(null);
  const [noExiste, setNoExiste] = useState(false);

  useEffect(() => {
    if (enCatalogo) return undefined;
    let activo = true;
    productosApi
      .obtener(id)
      .then((producto) => activo && setDesdeApi(producto))
      .catch(() => activo && setNoExiste(true));
    return () => {
      activo = false;
    };
  }, [id, enCatalogo]);

  const producto = enCatalogo ?? desdeApi;

  if (!producto) {
    return (
      <section className="detalle-producto">
        <Link className="boton-volver" to="/productos">
          ← Volver a productos
        </Link>
        {noExiste ? (
          <>
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no está disponible.</p>
          </>
        ) : (
          <p role="status">Cargando producto...</p>
        )}
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
          <h2><PrecioProducto producto={producto} /></h2>
          <p>{producto.descripcion}</p>
          {producto.stock !== undefined && (
            <p className={producto.stock === 0 ? "text-danger" : "text-secondary"}>
              {producto.stock === 0 ? "Sin stock" : `Stock disponible: ${producto.stock}`}
            </p>
          )}
          {agregarAlCarrito && mostrarAgregar && producto.stock !== 0 && (
            <button type="button" onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default DetalleProducto;
