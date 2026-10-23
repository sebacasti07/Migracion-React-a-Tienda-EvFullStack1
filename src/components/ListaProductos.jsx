import Producto from "./Producto";

function ListaProductos({ productos = [], agregarAlCarrito, categoria, busqueda = "", ordenPrecio = "desc" }) {
  const consulta = busqueda.trim().toLocaleLowerCase();
  const productosFiltrados = (categoria
    ? productos.filter((producto) => producto.categoria === categoria)
    : productos)
    .filter((producto) => producto.nombre.toLocaleLowerCase().includes(consulta))
    .sort((a, b) =>
      ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

  return (
    <div className="lista-productos">

      {productosFiltrados.length > 0 ? productosFiltrados.map(producto => (

        <Producto
          key={producto.id}
          producto={producto}
          agregarAlCarrito={agregarAlCarrito}
        />

      )) : (
        <p role="status">No hay productos en esta categoría.</p>
      )}

    </div>
  );
}

export default ListaProductos;