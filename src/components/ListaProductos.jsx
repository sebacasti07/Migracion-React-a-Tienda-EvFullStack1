import Producto from "./Producto";

const precioDe = (producto) => producto.precioFinal ?? producto.precio;

function ListaProductos({
  productos = [],
  agregarAlCarrito,
  categoria,
  busqueda = "",
  ordenPrecio = "desc",
  mostrarAgregar = true
}) {
  const consulta = busqueda.trim().toLocaleLowerCase();
  const productosFiltrados = (categoria
    ? productos.filter((producto) => producto.categoria === categoria)
    : productos)
    .filter((producto) => producto.nombre.toLocaleLowerCase().includes(consulta))
    .sort((a, b) =>
      ordenPrecio === "asc" ? precioDe(a) - precioDe(b) : precioDe(b) - precioDe(a)
    );

  return (
    <div className="lista-productos">
      {productosFiltrados.length > 0 ? productosFiltrados.map(producto => (
        <Producto
          key={producto.id}
          producto={producto}
          agregarAlCarrito={agregarAlCarrito}
          mostrarAgregar={mostrarAgregar}
        />
      )) : (
        <p role="status">No hay productos en esta categoría.</p>
      )}
    </div>
  );
}

export default ListaProductos;
