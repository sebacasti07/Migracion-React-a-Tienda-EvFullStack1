import { Link } from "react-router-dom";

function NavbarLateral({ productos = [] }) {
  const categorias = [...new Set(productos.map((producto) => producto.categoria))]
    .map((nombre) => ({
      nombre,
      imagen: productos.find((producto) => producto.categoria === nombre && producto.imagen)?.imagen
    }));

  return (
    <aside className="navbar-lateral" aria-label="Menú de tienda">
      <h4>Categorías</h4>
      <hr />

      <Link className="enlace-categoria" to="/productos">
        Todos los productos
      </Link>

      {categorias.map((categoria) => (
        <Link
          className="enlace-categoria"
          to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
          key={categoria.nombre}
        >
          {categoria.imagen && <img src={categoria.imagen} alt="" aria-hidden="true" />}
          <span>{categoria.nombre}</span>
        </Link>
      ))}

      <hr />

      <Link className="enlace-categoria" to="/carrito">
        <span aria-hidden="true">🛒</span>
        <span>Mi carrito</span>
      </Link>
    </aside>
  );
}

export default NavbarLateral;