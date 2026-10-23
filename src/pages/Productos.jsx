import { useState } from "react";
import ListaProductos from "../components/ListaProductos";
import NavbarLateral from "../components/NavbarLateral";
import { useSearchParams } from "react-router-dom";

function Productos({ agregarAlCarrito, productos }) {
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria");
  const [busqueda, setBusqueda] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("desc");

  return (
    <section className="pagina-productos">
      <h2>{categoria || "Todos nuestros productos"}</h2>

      <p className="descripcion-seccion">
        {categoria
          ? `Productos de la categoría ${categoria}.`
          : "Explora nuestro catálogo de productos."}
      </p>

      <div className="controles-catalogo">
        <div className="barra-busqueda-productos">
          <label htmlFor="buscar-productos">Buscar productos</label>
          <input
            id="buscar-productos"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Escribe el nombre de un producto"
          />
        </div>
        <div className="orden-productos">
          <label htmlFor="orden-precio">Ordenar por</label>
          <select
            id="orden-precio"
            value={ordenPrecio}
            onChange={(event) => setOrdenPrecio(event.target.value)}
          >
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </div>
      </div>

      <div className="layout-tienda">
        <NavbarLateral productos={productos} />
        <div className="productos-catalogo">
          <ListaProductos
            productos={productos}
            agregarAlCarrito={agregarAlCarrito}
            categoria={categoria}
            busqueda={busqueda}
            ordenPrecio={ordenPrecio}
          />
        </div>
      </div>
    </section>
  );
}

export default Productos;
